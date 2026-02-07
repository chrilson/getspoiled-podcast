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
    apple: '',
    appleIdNumber: '',
    overcast: '',
    pocketCasts: '',
    spotify: '',
    youtube: ''
  },
  rssFeed: 'https://feeds.transistor.fm/getspoiled'
});
