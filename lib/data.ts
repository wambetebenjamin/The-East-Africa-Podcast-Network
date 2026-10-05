import type { Episode, Show, SponsorPackage } from './types';

/**
 * Network content — the seed dataset. In production this is served from Vercel KV
 * (see lib/kv.ts and /api/shows, /api/episodes). Audio files are local demo tracks;
 * swap `audio` fields for Vercel Blob / external CDN URLs for real episodes.
 */

const day = 86_400_000;
const now = Date.UTC(2026, 9, 5); // 5 October 2026 — data snapshot date

const artwork: Record<string, string> = {
  'savannah-boardroom': '/images/show-savannah-boardroom.jpg',
  'nairobi-after-dark': '/images/show-nairobi-after-dark.jpg',
  'silicon-savanna': '/images/show-silicon-savanna.jpg',
  'afya-bora': '/images/show-afya-bora.jpg',
  'utamaduni-uncovered': '/images/show-utamaduni.jpg',
  'faith-frequencies': '/images/show-faith-frequencies.jpg',
  touchline: '/images/show-touchline.jpg',
  'pesa-talk': '/images/show-pesa-talk.jpg',
  'ziki-zetu': '/images/show-ziki-zetu.jpg',
  'the-brief': '/images/show-the-brief.jpg',
};

interface EpSeed {
  t: string; // title
  d: number; // days ago
  desc: string;
  body: string[];
  ts: Array<[number, string]>; // timestamps
  ch?: Array<[number, string]>; // chapters
  tr?: string[]; // transcript excerpt
}

interface ShowSeed {
  slug: string;
  title: string;
  tagline: string;
  category: Show['category'];
  description: string;
  longDescription: string[];
  host: Show['host'];
  subscribers: number;
  audioTrack: string;
  eps: EpSeed[];
}

