import type { Movie, Cinema, SnackAddon } from '../types';

export const CITIES = [
  'Mumbai, India',
  'Delhi NCR, India',
  'Bengaluru, India',
  'Hyderabad, India',
  'Chennai, India',
  'Kolkata, India',
  'New York, NY',
  'London, UK'
];

export const GENRES = [
  'All Genres',
  'Action',
  'Sci-Fi',
  'Comedy',
  'Horror',
  'Thriller',
  'Drama',
  'Adventure',
  'Fantasy',
  'Mythological',
  'Survival'
];

export const LANGUAGES = [
  'All Languages',
  'Telugu',
  'Hindi',
  'Tamil',
  'Malayalam',
  'Kannada',
  'English',
  'Bengali',
  'Marathi',
  'Punjabi',
  'Gujarati',
  'Spanish',
  'Korean',
  'Japanese'
] as const;

export type SupportedLanguage = typeof LANGUAGES[number];

export const MOVIES: Movie[] = [
  {
    id: 'kalki-2898',
    title: 'Kalki 2898 AD',
    tagline: 'When the world falls into darkness, the tenth avatar rises.',
    synopsis: 'Set in a post-apocalyptic dystopian world in the year 2898 AD, an immortal warrior, an elite bounty hunter, and a pregnant refugee cross paths as ancient prophecies of a cosmic savior threaten the tyrannical supremacy of the Complex.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Sci-Fi', 'Mythological'],
    language: 'Telugu',
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'English'],
    duration: '3h 01m',
    durationMinutes: 181,
    rating: 9.2,
    votesCount: '342K',
    ageRating: 'UA',
    releaseDate: '2024-06-27',
    status: 'now_showing',
    director: 'Nag Ashwin',
    featured: true,
    trailerUrl: 'https://www.youtube.com/embed/kQDd1AhGIHk',
    recommendPercent: 91,
    recommendVotes: '58,200+ votes',
    formats: ['IMAX Laser 3D', 'Dolby Atmos 7.1', '4DX', 'VIP Recliner', 'Standard 2D'],
    cast: [
      {
        name: 'Prabhas',
        role: 'Bhairava',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Amitabh Bachchan',
        role: 'Ashwatthama',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Deepika Padukone',
        role: 'SUM-80',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Kamal Haasan',
        role: 'Supreme Yaskin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Disha Patani',
        role: 'Roxie',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Santhosh Narayanan',
        role: 'Music Director',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Djordje Stojiljkovic',
        role: 'Cinematographer',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
      }
    ]
  },
  {
    id: 'stree-2',
    title: 'Stree 2',
    tagline: 'Sarkate ka aatank, Chanderi mein phir shuru!',
    synopsis: 'Following the events of Stree, the small town of Chanderi faces a terrifying new menace: a headless specter named Sarkata who abducts progressive women. Vicky, his loyal friends, and Rudra Bhaiya must unite with Stree once again to save their town.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genre: ['Comedy', 'Horror'],
    language: 'Hindi',
    languages: ['Hindi', 'Telugu', 'Tamil'],
    duration: '2h 29m',
    durationMinutes: 149,
    rating: 8.9,
    votesCount: '280K',
    ageRating: 'UA',
    releaseDate: '2024-08-15',
    status: 'now_showing',
    director: 'Amar Kaushik',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/KVnheBRlmdU',
    recommendPercent: 89,
    recommendVotes: '52,400+ votes',
    formats: ['Dolby Atmos 7.1', 'Standard 2D'],
    cast: [
      {
        name: 'Rajkummar Rao',
        role: 'Vicky',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Shraddha Kapoor',
        role: 'She',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Pankaj Tripathi',
        role: 'Rudra Bhaiya',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Abhishek Banerjee',
        role: 'Jana',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Aparshakti Khurana',
        role: 'Bittu',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Sachin-Jigar',
        role: 'Music Directors',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      }
    ]
  },
  {
    id: 'dune-2',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters across the burning sands.',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking vengeance against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: '2h 46m',
    durationMinutes: 166,
    rating: 9.3,
    votesCount: '490K',
    ageRating: 'UA',
    releaseDate: '2024-03-01',
    status: 'now_showing',
    director: 'Denis Villeneuve',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    recommendPercent: 94,
    recommendVotes: '64,100+ votes',
    formats: ['IMAX Laser 3D', 'Dolby Atmos 7.1', '4DX', 'VIP Recliner'],
    cast: [
      {
        name: 'Timothée Chalamet',
        role: 'Paul Atreides',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Zendaya',
        role: 'Chani',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Rebecca Ferguson',
        role: 'Lady Jessica',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Javier Bardem',
        role: 'Stilgar',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Austin Butler',
        role: 'Feyd-Rautha',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Hans Zimmer',
        role: 'Composer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Greig Fraser',
        role: 'Cinematographer',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
      }
    ]
  },
  {
    id: 'devara-part-1',
    title: 'Devara: Part 1',
    tagline: 'Faces of fear will bow when the sea bleeds red.',
    synopsis: 'An epic coastal action drama tracing the fearless chieftain of a seaside community who rebels against predatory smuggling syndicates, setting off a ruthless bloodline conflict that spans two generations.',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Drama', 'Thriller'],
    language: 'Telugu',
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
    duration: '2h 58m',
    durationMinutes: 178,
    rating: 8.8,
    votesCount: '210K',
    ageRating: 'A',
    releaseDate: '2024-09-27',
    status: 'now_showing',
    director: 'Koratala Siva',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/n4p_fPoc1uA',
    recommendPercent: 88,
    recommendVotes: '41,800+ votes',
    formats: ['IMAX Laser 3D', 'Dolby Atmos 7.1', 'Standard 2D'],
    cast: [
      {
        name: 'N. T. Rama Rao Jr.',
        role: 'Devara / Vara',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Janhvi Kapoor',
        role: 'Thangam',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Saif Ali Khan',
        role: 'Bhaira',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Anirudh Ravichander',
        role: 'Music Director',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'R. Rathnavelu',
        role: 'Cinematographer',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
      }
    ]
  },
  {
    id: 'pushpa-2',
    title: 'Pushpa 2: The Rule',
    tagline: 'Pushpa jhukega nahi... ab poore desh par rule karega!',
    synopsis: 'Pushpa Raj has solidified his syndicate over the Seshachalam forests, but his arch-nemesis SP Bhanwar Singh Shekhawat launches a venomous tactical crusade to destroy him and his empire.',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Thriller', 'Drama'],
    language: 'Telugu',
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
    duration: '3h 20m',
    durationMinutes: 200,
    rating: 9.4,
    votesCount: '410K',
    ageRating: 'A',
    releaseDate: '2024-12-05',
    status: 'coming_soon',
    director: 'Sukumar',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/1kVK0MZlbI4',
    recommendPercent: 96,
    recommendVotes: '78,300+ votes',
    formats: ['IMAX Laser 3D', 'Dolby Atmos 7.1', '4DX', 'VIP Recliner'],
    cast: [
      {
        name: 'Allu Arjun',
        role: 'Pushpa Raj',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Rashmika Mandanna',
        role: 'Srivalli',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Fahadh Faasil',
        role: 'SP Bhanwar Singh Shekhawat',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Devi Sri Prasad (DSP)',
        role: 'Music Director',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Mirosław Brożek',
        role: 'Cinematographer',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
      }
    ]
  },
  {
    id: 'manjummel-boys',
    title: 'Manjummel Boys',
    tagline: 'Kanmani Anbodu... True friendship deeper than 900 feet of darkness.',
    synopsis: 'Based on the true story of 2006, a band of young friends from Kochi travel to Kodaikanal where one of them falls deep into the treacherous Guna Caves. Against all authorities and odds, his companions refuse to leave him behind.',
    posterUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
    genre: ['Survival', 'Adventure', 'Thriller'],
    language: 'Malayalam',
    languages: ['Malayalam', 'Tamil', 'Telugu', 'Hindi'],
    duration: '2h 15m',
    durationMinutes: 135,
    rating: 9.1,
    votesCount: '195K',
    ageRating: 'U',
    releaseDate: '2024-02-22',
    status: 'now_showing',
    director: 'Chidambaram',
    featured: false,
    trailerUrl: 'https://www.youtube.com/embed/GARb_vFv-aQ',
    recommendPercent: 93,
    recommendVotes: '49,000+ votes',
    formats: ['Dolby Atmos 7.1', 'Standard 2D'],
    cast: [
      {
        name: 'Soubin Shahir',
        role: 'Siju David (Kuttan)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Sreenath Bhasi',
        role: 'Subhash',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Balu Varghese',
        role: 'Sixen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Sushin Shyam',
        role: 'Music Director',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Shyju Khalid',
        role: 'Cinematographer',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
      }
    ]
  },
  {
    id: 'jawan-movie',
    title: 'Jawan',
    tagline: 'A high-octane emotional journey of a prison warden correcting society.',
    synopsis: 'A dedicated soldier and prison administrator commands an elite squad of women in high-profile public seizures to force the government to forgive farmer debts and reform healthcare, crossing paths with an arms dealer tycoon.',
    posterUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Thriller', 'Drama'],
    language: 'Hindi',
    languages: ['Hindi', 'Tamil', 'Telugu'],
    duration: '2h 49m',
    durationMinutes: 169,
    rating: 8.7,
    votesCount: '310K',
    ageRating: 'UA',
    releaseDate: '2023-09-07',
    status: 'now_showing',
    director: 'Atlee',
    featured: false,
    formats: ['IMAX Laser 3D', 'Dolby Atmos 7.1', '4DX'],
    cast: [
      {
        name: 'Shah Rukh Khan',
        role: 'Vikram Rathore / Azad',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Nayanthara',
        role: 'Narmada Rai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Vijay Sethupathi',
        role: 'Kaalie Gaikwad',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      }
    ]
  },
  {
    id: 'kantara-chapter-1',
    title: 'Kantara: Chapter 1',
    tagline: 'When faith challenges dominion, nature answers in blood.',
    synopsis: 'The legendary Kadamba-era prequel chronicling the mythic origins of the forest Daiva Panjurli and the ancestral warrior who defended sacred tribal lands from imperial conquests.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genre: ['Mythological', 'Action', 'Drama'],
    language: 'Kannada',
    languages: ['Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'],
    duration: '2h 35m',
    durationMinutes: 155,
    rating: 9.3,
    votesCount: '240K',
    ageRating: 'UA',
    releaseDate: '2025-05-15',
    status: 'coming_soon',
    director: 'Rishab Shetty',
    featured: false,
    formats: ['Dolby Atmos 7.1', 'IMAX Laser 3D', 'Standard 2D'],
    cast: [
      {
        name: 'Rishab Shetty',
        role: 'Shiva / Daiva Avatar',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
      }
    ]
  }
];

