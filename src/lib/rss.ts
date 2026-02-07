import { htmlToText } from 'html-to-text';

import { optimizeImage } from './optimize-episode-image';
import { dasherize } from '../utils/dasherize';
import { truncate } from '../utils/truncate';
import episodeData from '../data/episodes.json';

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

  const showInfo: Show = {
    ...episodeData.show,
    image: (await optimizeImage(episodeData.show.image, {
      height: 640,
      width: 640
    })) as string
  };

  showInfoCache = showInfo;
  return showInfo;
}

let episodesCache: Array<Episode> | null = null;

export async function getAllEpisodes() {
  if (episodesCache) {
    return episodesCache;
  }

  let episodes: Array<Episode> = await Promise.all(
    episodeData.episodes
      .filter((item) => item.episodeType !== 'trailer')
      .map(async (item) => {
        const episodeSlug = dasherize(item.title);

        return {
          id: item.id,
          title: item.title,
          content: item.description,
          description: truncate(htmlToText(item.description), 260),
          duration: item.duration,
          episodeImage: item.episodeImage || undefined,
          episodeNumber: item.episodeType === 'bonus' ? 'Bonus' : item.episodeNumber,
          episodeSlug,
          episodeThumbnail: await optimizeImage(item.episodeImage || undefined),
          published: item.published,
          audio: {
            src: item.audioUrl,
            type: 'audio/mpeg'
          }
        };
      })
  );

  episodesCache = episodes;
  return episodes;
}
