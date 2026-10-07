export interface MovieSeed {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  genre: string[];
  language: string;
  languages: string[];
  duration: string;
  durationMinutes: number;
  rating: number;
  votesCount: string;
  ageRating: string;
  releaseDate: string;
  status: 'now_showing' | 'coming_soon';
  director: string;
  cast: { name: string; role: string; avatar: string }[];
  formats: string[];
  featured?: boolean;
}

export interface CinemaSeed {
  id: string;
  name: string;
  city: string;
  location: string;
  address: string;
  facilities: string[];
  distance: string;
  timezone: string;
  chain?: string;
  screensCount?: number;
  amenities?: string[];
}

export const CITIES = [
  'Mumbai, India',
  'Hyderabad, India',
  'Bengaluru, India',
  'Chennai, India',
  'Delhi NCR, India',
  'Kolkata, India',
  'New York, NY',
  'Los Angeles, CA',
  'London, UK',
  'Toronto, Canada'
];

export const GENRES = [
  'All Genres',
  'Sci-Fi',
  'Action',
  'Adventure',
  'Thriller',
  'Drama',
  'Animation',
  'Comedy',
  'Horror',
  'Historical',
  'Fantasy'
];

export const LANGUAGES = [
  'All Languages',
  'Telugu',
  'Tamil',
  'Malayalam',
  'Kannada',
  'Hindi',
  'English',
  'Bengali',
  'Marathi',
  'Punjabi',
  'Gujarati',
  'Odia',
  'Assamese',
  'Urdu',
  'Sanskrit',
  'Korean',
  'Japanese',
  'Chinese',
  'Spanish',
  'French',
  'Other'
];

export const CINEMAS: CinemaSeed[] = [
  {
    id: 'cin-pvr-phoenix',
    name: 'PVR INOX Grand Mall',
    city: 'Mumbai, India',
    location: 'Lower Parel, Mumbai',
    address: 'High Street Phoenix, 462 Senapati Bapat Marg, Lower Parel',
    facilities: ['IMAX with Laser', '4DX', 'Dolby Atmos', 'Recliner Lounges', 'Gourmet Bar'],
    distance: '2.4 km',
    timezone: 'Asia/Kolkata'
  },
  {
    id: 'cin-amb-cinemas',
    name: 'AMB Cinemas Multiplex',
    city: 'Hyderabad, India',
    location: 'Gachibowli, Hyderabad',
    address: 'Sarath City Capital Mall, Gachibowli - Miyapur Rd',
    facilities: ['Dolby Atmos', 'VIP Laser', 'Lounge Bar', 'Valet Parking'],
    distance: '3.1 km',
    timezone: 'Asia/Kolkata'
  },
  {
    id: 'cin-pvr-orion',
    name: 'PVR Directors Cut Orion',
    city: 'Bengaluru, India',
    location: 'Rajajinagar, Bengaluru',
    address: 'Orion Mall, Brigade Gateway, Dr Rajkumar Rd',
    facilities: ['Dolby Atmos', 'Directors Cut Recliners', 'Full Dining Menu'],
    distance: '4.5 km',
    timezone: 'Asia/Kolkata'
  },
  {
    id: 'cin-sathyam-chennai',
    name: 'SPI Sathyam Cinemas',
    city: 'Chennai, India',
    location: 'Royapettah, Chennai',
    address: '8, Thiru Vi Ka Rd, Royapettah, Chennai',
    facilities: ['RGB Laser', 'Dolby Atmos', 'Legendary Popcorn Bar', 'DTS:X'],
    distance: '1.8 km',
    timezone: 'Asia/Kolkata'
  },
  {
    id: 'cin-amc-lincoln',
    name: 'AMC Lincoln Square 13',
    city: 'New York, NY',
    location: 'Upper West Side, Manhattan',
    address: '1998 Broadway, New York, NY 10023',
    facilities: ['70mm IMAX GT', 'Dolby Cinema', 'Prime 3D', 'Reserved Recliners'],
    distance: '1.2 miles',
    timezone: 'America/New_York'
  },
  {
    id: 'cin-odeon-leicester',
    name: 'ODEON Luxe Leicester Square',
    city: 'London, UK',
    location: 'Leicester Square, London',
    address: '24-26 Leicester Square, London WC2H 7LQ',
    facilities: ['Dolby Cinema', 'Royal Box Recliners', 'Luxe Bar'],
    distance: '0.8 miles',
    timezone: 'Europe/London'
  }
];