// Authentic cinema venues grouped by city
export const CINEMAS_BY_CITY: Record<string, Cinema[]> = {
  'Mumbai, India': [
    {
      id: 'pvr-icon-phoenix-palladium',
      name: 'PVR ICON: Phoenix Palladium, Lower Parel',
      location: 'Mumbai, India',
      city: 'Mumbai, India',
      address: 'Phoenix Palladium, Senapati Bapat Marg, Lower Parel, Mumbai',
      facilities: ['IMAX Laser 4K', 'Dolby Atmos 7.1', 'PVR LUXE Loungers', 'In-Seat Gourmet Dining'],
      distance: '1.2 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'inox-megaplex-inorbit',
      name: 'INOX Megaplex: Inorbit Mall, Malad',
      location: 'Mumbai, India',
      city: 'Mumbai, India',
      address: 'Inorbit Mall, Link Road, Malad West, Mumbai',
      facilities: ['ScreenX 270°', 'MX4D Motion Seats', 'INSIGNIA Dining', 'Dolby Atmos'],
      distance: '3.8 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'cinepolis-vip-viviana',
      name: 'Cinépolis VIP: Viviana Mall, Thane',
      location: 'Mumbai, India',
      city: 'Mumbai, India',
      address: 'Viviana Mall, Eastern Express Highway, Thane West, Mumbai',
      facilities: ['VIP Full Recliners', 'Coffee Tree Lounge', 'Macro XE', 'Dolby Atmos 7.1'],
      distance: '6.5 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'pvr-maison-jio-drive',
      name: 'PVR Maison: Jio World Drive, BKC',
      location: 'Mumbai, India',
      city: 'Mumbai, India',
      address: 'Jio World Drive, Bandra Kurla Complex, Bandra East, Mumbai',
      facilities: ['Luxe Recliner Suites', 'Dolby Vision', 'Private Screening Booths', 'Valet'],
      distance: '2.4 km away',
      timezone: 'Asia/Kolkata'
    }
  ],
  'Delhi NCR, India': [
    {
      id: 'pvr-directors-cut-vasant-kunj',
      name: "PVR Director's Cut: Ambience Mall, Vasant Kunj",
      location: 'Delhi NCR, India',
      city: 'Delhi NCR, India',
      address: 'Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi',
      facilities: ["Director's Cut Recliners", 'Dedicated Concierge', 'Dolby Atmos', 'Wine & Dine'],
      distance: '2.1 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'pvr-superplex-logix-noida',
      name: 'PVR Superplex: Logix City Center, Noida',
      location: 'Delhi NCR, India',
      city: 'Delhi NCR, India',
      address: 'Logix City Center, Sector 32, Noida, NCR',
      facilities: ['IMAX Laser 3D', '4DX Motion', 'PlayHouse Screen', 'Dolby Atmos 7.1'],
      distance: '4.5 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'inox-epicuria-nehru-place',
      name: 'INOX: Epicuria, Nehru Place',
      location: 'Delhi NCR, India',
      city: 'Delhi NCR, India',
      address: 'Epicuria Food Mall, Nehru Place Metro Station, New Delhi',
      facilities: ['Laser 4K Projection', 'INSIGNIA Recliners', 'Dolby 7.1', 'Food Concierge'],
      distance: '3.2 km away',
      timezone: 'Asia/Kolkata'
    }
  ],
  'Bengaluru, India': [
    {
      id: 'pvr-forum-koramangala',
      name: 'PVR: Forum Mall, Koramangala',
      location: 'Bengaluru, India',
      city: 'Bengaluru, India',
      address: 'The Forum Mall, Hosur Road, Koramangala, Bengaluru',
      facilities: ['IMAX Laser 3D', 'Gold Class Recliners', 'Dolby Atmos', 'Gourmet Bar'],
      distance: '1.8 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'inox-garuda-mall',
      name: 'INOX: Garuda Mall, Magrath Road',
      location: 'Bengaluru, India',
      city: 'Bengaluru, India',
      address: 'Garuda Mall, Magrath Road, Ashok Nagar, Bengaluru',
      facilities: ['Dolby Atmos 7.1', 'Crown Recliners', 'Fresh Food Court', '4DX'],
      distance: '2.6 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'cinepolis-orion-mall',
      name: 'Cinépolis: Orion Mall, Rajajinagar',
      location: 'Bengaluru, India',
      city: 'Bengaluru, India',
      address: 'Orion Mall, Brigade Gateway, Malleshwaram-Rajajinagar, Bengaluru',
      facilities: ['VIP Recliner Screens', 'Macro XE', 'Dolby 7.1', 'Lounge Bar'],
      distance: '5.1 km away',
      timezone: 'Asia/Kolkata'
    }
  ],
  'Hyderabad, India': [
    {
      id: 'amb-cinemas-gachibowli',
      name: 'AMB Cinemas: Gachibowli',
      location: 'Hyderabad, India',
      city: 'Hyderabad, India',
      address: 'Sarath City Capital Mall, Gachibowli - Miyapur Road, Hyderabad',
      facilities: ['Screen 1 Super VIP', 'Dolby Atmos 64-Channel', 'Laser 4K', 'M-Lounge'],
      distance: '1.5 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'prasads-multiplex-necklace-road',
      name: 'Prasads Multiplex: Large Screen, Necklace Road',
      location: 'Hyderabad, India',
      city: 'Hyderabad, India',
      address: 'NTR Gardens, Necklace Road, Khairatabad, Hyderabad',
      facilities: ['Large Format Dual Laser', 'Dolby Atmos 7.1', 'Gaming Arena', 'Food Court'],
      distance: '3.4 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'pvr-inorbit-cyberabad',
      name: 'PVR: Inorbit Mall, Cyberabad',
      location: 'Hyderabad, India',
      city: 'Hyderabad, India',
      address: 'Inorbit Mall, Mindspace, Madhapur, Hyderabad',
      facilities: ['Gold Class Loungers', '4DX Screen', 'Dolby Atmos', 'In-Seat Dine'],
      distance: '2.8 km away',
      timezone: 'Asia/Kolkata'
    }
  ],
  'Chennai, India': [
    {
      id: 'spi-sathyam-royapettah',
      name: 'SPI: Sathyam Cinemas, Royapettah',
      location: 'Chennai, India',
      city: 'Chennai, India',
      address: 'Thiru Vi Ka Road, Royapettah, Chennai',
      facilities: ['Legendary RDX Screen', 'Dolby Atmos', 'Famous Butter Popcorn & Seasonings', 'Laser 4K'],
      distance: '1.9 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'pvr-vr-anna-nagar',
      name: 'PVR: VR Mall, Anna Nagar',
      location: 'Chennai, India',
      city: 'Chennai, India',
      address: 'VR Chennai, Jawaharlal Nehru Road, Anna Nagar, Chennai',
      facilities: ['IMAX Laser 3D', 'LUXE Auditorium', 'PVR PXL', 'Dolby 7.1'],
      distance: '3.7 km away',
      timezone: 'Asia/Kolkata'
    }
  ],
  'Kolkata, India': [
    {
      id: 'inox-quest-mall-park-circus',
      name: 'INOX: Quest Mall, Park Circus',
      location: 'Kolkata, India',
      city: 'Kolkata, India',
      address: 'Quest Mall, Syed Amir Ali Avenue, Park Circus, Kolkata',
      facilities: ['INSIGNIA Recliners', 'IMAX 3D Laser', 'Dolby Atmos 7.1', 'Gourmet Lounge'],
      distance: '2.3 km away',
      timezone: 'Asia/Kolkata'
    },
    {
      id: 'pvr-mani-square-em-bypass',
      name: 'PVR: Mani Square, EM Bypass',
      location: 'Kolkata, India',
      city: 'Kolkata, India',
      address: 'Mani Square Mall, EM Bypass, Kankurgachi, Kolkata',
      facilities: ['Dolby Atmos', '4DX Motion', 'Prime Seating', 'Café'],
      distance: '4.1 km away',
      timezone: 'Asia/Kolkata'
    }
  ]
};