const seeds: ShowSeed[] = [
  {
    slug: 'savannah-boardroom',
    title: 'The Savannah Boardroom',
    tagline: 'East African business, unpacked.',
    category: 'Business',
    description: 'Conversations with the founders and operators building East Africa’s most ambitious companies.',
    longDescription: [
      'Every week, host Wanjiru Maina sits down with the founders, funders and operators behind East Africa’s fastest-growing companies. From Nairobi fintech to Arusha agribusiness, The Savannah Boardroom goes beyond the headlines to unpack how deals get done on the continent.',
      'Past guests include CEOs of listed firms, stall-to-storefront entrepreneurs, and the investors writing the region’s biggest cheques.',
    ],
    host: {
      name: 'Wanjiru Maina', slug: 'wanjiru-maina', role: 'Business journalist, Nairobi',
      bio: 'Wanjiru spent a decade on the business desk of a leading Nairobi daily before moving to audio. She has interviewed more than 400 African founders.',
      photo: '/images/host-wanjiru.jpg', twitter: 'wanjiruboardroom', linkedin: 'wanjiru-maina',
    },
    subscribers: 18400,
    audioTrack: '/audio/eapn-talk.mp3',
    eps: [
      {
        t: 'Inside M-Pesa’s Next Decade', d: 3,
        desc: 'How East Africa’s mobile-money giant is preparing for the crypto era — and why its next billion customers are not who you think.',
        body: [
          'We open in a boardroom on the 14th floor of Safaricom House, where a team of engineers is racing to ship a wallet that works as well in Kigali as in Kisumu.',
          'Our guest walks us through the product decisions behind the region’s most-used financial rails, the regulators who keep them honest, and the quiet bets being placed on cross-border settlement.',
          'Later, we get personal: burnout, board politics, and what a 3 a.m. outage teaches a leader about trust.',
        ],
        ts: [[0, 'Cold open: the 3 a.m. outage'], [14, 'Building for Kigali and Kisumu at once'], [38, 'Regulators as co-designers'], [61, 'The next billion customers']],
        ch: [[0, 'Introduction'], [14, 'Cross-border wallets'], [38, 'Regulation'], [61, 'What comes next']],
        tr: [
          'Welcome back to The Savannah Boardroom.',
          'Today we are talking about the decade ahead for mobile money.',
          'And my guest says the interesting part is not the technology at all.',
        ],
      },
      {
        t: 'The Stall-to-Storefront Playbook', d: 10,
        desc: 'Three women who turned Kariakoo market stalls into regional distribution businesses — on cashflow, credit and the middlemen who disappeared.',
        body: [
          'This episode is a field recording: three micro-distributors, one taxi rank in Dar es Salaam, and a story about how informal trade actually finances itself.',
          'We break down the working-capital maths of a stall that moves 200 bales a week, and why formal credit still loses to the chama next door.',
        ],
        ts: [[0, 'A taxi rank in Kariakoo'], [12, 'The working-capital maths'], [30, 'Why chamas beat banks'], [55, 'Scaling without a warehouse']],
      },
      {
        t: 'Kenya’s Startup Bill, One Year Later', d: 17,
        desc: 'What actually changed for founders after the Startup Bill became law — with the senator who drafted it and a founder who nearly exited.',
        body: [
          'A candid audit of the law everyone celebrated: the tax incentives that landed, the ones that quietly stalled, and the founder exodus it failed to stop.',
          'We also look across the border at Rwanda and Tanzania, and ask what a regional startup treaty would take.',
        ],
        ts: [[0, 'One year of the Startup Bill'], [16, 'What landed, what stalled'], [41, 'The exodus question'], [63, 'A regional treaty?']],
        tr: ['The Startup Bill was signed into law amid celebration.', 'One year on, we went looking for the founders it was written for.'],
      },
    ],
  },
  {
    slug: 'nairobi-after-dark',
    title: 'Nairobi After Dark',
    tagline: 'True crime from the city in the sun.',
    category: 'True Crime',
    description: 'Unsolved cases, cold files and courtroom drama from Nairobi and beyond — told with care, evidence and respect for victims.',
    longDescription: [
      'Nairobi After Dark revisits the cases that shaped East Africa’s cities: the bank heists, the disappearances, the trials that split public opinion.',
      'Host Daniel Kimathi, a former court reporter, works exclusively from public records and on-record interviews.',
    ],
    host: {
      name: 'Daniel Kimathi', slug: 'daniel-kimathi', role: 'Former court reporter, Nairobi',
      bio: 'Daniel covered Nairobi’s high courts for nine years. He believes the file always tells a second story.',
      photo: '/images/host-daniel.jpg', twitter: 'nairobiafterdark', instagram: 'nairobiafterdark',
    },
    subscribers: 31200,
    audioTrack: '/audio/eapn-news.mp3',
    eps: [
      {
        t: 'The Kenyatta Avenue Heist, Part 1', d: 5,
        desc: 'In 1998, four men walked into a bank on Kenyatta Avenue at noon and walked out with the equivalent of a million dollars. Nobody has ever been charged.',
        body: [
          'We begin with the noise: a Wednesday lunchtime, matatus hooting, and four men in suits who knew exactly which teller window to approach.',
          'Using court filings, newspaper archives and three new interviews, we reconstruct the 22 minutes that embarrassed a police force.',
          'Part 1 covers the robbery itself. Part 2 — next week — follows the money.',
        ],
        ts: [[0, 'Twenty-two minutes'], [11, 'Who planned it?'], [34, 'The case that collapsed'], [58, 'Next week: the money']],
        ch: [[0, 'The robbery'], [11, 'The plan'], [34, 'The trial'], [58, 'Preview']],
      },
      {
        t: 'The Disappearance at JKIA', d: 13,
        desc: 'A cargo handler vanishes between two security checkpoints at Nairobi’s airport. Eleven years later, his family is still waiting for answers.',
        body: [
          'The distance between checkpoint A and checkpoint B is 340 metres. There are 14 cameras. This is the story of the nine minutes that none of them can explain.',
          'We speak with the investigator who quit the case, and the sister who has filed 47 appeals.',
        ],
        ts: [[0, '340 metres, 14 cameras'], [9, 'The nine missing minutes'], [37, 'An investigator quits'], [66, 'Forty-seven appeals']],
      },
      {
        t: 'Cold Case: The Nakuru Night Runner', d: 21,
        desc: 'For two years in the early 2000s, a Nakuru neighbourhood organised itself into a night patrol. Then the patrols became the story.',
        body: [
          'A meditation on fear, rumour and how a community polices itself when it stops trusting the police.',
          'Includes rare tape from a 2003 community baraza recorded by a local teacher.',
        ],
        ts: [[0, 'Baraza tape, 2003'], [15, 'Fear as policy'], [44, 'When patrols turn']],
      },
    ],
  },
  {
    slug: 'silicon-savanna',
    title: 'Silicon Savanna',
    tagline: 'The tech show for East Africa.',
    category: 'Technology',
    description: 'Startups, infrastructure, AI and the internet economy of East Africa — explained without the jargon.',
    longDescription: [
      'From undersea cables to AI in Swahili, Silicon Savanna covers the technology reshaping East Africa. Host Brian Otieno translates engineers’ English into everybody’s English.',
      'Weekly news briefs alternate with deep dives and founder interviews from Nairobi, Kampala, Kigali and Dar es Salaam.',
    ],
    host: {
      name: 'Brian Otieno', slug: 'brian-otieno', role: 'Technology journalist, Nairobi',
      bio: 'Brian wrote for tech publications across three continents before deciding audio was a better bandwidth for ideas. He codes badly and admits it.',
      photo: '/images/host-brian.jpg', twitter: 'siliconsavanna', linkedin: 'brian-otieno',
    },
    subscribers: 22800,
    audioTrack: '/audio/eapn-talk.mp3',
    eps: [
      {
        t: 'Swahili LLMs Are Here', d: 2,
        desc: 'A Kampala lab has open-sourced the first production-grade Swahili language model. We test it, and ask what it changes.',
        body: [
          'We run the model through its paces live — Sheng slang, legal Swahili, a Kikuyu proverb — and it mostly holds.',
          'Then the hard questions: whose Swahili is in the training data, and what happens when a model from Kampala argues grammar with a Dar editor.',
        ],
        ts: [[0, 'Live-testing the model'], [10, 'Whose Swahili?'], [35, 'Open weights vs open data'], [62, 'What it changes']],
        ch: [[0, 'The test'], [10, 'Training data'], [35, 'Openness'], [62, 'Implications']],
      },
      {
        t: 'Fibre, Power and the Last Mile', d: 9,
        desc: 'Why your 5G drops in Westlands but works in Webuye — East Africa’s internet, mapped pole by pole.',
        body: [
          'An infrastructure episode that turns out to be a story about money, theft and transformer oil.',
          'Plus: the county that built its own metro fibre and the ISPs that are not happy about it.',
        ],
        ts: [[0, 'A map of the last mile'], [13, 'Transformer oil economics'], [40, 'The county that went rogue'], [59, 'Fixing the poles']],
      },
      {
        t: 'Inside EAC’s Digital ID Standoff', d: 16,
        desc: 'Four countries, four ID systems, one promise of free movement. A negotiator explains where it broke.',
        body: [
          'A rare on-record interview with someone who sat at the table as the region tried — and failed — to agree on a mutual digital identity framework.',
          'We also test the borders ourselves, with three phones and one very patient driver.',
        ],
        ts: [[0, 'The promise'], [12, 'Where it broke'], [43, 'Three phones at the border'], [64, 'What negotiators want next']],
      },
    ],
  },
  {
    slug: 'afya-bora',
    title: 'Afya Bora',
    tagline: 'Your health, in plain language.',
    category: 'Health',
    description: 'Doctors, nutritionists and public-health experts answer the health questions East Africans actually ask.',
    longDescription: [
      'Afya Bora — “good health” in Swahili — is the network’s straight-talking health show. No fear, no fads, just evidence explained kindly.',
      'Host Dr. Amina Yusuf is a practising physician in Nairobi. Every claim on the show is reviewed by a medical panel.',
    ],
    host: {
      name: 'Dr. Amina Yusuf', slug: 'amina-yusuf', role: 'Physician, Nairobi',
      bio: 'Amina is a practising family physician and a lecturer. She started Afya Bora after one too many patients asked her about a WhatsApp broadcast.',
      photo: '/images/host-amina.jpg', twitter: 'afyaborapod',
    },
    subscribers: 27600,
    audioTrack: '/audio/eapn-lofi.mp3',
    eps: [
      {
        t: 'Hypertension: The Silent Epidemic', d: 4,
        desc: 'One in three Kenyan adults has high blood pressure. Half of them do not know it. This episode could save your life.',
        body: [
          'We follow one patient from a free screening in Gikomba to a treatment plan that costs less than a daily chapati.',
          'Dr. Yusuf explains the numbers on your chart, the salt in your food, and why “stress” is not a diagnosis.',
        ],
        ts: [[0, 'A screening in Gikomba'], [8, 'Reading your numbers'], [26, 'The salt question'], [52, 'A plan cheaper than chapati']],
        ch: [[0, 'Screening'], [8, 'Numbers'], [26, 'Diet'], [52, 'Treatment']],
      },
      {
        t: 'Vaccines, Rumours and Trust', d: 12,
        desc: 'Why a rumour in one county can undo a decade of public health in another — and what actually rebuilds trust.',
        body: [
          'We talk to a community health volunteer who walks 14 kilometres a day, and a researcher who studies why bad information travels faster than good.',
          'A calm, source-linked conversation — the opposite of a WhatsApp forward.',
        ],
        ts: [[0, '14 kilometres a day'], [11, 'Why rumours travel'], [33, 'Rebuilding trust'], [60, 'What to do Monday']],
      },
    ],
  },
  {
    slug: 'utamaduni-uncovered',
    title: 'Utamaduni Uncovered',
    tagline: 'Culture, language and identity.',
    category: 'Culture',
    description: 'Music, food, fashion, language and the everyday culture of East Africa — from taarab to Gengetone.',
    longDescription: [
      'Utamaduni Uncovered is the network’s culture desk: long conversations with the musicians, chefs, designers and linguists shaping how East Africa sees itself.',
      'Host Zawadi Nyerere grew up between Dar es Salaam and Zanzibar and brings taarab records to every argument.',
    ],
    host: {
      name: 'Zawadi Nyerere', slug: 'zawadi-nyerere', role: 'Cultural critic, Dar es Salaam',
      bio: 'Zawadi writes and broadcasts on East African culture. She believes a culture show should make you dance at least once.',
      photo: '/images/host-zawadi.jpg', instagram: 'utamaduniuncovered',
    },
    subscribers: 19900,
    audioTrack: '/audio/eapn-afro.mp3',
    eps: [
      {
        t: 'Gengetone Grew Up', d: 6,
        desc: 'The kids who shocked your aunties in 2019 now run labels, sell out Carnivore and write for pop stars. What happened?',
        body: [
          'An oral history of Nairobi’s most argued-about genre, told by the producers who lived it — from the first viral track to the first brand deal.',
          'With a playlist companion and a very patient deconstruction of one bar that launched a thousand op-eds.',
        ],
        ts: [[0, 'The track that started it'], [12, 'From meme to label'], [36, 'The moral panic'], [61, 'Gengetone now']],
        ch: [[0, 'Origins'], [12, 'Business'], [36, 'Backlash'], [61, 'Today']],
      },
      {
        t: 'The Return of Taarab', d: 15,
        desc: 'Zanzibar’s orchestral sound is filling clubs again — remixed, reissued and re-loved by a generation that discovered it on scratchy vinyl.',
        body: [
          'We spend an evening in Stone Town with a 70-year-old oud master and the 24-year-old producer who sampled him.',
          'Also: the Swahili poetry structure that makes taarab lyrics hit like a novel.',
        ],
        ts: [[0, 'An evening in Stone Town'], [10, 'Oud meets sampler'], [32, 'Poetry as structure'], [57, 'The club comeback']],
      },
    ],
  },
  {
    slug: 'faith-frequencies',
    title: 'Faith Frequencies',
    tagline: 'Belief, doubt and everything between.',
    category: 'Religion',
    description: 'Respectful conversations about faith in East Africa — Christianity, Islam and the traditions that precede both.',
    longDescription: [
      'Faith Frequencies is a show about belief as it is actually lived: in mosques on Friday, in churches on Sunday, in shrines on ordinary Tuesdays.',
      'Host Pastor Grace Wanjala pastors a congregation in Kisumu and studies comparative religion. She asks the questions listeners are afraid to.',
    ],
    host: {
      name: 'Grace Wanjala', slug: 'grace-wanjala', role: 'Pastor and student of religion, Kisumu',
      bio: 'Grace leads a congregation in Kisumu and is completing graduate work in religious studies. She started this show to model disagreement without contempt.',
      photo: '/images/host-grace.jpg',
    },
    subscribers: 15200,
    audioTrack: '/audio/eapn-faith.mp3',
    eps: [
      {
        t: 'Ramadan in a 24-Hour City', d: 7,
        desc: 'Fasting while Nairobi never sleeps: night-shift nurses, boda riders and the imam who opens the mosque at 3 a.m.',
        body: [
          'A gentle, atmospheric hour recorded across one Ramadan: the kitchen at suhoor, the silence at noon, the traffic at iftar.',
          'We ask what fasting does to a body, a schedule and a city.',
        ],
        ts: [[0, '3 a.m. at the mosque'], [10, 'The night shift fasts too'], [31, 'Iftar traffic'], [54, 'What fasting changes']],
        ch: [[0, 'Suhoor'], [10, 'Work'], [31, 'Iftar'], [54, 'Reflection']],
      },
      {
        t: 'The Courtship of Church and State', d: 14,
        desc: 'When bishops brief politicians and politicians quote scripture, who is pastoring whom?',
        body: [
          'A historian walks us through 60 years of pulpit politics in Kenya, Tanzania and Uganda.',
          'Plus: a live debate — should clergy endorse candidates? Two pastors, one imam, zero shouting.',
        ],
        ts: [[0, 'A brief history'], [13, 'The endorsement question'], [39, 'Live debate'], [66, 'Where listeners stand']],
      },
    ],
  },
  {
    slug: 'touchline',
    title: 'Touchline',
    tagline: 'East African football, every week.',
    category: 'Sports',
    description: 'The SportPesa Premier League, CECAFA, Harambee Stars and the story of football across East Africa.',
    longDescription: [
      'Touchline is the network’s football desk: results, rumours, tactics and the business of the beautiful game from Bungoma to Zanzibar.',
      'Host Kevin Achieng played semi-pro before an ankle had opinions. Now he talks football full-time.',
    ],
    host: {
      name: 'Kevin Achieng', slug: 'kevin-achieng', role: 'Football analyst, Kisumu',
      bio: 'Kevin turned a semi-pro career into a microphone. He has called three AFCON tournaments and never recovered from the 2004 final.',
      photo: '/images/host-kevin.jpg', twitter: 'touchlinepod',
    },
    subscribers: 26300,
    audioTrack: '/audio/eapn-sports.mp3',
    eps: [
      {
        t: 'Can Stars Qualify?', d: 4,
        desc: 'Harambee Stars’ group is a horror show on paper. On paper. We break every fixture with a man who has watched all six opponents.',
        body: [
          'Fixture-by-fixture: the away day in Casablanca, the homecoming at Kasarani, and the November match that decides everything.',
          'Plus an interview with the young striker carrying a nation’s hopes and a hamstring.',
        ],
        ts: [[0, 'The group of dread'], [9, 'Casablanca away'], [28, 'The striker question'], [50, 'November decides']],
      },
      {
        t: 'The Business of Derbies', d: 11,
        desc: 'What a Nairobi derby actually earns — tickets, TV, bar revenues and the city’s unofficial half-day.',
        body: [
          'Derby day economics, from the turnstile to the screamer outside the stadium. With a club CFO on the record.',
          'And a lovely story about a ticket tout who became a season-ticket holder.',
        ],
        ts: [[0, 'Derby morning'], [8, 'The CFO explains'], [30, 'Touts to season tickets'], [55, 'Predictions']],
      },
    ],
  },
  {
    slug: 'pesa-talk',
    title: 'Pesa Talk',
    tagline: 'Personal finance for real life.',
    category: 'Finance',
    description: 'Budgets, savings, investing and debt — money conversations in plain East African English and Swahili.',
    longDescription: [
      'Pesa Talk is personal finance without the shame. Host Otieno Odhiambo, a licensed financial advisor, answers listener questions every week.',
      'From chama treasury roles to Sacco dividends, from Sacco loans to treasury bonds on your phone — if East Africans earn, spend or save it, we talk about it.',
    ],
    host: {
      name: 'Otieno Odhiambo', slug: 'otieno-odhiambo', role: 'Financial advisor, Nairobi',
      bio: 'Otieno is a licensed financial advisor who believes a budget should fit on a matatu receipt. He answers every listener mail personally.',
      photo: '/images/host-otieno.jpg', twitter: 'pesatalk',
    },
    subscribers: 24100,
    audioTrack: '/audio/eapn-lofi.mp3',
    eps: [
      {
        t: 'Your First 10,000 Bob', d: 5,
        desc: 'The exact, boring system for turning your first KES 10,000 of savings into a habit that survives rent day.',
        body: [
          'Three accounts, one calendar reminder, and the psychology of why the money keeps “disappearing”.',
          'We also price a real emergency fund for a real Nairobi salary.',
        ],
        ts: [[0, 'Why money disappears'], [9, 'The three accounts'], [27, 'Emergency fund maths'], [49, 'Your Monday move']],
      },
      {
        t: 'Saccos vs Banks vs Apps', d: 19,
        desc: 'Where should your savings actually live? We compare a leading Sacco, three banks and two savings apps on eight metrics.',
        body: [
          'Dividends, interest, loan multipliers, withdrawal pain and what happens when things go wrong — all compared on one spreadsheet you can download.',
          'A Sacco CEO, a bank product manager and a fintech founder each get to make their case.',
        ],
        ts: [[0, 'Eight metrics'], [12, 'The Sacco case'], [34, 'The bank case'], [56, 'The app case']],
      },
    ],
  },
  {
    slug: 'ziki-zetu',
    title: 'Ziki Zetu',
    tagline: 'Entertainment, gossip-free.',
    category: 'Entertainment',
    description: 'Films, series, music and the entertainment industry of East Africa — reviewed with love and standards.',
    longDescription: [
      'Ziki Zetu (“our noise”) covers East African entertainment with the seriousness it deserves: the craft, the money and the culture.',
      'Host Juma Mwinyi is a film critic and former radio presenter who has opinions about everything except your taste.',
    ],
    host: {
      name: 'Juma Mwinyi', slug: 'juma-mwinyi', role: 'Film critic, Mombasa',
      bio: 'Juma reviewed his first film on radio at 19 and never stopped. He believes Nollywood and Riverwood are the most interesting film industries on earth.',
      photo: '/images/host-juma.jpg', instagram: 'zikizetu',
    },
    subscribers: 28700,
    audioTrack: '/audio/eapn-afro.mp3',
    eps: [
      {
        t: 'Riverwood’s Streaming Era', d: 3,
        desc: 'Kenyan films are finally on global platforms. Who is getting paid — and who is getting played?',
        body: [
          'We follow one film from a Nairobi premiere to a global streamer and unpack the deal sheet with a lawyer.',
          'Plus: the director doing numbers with a phone-shot thriller shot entirely in Dandora.',
        ],
        ts: [[0, 'One film, two realities'], [11, 'Reading the deal sheet'], [33, 'The Dandora thriller'], [58, 'What audiences want']],
      },
      {
        t: 'Bongo Flava at 30', d: 18,
        desc: 'Thirty years of Bongo Flava — a birthday party with arguments, archive tape and a ranked top-ten that will upset you.',
        body: [
          'From the first cassette hits in Dar to sold-out shows in Amsterdam, we trace the genre with two producers who were there.',
          'The top-ten debate alone runs twenty minutes. You have been warned.',
        ],
        ts: [[0, 'Cassette era'], [10, 'The Diamond effect'], [38, 'Top ten, part one'], [62, 'Top ten, part two']],
      },
    ],
  },
  {
    slug: 'the-brief',
    title: 'The Brief',
    tagline: 'Politics, clearly.',
    category: 'Politics',
    description: 'East African politics explained in 30 minutes — the policy, the players and the price of both.',
    longDescription: [
      'The Brief is the network’s politics show: what happened, why it happened and what it costs you. Weekly, and ruthlessly non-partisan.',
      'Host Naliaka Cheruiyot is a constitutional lawyer who has read every EAC treaty so you never have to.',
    ],
    host: {
      name: 'Naliaka Cheruiyot', slug: 'naliaka-cheruiyot', role: 'Constitutional lawyer, Nairobi',
      bio: 'Naliaka teaches public law and has advised two parliamentary committees. She started The Brief because Hansard deserved a soundtrack.',
      photo: '/images/host-naliaka.jpg', twitter: 'thebriefpod',
    },
    subscribers: 21400,
    audioTrack: '/audio/eapn-news.mp3',
    eps: [
      {
        t: 'Reading the Finance Bill', d: 6,
        desc: 'Line by line, clause by clause: what the new Finance Bill actually taxes, and who actually pays.',
        body: [
          'We read the boring parts so the interesting parts make sense. With a tax partner and a market trader in the same room.',
          'By the end you will be able to explain VAT on digital services to your uncle.',
        ],
        ts: [[0, 'Why bills are boring'], [10, 'The clauses that matter'], [32, 'Who pays'], [55, 'Explain it to your uncle']],
      },
      {
        t: 'The EAC at 25', d: 20,
        desc: 'A quarter century of East African integration: the wins nobody celebrates, the losses nobody explains.',
        body: [
          'A heads-of-state summit passed quietly this month. We use it to ask the only question that matters: has the EAC made life better for a trader in Busia?',
          'With two former negotiators and one very frank current one.',
        ],
        ts: [[0, 'A quiet summit'], [11, 'The wins'], [35, 'The losses'], [58, 'The Busia test']],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Exported dataset
// ---------------------------------------------------------------------------

export const shows: Show[] = seeds.map((s) => {
  const episodes: Episode[] = s.eps.map((e, ei) => {
    const num = s.eps.length - ei;
    return {
      slug: `${s.slug}-s02-e${String(num).padStart(2, '0')}`,
      showSlug: s.slug,
      season: 2,
      number: num,
      title: e.t,
      description: e.desc,
      content: e.body,
      publishedAt: new Date(now - e.d * day).toISOString().slice(0, 10),
      duration: 84, // matches the local demo audio length
      audio: s.audioTrack,
      artwork: artwork[s.slug],
      timestamps: e.ts.map(([start, title]) => ({ start, title })),
      chapters: e.ch ? e.ch.map(([start, title]) => ({ start, title })) : undefined,
      transcript: e.tr,
      spotifyUrl: `https://open.spotify.com/episode/${s.slug}-s02e${num}`,
      appleUrl: `https://podcasts.apple.com/ke/podcast/${s.slug}/s02e${num}`,
    };
  });
  return {
    slug: s.slug,
    title: s.title,
    tagline: s.tagline,
    category: s.category,
    description: s.description,
    longDescription: s.longDescription,
    host: s.host,
    subscribers: s.subscribers,
    artwork: artwork[s.slug],
    banner: '/images/hero-studio.jpg',
    spotifyUrl: `https://open.spotify.com/show/${s.slug}-eapn`,
    appleUrl: `https://podcasts.apple.com/ke/podcast/${s.slug}`,
    audioTrack: s.audioTrack,
    episodes,
  };
});

export const allEpisodes: Episode[] = shows
  .flatMap((s) => s.episodes)
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getShow(slug: string): Show | undefined {
  return shows.find((s) => s.slug === slug);
}

export function getEpisode(slug: string): Episode | undefined {
  return allEpisodes.find((e) => e.slug === slug);
}

export function latestEpisodes(limit = 8): Episode[] {
  return allEpisodes.slice(0, limit);
}

export function relatedEpisodes(episode: Episode, limit = 4): Episode[] {
  const sameShow = allEpisodes.filter((e) => e.slug !== episode.slug && e.showSlug === episode.showSlug);
  const others = allEpisodes.filter((e) => e.showSlug !== episode.showSlug);
  return sameShow.concat(others).slice(0, limit);
}

export const featuredEpisode: Episode = allEpisodes[0];

// ---------------------------------------------------------------------------
// Advertiser audience data (charts on /advertise)
// ---------------------------------------------------------------------------

export const audience = {
  monthlyListeners: 250_000,
  monthlyStreams: 1_120_000,
  topCities: [
    { city: 'Nairobi', country: 'Kenya', listeners: 96_000 },
    { city: 'Dar es Salaam', country: 'Tanzania', listeners: 41_000 },
    { city: 'Kampala', country: 'Uganda', listeners: 33_500 },
    { city: 'Kigali', country: 'Rwanda', listeners: 18_200 },
    { city: 'Mombasa', country: 'Kenya', listeners: 14_800 },
    { city: 'Arusha', country: 'Tanzania', listeners: 11_300 },
  ],
  ageDistribution: [
    { range: '18–24', share: 28 },
    { range: '25–34', share: 41 },
    { range: '35–44', share: 19 },
    { range: '45–54', share: 9 },
    { range: '55+', share: 3 },
  ],
  genderSplit: [
    { name: 'Male', value: 53 },
    { name: 'Female', value: 47 },
  ],
  topCategories: [
    { category: 'True Crime', share: 17 },
    { category: 'Business', share: 15 },
    { category: 'Entertainment', share: 14 },
    { category: 'Sports', share: 13 },
    { category: 'Health', share: 11 },
    { category: 'Technology', share: 10 },
    { category: 'Politics', share: 8 },
    { category: 'Culture', share: 7 },
    { category: 'Finance', share: 3 },
    { category: 'Religion', share: 2 },
  ],
};

export const sponsorPackages: SponsorPackage[] = [
  {
    name: 'Episode Sponsor',
    placement: '60-second host-read mid-roll in the episode of your choice',
    reach: '18,000–31,000 listens per episode',
    priceKES: '25,000',
    cadence: 'per episode',
    inclusions: [
      'Host-read 60-second mid-roll',
      'Pre-roll brand mention',
      'Credit in show notes and episode page',
      'Promo code tracking',
    ],
  },
  {
    name: 'Show Partner',
    placement: 'Weekly brand presence across every episode of one show',
    reach: '90,000+ monthly listens per show',
    priceKES: '80,000',
    cadence: 'per month',
    featured: true,
    inclusions: [
      'Two mid-rolls per episode',
      '“Brought to you by” billing on every episode',
      'Newsletter feature (65,000 subscribers)',
      'Two branded social posts per week',
      'Quarterly audience report',
    ],
  },
  {
    name: 'Network Partner',
    placement: 'Custom branded content across all 10 shows',
    reach: '250,000+ monthly listeners network-wide',
    priceKES: 'Custom',
    cadence: 'quarterly',
    inclusions: [
      'Co-produced branded series or mini-season',
      'Event coverage and live activations',
      'Homepage and app takeovers',
      'Cross-show campaign creative',
      'Dedicated account management',
    ],
  },
];