export const MOVIES: MovieSeed[] = [
  {
    id: 'kalki-2898',
    title: 'Kalki: 2898 AD - Chrono Force',
    tagline: 'When the world falls into darkness, the tenth avatar rises.',
    synopsis: 'A modern-day mythological sci-fi epic set in a dystopian future year 2898 AD. Bhairava, a bounty hunter, embarks on a fate-altering journey through Shambhala and Kasi to protect the miraculous unborn child who holds humanity’s salvation.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genre: ['Sci-Fi', 'Action', 'Fantasy'],
    language: 'Telugu',
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'English'],
    duration: '2h 58m',
    durationMinutes: 178,
    rating: 8.9,
    votesCount: '142.5K',
    ageRating: 'UA 16+',
    releaseDate: '2024-06-27',
    status: 'now_showing',
    director: 'Nag Ashwin',
    cast: [
      { name: 'Prabhas', role: 'Bhairava', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Amitabh Bachchan', role: 'Ashwatthama', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Deepika Padukone', role: 'SUM-80', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
      { name: 'Kamal Haasan', role: 'Supreme Yaskin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', '3D', 'IMAX 3D', 'Dolby Atmos'],
    featured: true
  },
  {
    id: 'leo-bloody-sweet',
    title: 'Leo: Bloody Sweet',
    tagline: 'Keep your friends close, but your enemies closer.',
    synopsis: 'A mild-mannered cafe owner in Himachal Pradesh becomes an overnight hero after foiling an armed robbery, but the notoriety attracts relentless drug lords who believe he is their long-lost enforcer.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Thriller'],
    language: 'Tamil',
    languages: ['Tamil', 'Telugu', 'Hindi', 'Kannada', 'Malayalam'],
    duration: '2h 44m',
    durationMinutes: 164,
    rating: 8.4,
    votesCount: '98.2K',
    ageRating: 'UA 16+',
    releaseDate: '2023-10-19',
    status: 'now_showing',
    director: 'Lokesh Kanagaraj',
    cast: [
      { name: 'Thalapathy Vijay', role: 'Parthiban / Leo Das', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Sanjay Dutt', role: 'Antony Das', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
      { name: 'Trisha Krishnan', role: 'Sathya', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'IMAX', 'Dolby Atmos'],
    featured: true
  },
  {
    id: 'kantara-chapter-1',
    title: 'Kantara: A Legend Chapter 1',
    tagline: 'When faith is tested, the divine roars.',
    synopsis: 'Exploring the genesis of the divine folk deity Panjurli during the reign of the Kadamba empire, unravelling ancient tribal legends, devotion, and sacred forest protection.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Drama', 'Fantasy'],
    language: 'Kannada',
    languages: ['Kannada', 'Telugu', 'Tamil', 'Hindi', 'Malayalam', 'English', 'Bengali'],
    duration: '2h 38m',
    durationMinutes: 158,
    rating: 9.1,
    votesCount: '87.4K',
    ageRating: 'UA 16+',
    releaseDate: '2024-10-02',
    status: 'now_showing',
    director: 'Rishab Shetty',
    cast: [
      { name: 'Rishab Shetty', role: 'The Ancestral Warrior', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'IMAX', 'Dolby Atmos']
  },
  {
    id: 'manjummel-boys',
    title: 'Manjummel Boys',
    tagline: 'Friendship beyond the depths of darkness.',
    synopsis: 'A close-knit group of friends from a small town in Kerala embark on a holiday trip to Kodaikanal. Their vacation turns into a nail-biting rescue mission when one falls into the infamous Guna Caves.',
    posterUrl: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80',
    genre: ['Adventure', 'Thriller', 'Drama'],
    language: 'Malayalam',
    languages: ['Malayalam', 'Tamil', 'Telugu', 'Hindi', 'Kannada'],
    duration: '2h 15m',
    durationMinutes: 135,
    rating: 8.8,
    votesCount: '64.1K',
    ageRating: 'U',
    releaseDate: '2024-02-22',
    status: 'now_showing',
    director: 'Chidambaram',
    cast: [
      { name: 'Soubin Shahir', role: 'Kuttan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Sreenath Bhasi', role: 'Subhash', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'Dolby Atmos']
  },
  {
    id: 'rudra-fire-within',
    title: 'Rudra: The Fire Within',
    tagline: 'Courage is born in the heart of rebellion.',
    synopsis: 'A fearless cop operating in the heartlands uncovers a deep-rooted syndicate threatening national security. He takes law and justice into his own hands.',
    posterUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Thriller', 'Drama'],
    language: 'Hindi',
    languages: ['Hindi', 'Telugu', 'Tamil', 'Punjabi', 'Gujarati', 'Marathi'],
    duration: '2h 32m',
    durationMinutes: 152,
    rating: 8.6,
    votesCount: '76.3K',
    ageRating: 'UA 16+',
    releaseDate: '2024-08-15',
    status: 'now_showing',
    director: 'Siddharth Anand',
    cast: [
      { name: 'Ranveer Kapoor', role: 'ACP Rudra Pratap', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Kiara Sen', role: 'Inspector Meera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', '3D', 'IMAX', '4DX']
  },
  {
    id: 'dune-part-two',
    title: 'Dune: Prophecy & Power',
    tagline: 'Long live the fighters.',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    languages: ['English', 'Hindi', 'Spanish', 'French', 'Japanese', 'Korean'],
    duration: '2h 46m',
    durationMinutes: 166,
    rating: 9.0,
    votesCount: '310.8K',
    ageRating: 'PG-13',
    releaseDate: '2024-03-01',
    status: 'now_showing',
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Zendaya', role: 'Chani', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'IMAX 3D', 'Dolby Cinema'],
    featured: true
  },
  {
    id: 'parasite-requiem',
    title: 'Parasite: Shadow of the Citadel',
    tagline: 'Class warfare takes no prisoners.',
    synopsis: 'A gripping social thriller following two families on opposite poles of modern Seoul whose lives intertwine through deception, luxury, and underground secrets.',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    genre: ['Thriller', 'Drama'],
    language: 'Korean',
    languages: ['Korean', 'English', 'Hindi', 'Japanese', 'Chinese'],
    duration: '2h 12m',
    durationMinutes: 132,
    rating: 8.7,
    votesCount: '49.8K',
    ageRating: 'UA 16+',
    releaseDate: '2024-09-12',
    status: 'now_showing',
    director: 'Bong Joon-ho',
    cast: [
      { name: 'Song Kang-ho', role: 'Kim Ki-taek', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'Dolby Atmos']
  },
  {
    id: 'chronicles-elysium',
    title: 'Chronicles of Elysium',
    tagline: 'Beyond the horizon of memory lies the forgotten realm.',
    synopsis: 'In futuristic Neo-Tokyo, a memory architect accidentally unlocks the suppressed historical record of humanity’s original contact with ancient celestial guardians.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
    genre: ['Animation', 'Sci-Fi', 'Fantasy'],
    language: 'Japanese',
    languages: ['Japanese', 'English', 'French', 'Korean', 'Chinese'],
    duration: '1h 56m',
    durationMinutes: 116,
    rating: 8.9,
    votesCount: '52.1K',
    ageRating: 'PG',
    releaseDate: '2024-11-20',
    status: 'coming_soon',
    director: 'Makoto Shinkai',
    cast: [
      { name: 'Ryunosuke Kamiki', role: 'Ren Tachibana (voice)', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'IMAX']
  },
  {
    id: 'subhash-netaji-saga',
    title: 'Subhash: The Unfinished War',
    tagline: 'Freedom is not given, it is taken.',
    synopsis: 'A grand historical epic uncovering the secret intelligence archives of Netaji Subhas Chandra Bose and the brave soldiers of the Indian National Army.',
    posterUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=1920&q=80',
    genre: ['Historical', 'Drama', 'Action'],
    language: 'Bengali',
    languages: ['Bengali', 'Hindi', 'English', 'Odia', 'Assamese'],
    duration: '2h 40m',
    durationMinutes: 160,
    rating: 8.5,
    votesCount: '34.2K',
    ageRating: 'U',
    releaseDate: '2024-05-10',
    status: 'now_showing',
    director: 'Srijit Mukherji',
    cast: [
      { name: 'Prosenjit Chatterjee', role: 'Netaji Subhas Chandra Bose', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'Dolby Atmos']
  },
  {
    id: 'swarajya-maratha-yoddha',
    title: 'Swarajya: Maratha Yoddha',
    tagline: 'Roar of the Sahyadri mountains.',
    synopsis: 'The legendary military tactics and unyielding spirit of the Maratha hill fort commanders who defended the realm against overwhelming odds.',
    posterUrl: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genre: ['Historical', 'Action'],
    language: 'Marathi',
    languages: ['Marathi', 'Hindi', 'Gujarati', 'English'],
    duration: '2h 25m',
    durationMinutes: 145,
    rating: 8.7,
    votesCount: '41.8K',
    ageRating: 'UA 13+',
    releaseDate: '2024-07-19',
    status: 'now_showing',
    director: 'Digpal Lanjekar',
    cast: [
      { name: 'Chinmay Mandlekar', role: 'Chhatrapati Shivaji Maharaj', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'Dolby Atmos']
  },
  {
    id: 'sher-e-punjab',
    title: 'Sher-E-Punjab: The Lion King of Lahore',
    tagline: 'One Crown. One Pride. Everlasting Glory.',
    synopsis: 'The majestic rise of Maharaja Ranjit Singh, bringing together divided confederacies into an invincible sovereign empire of prosperity and religious harmony.',
    posterUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80',
    genre: ['Historical', 'Action', 'Drama'],
    language: 'Punjabi',
    languages: ['Punjabi', 'Hindi', 'Urdu', 'English'],
    duration: '2h 35m',
    durationMinutes: 155,
    rating: 8.6,
    votesCount: '29.3K',
    ageRating: 'UA 13+',
    releaseDate: '2024-11-15',
    status: 'coming_soon',
    director: 'Anurag Singh',
    cast: [
      { name: 'Diljit Dosanjh', role: 'Maharaja Ranjit Singh', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'IMAX']
  },
  {
    id: 'abhigyan-sanskrit-odyssey',
    title: 'Abhigyan: The Vedic Chronology',
    tagline: 'The timeless resonance of ancient Sanskrit wisdom.',
    synopsis: 'An astronomical archaeologist decodes the hidden celestial alignments embedded within classical Sanskrit manuscripts, discovering an ancient energy network.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
    genre: ['Sci-Fi', 'Fantasy', 'Adventure'],
    language: 'Sanskrit',
    languages: ['Sanskrit', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'English'],
    duration: '2h 10m',
    durationMinutes: 130,
    rating: 9.3,
    votesCount: '19.4K',
    ageRating: 'U',
    releaseDate: '2024-12-25',
    status: 'coming_soon',
    director: 'Dr. Chandraprakash Dwivedi',
    cast: [
      { name: 'Pankaj Tripathi', role: 'Acharya Vidyadhar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'Dolby Atmos']
  },
  {
    id: 'ghalib-shehr-e-urdu',
    title: 'Ghalib: Shehr-e-Sukhan',
    tagline: 'Poetry carved into stone and sorrow.',
    synopsis: 'A heartfelt romantic drama set in the winding alleys of 19th-century Shahjahanabad, celebrating the timeless couplets of Mirza Ghalib.',
    posterUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    genre: ['Drama', 'Historical'],
    language: 'Urdu',
    languages: ['Urdu', 'Hindi', 'Punjabi', 'English'],
    duration: '2h 18m',
    durationMinutes: 138,
    rating: 8.8,
    votesCount: '22.1K',
    ageRating: 'U',
    releaseDate: '2024-06-14',
    status: 'now_showing',
    director: 'Muzaffar Ali',
    cast: [
      { name: 'Naseeruddin Shah', role: 'Mirza Asadullah Baig Khan', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D']
  },
  {
    id: 'kutch-express',
    title: 'Kutch: Colours of the White Desert',
    tagline: 'Every thread has a song. Every heart has a desert.',
    synopsis: 'A heartwarming story of an artisanal embroidery community in Kutch, whose vibrant art bridges generational divides and triumphs at global fashion week.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80',
    genre: ['Drama', 'Comedy'],
    language: 'Gujarati',
    languages: ['Gujarati', 'Hindi', 'Marathi', 'English'],
    duration: '2h 08m',
    durationMinutes: 128,
    rating: 8.5,
    votesCount: '18.9K',
    ageRating: 'U',
    releaseDate: '2024-04-05',
    status: 'now_showing',
    director: 'Viral Shah',
    cast: [
      { name: 'Ratna Pathak Shah', role: 'Baiji', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D']
  },
  {
    id: 'el-ultimo-tango',
    title: 'El Último Tango en Buenos Aires',
    tagline: 'When two souls meet in rhythm, words are superfluous.',
    synopsis: 'A world-champion tango master and an ambitious street dancer form an electrifying partnership, confronting past betrayals and international rivals.',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1920&q=80',
    genre: ['Drama', 'Thriller'],
    language: 'Spanish',
    languages: ['Spanish', 'French', 'English', 'Italian'],
    duration: '1h 58m',
    durationMinutes: 118,
    rating: 8.4,
    votesCount: '27.6K',
    ageRating: 'UA 16+',
    releaseDate: '2024-10-31',
    status: 'coming_soon',
    director: 'Guillermo del Toro',
    cast: [
      { name: 'Javier Bardem', role: 'Mateo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'Dolby Atmos']
  },
  {
    id: 'le-mystere-paris',
    title: 'Le Mystère de l’Ombre',
    tagline: 'The city of lights conceals the darkest shadows.',
    synopsis: 'A cunning art detective races through Paris’s subterranean catacombs to solve the impossible theft of a priceless Renaissance manuscript.',
    posterUrl: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    genre: ['Thriller', 'Action'],
    language: 'French',
    languages: ['French', 'English', 'Spanish', 'German', 'Italian'],
    duration: '2h 04m',
    durationMinutes: 124,
    rating: 8.3,
    votesCount: '21.4K',
    ageRating: 'UA 13+',
    releaseDate: '2024-11-08',
    status: 'coming_soon',
    director: 'Luc Besson',
    cast: [
      { name: 'Jean Dujardin', role: 'Julien Laurent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['2D', 'IMAX']
  }
];

export interface CouponSeed {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotal: number;
  expiresAt: string;
}

export const COUPONS: CouponSeed[] = [
  {
    code: 'ICICI20',
    description: '20% instant discount up to ₹150 with ICICI Bank Credit Cards',
    discountType: 'percentage',
    discountValue: 20,
    minSubtotal: 200,
    expiresAt: '2027-12-31'
  },
  {
    code: 'BMSWELCOME',
    description: 'Flat ₹100 off on your movie tickets',
    discountType: 'fixed',
    discountValue: 100,
    minSubtotal: 250,
    expiresAt: '2027-12-31'
  },
  {
    code: 'KOTAK50',
    description: 'Buy 1 Get 1 free offer (50% off on 2+ tickets)',
    discountType: 'percentage',
    discountValue: 50,
    minSubtotal: 400,
    expiresAt: '2027-12-31'
  },
  {
    code: 'WELCOME50',
    description: '$5.00 Welcome Discount on orders over $15',
    discountType: 'fixed',
    discountValue: 5.0,
    minSubtotal: 15.0,
    expiresAt: '2027-12-31'
  },
  {
    code: 'CINE10',
    description: '10% Off Instant Discount on Any Booking',
    discountType: 'percentage',
    discountValue: 10,
    minSubtotal: 10.0,
    expiresAt: '2027-12-31'
  },
  {
    code: 'BLOCKBUSTER20',
    description: '20% Mega Blockbuster Savings on orders over $25',
    discountType: 'percentage',
    discountValue: 20,
    minSubtotal: 25.0,
    expiresAt: '2027-12-31'
  }
];

export interface ReviewSeed {
  id: string;
  movieId: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 10
  comment: string;
  createdAt: string;
}

export const INITIAL_REVIEWS: ReviewSeed[] = [
  {
    id: 'rev-01',
    movieId: 'kalki-2898',
    userName: 'Karthik Reddy',
    rating: 9.5,
    comment: 'Spectacular world-building and breathtaking visual effects! The background score by Santhosh Narayanan in the second half gave absolute goosebumps.',
    createdAt: '2024-07-02T14:20:00Z'
  },
  {
    id: 'rev-02',
    movieId: 'kalki-2898',
    userName: 'Ananya Deshmukh',
    rating: 8.8,
    comment: 'The fusion of Mahabharata lore with cyberpunk aesthetics is extraordinary. Amitabh Bachchan as Ashwatthama steals every single scene he is in.',
    createdAt: '2024-07-04T18:10:00Z'
  },
  {
    id: 'rev-03',
    movieId: 'stree-2',
    userName: 'Rajesh Sharma',
    rating: 8.5,
    comment: 'Pure entertainment from start to finish! The humor landed brilliantly and Pankaj Tripathi was comedic gold as usual.',
    createdAt: '2024-08-16T12:00:00Z'
  }
];