// Default cinemas fallback
export const CINEMAS: Cinema[] = CINEMAS_BY_CITY['Mumbai, India'];

// Helper to get cinemas based on selected city
export const getCinemasForCity = (city: string): Cinema[] => {
  return CINEMAS_BY_CITY[city] || CINEMAS_BY_CITY['Mumbai, India'];
};

export interface ShowtimeSlot {
  time: string;
  format: string;
  hall: string;
  availability: 'available' | 'fast_filling' | 'almost_full' | 'sold_out';
  cancellable: boolean;
  subtitles: string;
  priceMultiplier: number;
}

export const SHOWTIMES_SCHEDULE: ShowtimeSlot[] = [
  {
    time: '10:15 AM',
    format: 'Dolby Atmos 7.1',
    hall: 'Audi 1',
    availability: 'available',
    cancellable: true,
    subtitles: 'English Subtitles',
    priceMultiplier: 1.0
  },
  {
    time: '01:45 PM',
    format: 'IMAX Laser 3D',
    hall: 'IMAX Laser Audi',
    availability: 'fast_filling',
    cancellable: true,
    subtitles: 'English Subtitles',
    priceMultiplier: 1.2
  },
  {
    time: '04:30 PM',
    format: '4DX',
    hall: '4DX Dynamic Screen',
    availability: 'almost_full',
    cancellable: false,
    subtitles: 'English Subtitles',
    priceMultiplier: 1.25
  },
  {
    time: '07:30 PM',
    format: 'IMAX Laser 3D',
    hall: 'IMAX Laser Audi',
    availability: 'almost_full',
    cancellable: true,
    subtitles: 'English Subtitles',
    priceMultiplier: 1.3
  },
  {
    time: '10:45 PM',
    format: 'VIP Recliner',
    hall: 'Luxe Audi 2',
    availability: 'fast_filling',
    cancellable: true,
    subtitles: 'English Subtitles',
    priceMultiplier: 1.4
  }
];

