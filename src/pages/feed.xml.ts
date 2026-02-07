import type { APIRoute } from 'astro';
import { getAllEpisodes, getShowInfo } from '../lib/rss';
import starpodConfig from '../../starpod.config';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const GET: APIRoute = async ({ site }) => {
  const episodes = await getAllEpisodes();
  const show = await getShowInfo();
  const siteUrl = site?.toString() || 'https://getspoiled.club';

  const items = episodes
    .map((ep) => {
      const pubDate = new Date(ep.published).toUTCString();
      return `    <item>
      <title>${escapeXml(ep.title)}</title>
      <link>${siteUrl}${ep.episodeSlug}</link>
      <description>${escapeXml(ep.description)}</description>
      <enclosure url="${escapeXml(ep.audio.src)}" length="0" type="audio/mpeg" />
      <guid isPermaLink="false">${ep.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <itunes:title>${escapeXml(ep.title)}</itunes:title>
      <itunes:episode>${ep.episodeNumber}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:duration>${formatDuration(ep.duration)}</itunes:duration>
      <itunes:image href="${escapeXml(ep.episodeImage || show.image)}" />
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(show.title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(starpodConfig.description)}</description>
    <language>en</language>
    <copyright>Get Spoiled</copyright>
    <atom:link href="${siteUrl}feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(show.image)}</url>
      <title>${escapeXml(show.title)}</title>
      <link>${siteUrl}</link>
    </image>
    <itunes:author>Samantha Herman, Jeremy Knight &amp; Chris Wilson</itunes:author>
    <itunes:owner>
      <itunes:name>Samantha Herman</itunes:name>
    </itunes:owner>
    <itunes:image href="${escapeXml(show.image)}" />
    <itunes:category text="TV &amp; Film" />
    <itunes:category text="Comedy" />
    <itunes:explicit>yes</itunes:explicit>
    <itunes:type>episodic</itunes:type>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
