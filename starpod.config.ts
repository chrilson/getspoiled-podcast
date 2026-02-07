import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  blurb:
    'Why buy a ticket when you can get the recap for free?',
  description:
    'Do you often see a trailer for a movie and you want to know what happens without actually having to watch it? Then this is the place for you. Get Spoiled is a film recap podcast where hosts Samantha Herman, Jeremy Knight, and Chris Wilson spoil movies so you don\'t have to watch them. Each episode dives into the plot of a feature film with casual discussion and plenty of spoilers.',
  hosts: [
    {
      name: 'Samantha Herman',
      bio: 'Co-host of Get Spoiled podcast.',
      img: 'avatar-light.png',
      github: '',
      twitter: '',
      website: ''
    },
    {
      name: 'Jeremy Knight',
      bio: 'Co-host of Get Spoiled podcast.',
      img: 'avatar-light.png',
      github: '',
      twitter: '',
      website: ''
    },
    {
      name: 'Chris Wilson',
      bio: 'Co-host of Get Spoiled podcast.',
      img: 'avatar-light.png',
      github: '',
      twitter: '',
      website: ''
    }
  ],
  platforms: {
    apple: 'https://podcasts.apple.com/us/podcast/get-spoiled/id1372881400',
    appleIdNumber: '1372881400',
    overcast: 'https://overcast.fm/itunes1372881400',
    pocketCasts: 'https://pca.st/itunes/1372881400',
    spotify: 'https://open.spotify.com/show/0xNrxL0oXIEyceCrNX4Syq',
    youtube: ''
  },
  rssFeed: 'https://getspoiled.club/feed.xml'
});