export const SNACK_ADDONS: SnackAddon[] = [
  // 1. COMBOS
  {
    id: 'combo-duo',
    name: 'Blockbuster Duo Combo',
    description: '1 Large Tub Caramel Popcorn + 2 Large Pepsis (600ml) + Nachos with molten warm cheese sauce.',
    price: 490,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=400&q=80',
    category: 'combo'
  },
  {
    id: 'combo-family',
    name: 'Family Feast Jumbo Combo',
    description: '2 Large Popcorn Tubs (Salted + Caramel) + 3 Cold Drinks + 2 Loaded Cheese Nachos.',
    price: 650,
    imageUrl: 'https://images.unsplash.com/photo-1572177191856-3cde618dee1f?auto=format&fit=crop&w=400&q=80',
    category: 'combo'
  },

  // 2. POPCORN (Caramel / Salted / Cheese)
  {
    id: 'popcorn-caramel',
    name: 'Artisan Sea-Salt Caramel Popcorn (L)',
    description: 'Freshly popped warm golden corn glazed with sea-salted butter caramel.',
    price: 280,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80',
    category: 'popcorn'
  },
  {
    id: 'popcorn-butter',
    name: 'Classic Butter Salted Popcorn (Tub)',
    description: 'Generously layered melted salted butter on piping hot crisp cinema popcorn.',
    price: 240,
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=400&q=80',
    category: 'popcorn'
  },
  {
    id: 'popcorn-cheese',
    name: 'Golden Cheddar Cheese Popcorn (Tub)',
    description: 'Crisp hot popcorn tossed in tangy sharp melted cheddar cheese powder.',
    price: 260,
    imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=400&q=80',
    category: 'popcorn'
  },

  // 3. SNACKS (Nachos, Burgers)
  {
    id: 'nachos-deluxe',
    name: 'Cheese Melt Nachos + Chunky Salsa',
    description: 'Crispy stone-ground corn tortilla chips with zesty jalapeño salsa and molten cheese dip.',
    price: 210,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80',
    category: 'snack'
  },
  {
    id: 'burger-crispy',
    name: 'Cinema Toasted Patty Burger',
    description: 'Toasted brioche bun with crisp herb patty, melted cheese, and smoky chipotle mayo.',
    price: 190,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    category: 'snack'
  },
  {
    id: 'samosa-trio',
    name: 'Delhi Chaat Samosa Duo',
    description: 'Crisp Punjabi spiced potato samosas served with sweet tamarind and mint chutney.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    category: 'snack'
  },

  // 4. BEVERAGES
  {
    id: 'drink-cola',
    name: 'Fountain Chilled Pepsi (750ml)',
    description: 'Ice-cold refreshing fountain cola with ice.',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    category: 'beverage'
  },
  {
    id: 'drink-dew',
    name: 'Mountain Dew Citrus Blast (750ml)',
    description: 'High-energy lemon-lime chilled fountain soda.',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80',
    category: 'beverage'
  },
  {
    id: 'drink-coffee',
    name: 'Belgian Iced Cold Coffee',
    description: 'Rich slow-brewed Arabica espresso blended with cold milk and chocolate drizzle.',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80',
    category: 'beverage'
  }
];

