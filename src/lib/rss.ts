import { htmlToText } from 'html-to-text';
import parseFeed from 'rss-to-json';
import { array, number, object, optional, parse, string } from 'valibot';

import { optimizeImage } from './optimize-episode-image';
import { dasherize } from '../utils/dasherize';
import { truncate } from '../utils/truncate';
import starpodConfig from '../../starpod.config';

const AUDIO_BASE_URL = 'https://audio.getspoiled.club/podcasts/getspoiled';

function buildAudioUrl(episodeNumber: string, slug: string): string {
  const paddedNum = episodeNumber.padStart(2, '0');
  return `${AUDIO_BASE_URL}/${paddedNum}-${slug}.mp3`;
}

function cleanEpisodeTitle(rawTitle: string): { title: string; episodeNumber?: string } {
  let title = rawTitle;
  let episodeNumber: string | undefined;

  // Strip "Get Spoiled- " prefix
  title = title.replace(/^Get Spoiled-\s*/, '');

  // Extract and strip "Episode X- " prefix
  const epMatch = title.match(/^Episode\s+(\d+)-\s*/);
  if (epMatch) {
    episodeNumber = epMatch[1];
    title = title.slice(epMatch[0].length);
  }

  return { title: title.trim(), episodeNumber };
}

export interface Show {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface Episode {
  id: string;
  title: string;
  published: number;
  description: string;
  duration: number;
  content: string;
  episodeImage?: string;
  episodeNumber?: string;
  episodeSlug: string;
  episodeThumbnail?: string;
  audio: {
    src: string;
    type: string;
  };
}

let showInfoCache: Show | null = null;

export async function getShowInfo() {
  if (showInfoCache) {
    return showInfoCache;
  }

  // @ts-expect-error
  const showInfo = (await parseFeed.parse(starpodConfig.rssFeed)) as Show;
  showInfo.image = (await optimizeImage(showInfo.image, {
    height: 640,
    width: 640
  })) as string;

  showInfoCache = showInfo;
  return showInfo;
}

let episodesCache: Array<Episode> | null = null;

export async function getAllEpisodes() {
  if (episodesCache) {
    return episodesCache;
  }
  let FeedSchema = object({
    items: array(
      object({
        id: string(),
        title: string(),
        published: number(),
        description: string(),
        content_encoded: optional(string()),
        itunes_duration: number(),
        itunes_episode: optional(number()),
        itunes_episodeType: string(),
        itunes_image: optional(object({ href: optional(string()) })),
        enclosures: array(
          object({
            url: string(),
            type: string()
          })
        )
      })
    )
  });

  // @ts-expect-error
  let feed = (await parseFeed.parse(starpodConfig.rssFeed)) as Show;
  let items = parse(FeedSchema, feed).items;

  let episodes: Array<Episode> = await Promise.all(
    items
      .filter((item) => item.itunes_episodeType !== 'trailer')
      .map(
        async ({
          description,
          content_encoded,
          id,
          title,
          enclosures,
          published,
          itunes_duration,
          itunes_episode,
          itunes_episodeType,
          itunes_image
        }) => {
          const cleaned = cleanEpisodeTitle(title);
          const episodeNumber =
            itunes_episodeType === 'bonus' ? 'Bonus' : (cleaned.episodeNumber || `${itunes_episode}`);
          const episodeSlug = dasherize(cleaned.title);
          const episodeContent = content_encoded || description;

          return {
            id,
            title: cleaned.title,
            content: episodeContent,
            description: truncate(htmlToText(description), 260),
            duration: itunes_duration,
            episodeImage: itunes_image?.href,
            episodeNumber,
            episodeSlug,
            episodeThumbnail: await optimizeImage(itunes_image?.href),
            published,
            audio: {
              src: episodeNumber !== 'Bonus'
                ? buildAudioUrl(episodeNumber, episodeSlug)
                : enclosures[0].url,
              type: 'audio/mpeg'
            }
          };
        }
      )
  );

  episodesCache = episodes;
  return episodes;
}
