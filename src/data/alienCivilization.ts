import { AlienNPC } from '../types/game';

export const alienCivilizationNPCs: AlienNPC[] = [
  {
    id: 'elder_xylar',
    name: 'Elder Xylar',
    title: 'Sanctuary Patriarch',
    x: 1040,
    y: 190 - 26,
    color: '#da70d6',
    accent: '#ffe3fd',
    dialogueTree: {
      greeting: 'Greetings, stellar traveler. You stand within the sacred biome of Zephyria. Few mortal boots step across our threshold.',
      topics: [
        {
          label: 'What is the history of this civilization?',
          response: 'Eons ago, when the cosmic void was young, our architects anchored the Aether Grid through five nexus planets. We watched civilizations rise and fall from our bioluminescent spires.',
        },
        {
          label: 'Tell me about the broken rocket at the edge of the world.',
          response: 'That rocket was forged with Singularity propulsion by the first explorers. If you supply the hyper-matter to restore it, the entire planetary warp network across all five worlds will be permanently unlocked to your command!',
        },
        {
          label: 'May I receive the ancient blessing of the Star-Kin?',
          response: 'Open your spirit to the cosmic vibration. Take our ancient stellar resonance — may your pickaxe shatter even the densest singularity veins with ease!',
          reward: {
            type: 'power',
            amount: 25,
            message: 'Elder Xylar bestows the Star-Kin Blessing! (+25 Mining Power)',
          },
        },
      ],
    },
  },
  {
    id: 'zephyr_botanist',
    name: 'Zephyr',
    title: 'Alien Spore-Botanist',
    x: 1220,
    y: 190 - 26,
    color: '#66ffcc',
    accent: '#d4ffea',
    dialogueTree: {
      greeting: 'Ss-sshh... hear that gentle hum? The bioluminescent flora are singing with the rhythm of the sub-surface crystal veins!',
      topics: [
        {
          label: 'Why do the plants glow here?',
          response: 'They draw sustenance directly from liquid aether pulsing deep below our shacks. It is neither chlorophyll nor water — it is crystallized cosmic starlight.',
        },
        {
          label: 'Do you have anything to help a traveler walk faster?',
          response: 'Indeed! Take a vial of distilled Nebula Nectar. It lightens your steps against the heavy gravity of Zephyria!',
          reward: {
            type: 'speed',
            amount: 0.5,
            message: 'Zephyr offers you sweet Nebula Nectar! (+0.5 Movement Speed)',
          },
        },
        {
          label: 'Have you seen any strange creatures in the caves below?',
          response: 'Beneath the ancient ceremonial altars, the crystals grow so massive they generate their own gravitational pull. Watch your step on the descending ramps!',
        },
      ],
    },
  },
  {
    id: 'kaelen_smith',
    name: 'Kaelen',
    title: 'Void-Smith Artisan',
    x: 1400,
    y: 190 - 26,
    color: '#ff9966',
    accent: '#ffe0cc',
    dialogueTree: {
      greeting: 'Welcome to the Astral Anvil. You wield impressive tools, traveler, but nothing matches alloys quenched in singularity dust.',
      topics: [
        {
          label: 'How do you forge tools without melting the rock?',
          response: 'We use harmonic plasma frequencies. We do not heat the ore; we persuade the subatomic bonds to realign in crystalline perfection.',
        },
        {
          label: 'Any tips on mining the deepest Zephyria ores?',
          response: 'Singularity Shards and Genesis Stars have immense hardness. Always upgrade your pickaxe to at least Power 50+ before attempting the deepest cavern floor.',
        },
        {
          label: 'Can you reinforce my mining apparatus?',
          response: 'Here, allow me to calibrate your drill tip with a void-plasma laser edge. Your mining strikes will now hit twice as fiercely!',
          reward: {
            type: 'power',
            amount: 35,
            message: 'Kaelen tunes your mining tool with a void laser edge! (+35 Mining Power)',
          },
        },
      ],
    },
  },
  {
    id: 'gribble_scrapper',
    name: 'Gribble',
    title: 'Alien Scavenger & Trickster',
    x: 1580,
    y: 190 - 26,
    color: '#ff66b2',
    accent: '#ffd6eb',
    dialogueTree: {
      greeting: '*Blinks all 4 eyes* Hehehe! Look at you, two-eyed traveler! You come from that funny metal box with wheels? Or did you drop from the sky?',
      topics: [
        {
          label: 'What do you scavenge around these shacks?',
          response: 'Shiny bits! Buzzing circuits! Old robot batteries! Sometimes Mr. RoBiT drops shiny bolts from his delivery chutes and Gribble finds them all!',
        },
        {
          label: 'Do you know any cosmic secrets?',
          response: 'Gribble heard a rumor that if someone whispers "termsnconaban" into the traveler feedback terminal, all the credits in the galaxy magically pour into their bag! But who knows? Hehehe!',
        },
        {
          label: 'Can I have some shiny pocket change?',
          response: 'Gribble likes you! You have nice shiny eyes. Here, take some shiny space coins Gribble found behind the elder hut!',
          reward: {
            type: 'money',
            amount: 50000000,
            message: 'Gribble tosses a pouch of shiny ancient coins into your pocket! (+$50,000,000)',
          },
        },
      ],
    },
  },
];