// CineBook demo rule: every movie ticket is ₹5, regardless of seat tier.
export const SEAT_PRICING = {
  VIP: 5,
  PREMIUM: 5,
  STANDARD: 5
};

export const SEAT_TIER_LABELS = {
  VIP: 'ROYAL RECLINER (₹5)',
  PREMIUM: 'CLUB / PRIME (₹5)',
  STANDARD: 'EXECUTIVE (₹5)'
};

// Generates an authentic 8-row by 16-column seating layout with central aisle
export const generateSeatLayout = (_seedKey?: string) => {
  // A, B = ROYAL RECLINER
  // C, D, E, F = CLUB / PRIME
  // G, H = EXECUTIVE
  const rows = [
    { letter: 'A', tier: 'VIP' as const },
    { letter: 'B', tier: 'VIP' as const },
    { letter: 'C', tier: 'PREMIUM' as const },
    { letter: 'D', tier: 'PREMIUM' as const },
    { letter: 'E', tier: 'PREMIUM' as const },
    { letter: 'F', tier: 'PREMIUM' as const },
    { letter: 'G', tier: 'STANDARD' as const },
    { letter: 'H', tier: 'STANDARD' as const }
  ];

  const totalSeatsPerRow = 16; // 8 on left, aisle, 8 on right
  
  return rows.map(({ letter: rowLetter, tier }) => {
    const rowSeats = [];
    for (let i = 1; i <= totalSeatsPerRow; i++) {
      const seatId = `${rowLetter}${i}`;
      rowSeats.push({
        id: seatId,
        row: rowLetter,
        number: i,
        tier,
        price: SEAT_PRICING[tier],
        status: 'available' as const
      });
    }
    return {
      rowLetter,
      tier,
      seats: rowSeats
    };
  });
};
