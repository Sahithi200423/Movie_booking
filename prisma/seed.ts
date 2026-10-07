import { PrismaClient, Role, SoundType, Certification, SeatTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting BookMyShow Clone Database Seeding...');

  // 1. CLEANUP EXISTING DATA (Optional - safe idempotent upserts)
  console.log('🧹 Purging old records for fresh seed...');
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.seatReservation.deleteMany({});
  await prisma.seat.deleteMany({});
  await prisma.showtime.deleteMany({});
  await prisma.screen.deleteMany({});
  await prisma.cinema.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. SEED USERS
  console.log('👤 Seeding Users & Admins...');
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Administrator',
      email: 'admin@bookmyshow.clone',
      phone: '+919876543210',
      passwordHash: '$2a$10$7Z2P.hG4UaD8iU93k.1cCe8s2Z3tP1Y5Q2Qz7h6Z6B3b8uX1x4P2a', // hashed pass
      role: Role.SUPERADMIN
    }
  });

  const theatreManager = await prisma.user.create({
    data: {
      name: 'PVR Theatre Manager',
      email: 'manager.pvr@theatres.in',
      phone: '+919811223344',
      passwordHash: '$2a$10$7Z2P.hG4UaD8iU93k.1cCe8s2Z3tP1Y5Q2Qz7h6Z6B3b8uX1x4P2a',
      role: Role.THEATRE_ADMIN
    }
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul.moviegoer@gmail.com',
      phone: '+919820011223',
      passwordHash: '$2a$10$7Z2P.hG4UaD8iU93k.1cCe8s2Z3tP1Y5Q2Qz7h6Z6B3b8uX1x4P2a',
      role: Role.USER
    }
  });

  // 3. SEED CITIES (3 Major Indian Metros)
  console.log('🏙️ Seeding Cities...');
  const mumbai = await prisma.city.create({
    data: { name: 'Mumbai', state: 'Maharashtra', slug: 'mumbai' }
  });

  const delhi = await prisma.city.create({
    data: { name: 'Delhi-NCR', state: 'Delhi', slug: 'delhi-ncr' }
  });

  const bangalore = await prisma.city.create({
    data: { name: 'Bengaluru', state: 'Karnataka', slug: 'bengaluru' }
  });

  // 4. SEED CINEMAS (4 Flagship Multiplexes)
  console.log('🎭 Seeding Multiplex Cinemas...');
  const pvrPhoenix = await prisma.cinema.create({
    data: {
      name: 'PVR ICON: Phoenix Palladium, Lower Parel',
      address: '462 Senapati Bapat Marg, Lower Parel, Mumbai - 400013',
      cityId: mumbai.id,
      totalScreens: 7
    }
  });

  const inoxInorbit = await prisma.cinema.create({
    data: {
      name: 'INOX Megaplex: Inorbit Mall, Malad',
      address: 'Link Road, Malad West, Mumbai - 400064',
      cityId: mumbai.id,
      totalScreens: 11
    }
  });

  const pvrDirectorsCut = await prisma.cinema.create({
    data: {
      name: 'PVR Director’s Cut: Ambience Mall, Vasant Kunj',
      address: 'Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070',
      cityId: delhi.id,
      totalScreens: 4
    }
  });

  const cinepolisForum = await prisma.cinema.create({
    data: {
      name: 'Cinépolis: Forum Shantiniketan Mall, Whitefield',
      address: 'ITPL Main Road, Whitefield, Bengaluru - 560067',
      cityId: bangalore.id,
      totalScreens: 8
    }
  });

  // 5. SEED SCREENS
  console.log('🖥️ Seeding Screens with Advanced Sound Types...');
  const screen1 = await prisma.screen.create({
    data: {
      cinemaId: pvrPhoenix.id,
      screenNumber: 1,
      soundType: SoundType.IMAX
    }
  });

  const screen2 = await prisma.screen.create({
    data: {
      cinemaId: pvrPhoenix.id,
      screenNumber: 2,
      soundType: SoundType.DOLBY_ATMOS
    }
  });

  const screen3 = await prisma.screen.create({
    data: {
      cinemaId: pvrDirectorsCut.id,
      screenNumber: 1,
      soundType: SoundType.DOLBY_ATMOS
    }
  });

  const screen4 = await prisma.screen.create({
    data: {
      cinemaId: cinepolisForum.id,
      screenNumber: 1,
      soundType: SoundType.FOUR_DX
    }
  });

  // 6. SEED 200+ CONFIGURED SEATS FOR AUDITORIUM SCREEN 1
  console.log('🪑 Seeding 200+ Categorized Seats (Recliner, Gold, Silver)...');
  const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatDataToInsert = [];

  for (const row of seatRows) {
    let tier = SeatTier.SILVER;
    let basePrice = 180.0;

    if (row === 'A' || row === 'B') {
      tier = SeatTier.VIP_RECLINER;
      basePrice = 420.0;
    } else if (['C', 'D', 'E', 'F'].includes(row)) {
      tier = SeatTier.GOLD;
      basePrice = 280.0;
    }

    // 20 seats per row = 10 rows * 20 seats = 200 seats!
    for (let num = 1; num <= 20; num++) {
      seatDataToInsert.push({
        screenId: screen1.id,
        row,
        number: num,
        tier,
        basePrice
      });
    }
  }

  // Bulk insert seats into Screen 1
  await prisma.seat.createMany({
    data: seatDataToInsert
  });
  console.log(`✅ Inserted ${seatDataToInsert.length} seats into Screen 1.`);

  // 7. SEED 6 BLOCKBUSTER MOVIES
  console.log('🎬 Seeding 6 Blockbuster Movies...');
  const movies = await Promise.all([
    prisma.movie.create({
      data: {
        title: 'Kalki 2898 AD',
        synopsis:
          'Set in a post-apocalyptic world in the year 2898 AD, a modern-day avatar of Vishnu descends to protect the world from evil forces in the city of Kasi.',
        duration: 181,
        language: 'Telugu / Hindi',
        genre: ['Sci-Fi', 'Action', 'Mythology'],
        certification: Certification.UA,
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop',
        releaseDate: new Date('2026-06-27')
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Dune: Part Two',
        synopsis:
          'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        duration: 166,
        language: 'English',
        genre: ['Sci-Fi', 'Adventure', 'Drama'],
        certification: Certification.UA,
        posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop',
        releaseDate: new Date('2026-03-01')
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Interstellar (10th Anniversary IMAX Re-Release)',
        synopsis:
          'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers.',
        duration: 169,
        language: 'English',
        genre: ['Sci-Fi', 'Adventure', 'Drama'],
        certification: Certification.UA,
        posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=1600&auto=format&fit=crop',
        releaseDate: new Date('2026-09-15')
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Deadpool & Wolverine',
        synopsis:
          'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him until the Time Variance Authority pulls him in.',
        duration: 128,
        language: 'English / Hindi',
        genre: ['Action', 'Comedy', 'Sci-Fi'],
        certification: Certification.A,
        posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop',
        releaseDate: new Date('2026-07-26')
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Oppenheimer',
        synopsis:
          'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during the Manhattan Project.',
        duration: 180,
        language: 'English',
        genre: ['Biography', 'Drama', 'History'],
        certification: Certification.UA,
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop',
        releaseDate: new Date('2026-07-21')
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Jawan',
        synopsis:
          'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
        duration: 169,
        language: 'Hindi / Tamil',
        genre: ['Action', 'Thriller'],
        certification: Certification.UA,
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1600&auto=format&fit=crop',
        releaseDate: new Date('2026-09-07')
      }
    })
  ]);

  // 8. SEED SHOWTIMES FOR TODAY AND UPCOMING DAYS
  console.log('⏰ Seeding Showtimes across Screens...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const showtimeSlots = [
    { startHour: 10, startMin: 30, duration: 180 },
    { startHour: 14, startMin: 15, duration: 180 },
    { startHour: 18, startMin: 0, duration: 180 },
    { startHour: 21, startMin: 45, duration: 180 }
  ];

  for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
    const showDate = new Date(today);
    showDate.setDate(today.getDate() + dayOffset);

    for (const slot of showtimeSlots) {
      const startTime = new Date(showDate);
      startTime.setHours(slot.startHour, slot.startMin, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + slot.duration);

      await prisma.showtime.create({
        data: {
          movieId: movies[0].id, // Kalki 2898 AD
          screenId: screen1.id,
          date: showDate,
          startTime,
          endTime
        }
      });
    }
  }

  console.log('======================================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log(`- 3 Cities (Mumbai, Delhi-NCR, Bengaluru)`);
  console.log(`- 4 Multiplex Cinemas (PVR ICON, INOX Megaplex, etc.)`);
  console.log(`- 4 Screens with IMAX, Dolby Atmos, 4DX`);
  console.log(`- 200 Configured Seats with Recliner, Gold & Silver tiers`);
  console.log(`- 6 Blockbuster Movies`);
  console.log(`- 12 Showtimes with Date & Time schedules`);
  console.log(`- 3 Users (SUPERADMIN, THEATRE_ADMIN, USER)`);
  console.log('======================================================');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
