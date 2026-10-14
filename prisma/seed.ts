import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive CineBook database seeding...\n');

  // Clear existing records to ensure idempotent clean seed
  await prisma.payment.deleteMany();
  await prisma.seatReservation.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.theatre.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  // 1. Users
  console.log('👤 Seeding Users...');
  const customer = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      role: 'USER',
    }
  });

  const staff = await prisma.user.create({
    data: {
      name: 'Rohan Mehra (Gate Scanner)',
      email: 'staff@cinebook.com',
      phone: '+91 98765 00001',
      role: 'THEATRE_STAFF',
    }
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Cinema Operations Admin',
      email: 'admin@cinebook.com',
      phone: '+91 98765 99999',
      role: 'ADMIN',
    }
  });

  // 2. 6 Popular Indian & Global Box Office Movies
  console.log('🎬 Seeding 6 Popular Movies...');
  const moviesData = [
    {
      id: 'kalki-2898',
      title: 'Kalki 2898 AD',
      synopsis: 'A modern avatar of Vishnu descends to Earth to protect the world from evil forces in a futuristic dystopian world.',
      duration: 181,
      language: 'Telugu, Hindi, Tamil',
      genre: 'Action, Sci-Fi',
      certification: 'UA',
      rating: 8.7,
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600',
      status: 'now_showing'
    },
    {
      id: 'stree-2',
      title: 'Stree 2',
      synopsis: 'The town of Chanderi is being terrorized by a headless monster. The locals must team up once again to save their loved ones.',
      duration: 149,
      language: 'Hindi',
      genre: 'Comedy, Horror',
      certification: 'UA',
      rating: 8.4,
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1600',
      status: 'now_showing'
    },
    {
      id: 'dune-part-two',
      title: 'Dune: Part Two',
      synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
      duration: 166,
      language: 'English, Hindi',
      genre: 'Sci-Fi, Adventure',
      certification: 'UA',
      rating: 8.9,
      posterUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1600',
      status: 'now_showing'
    },
    {
      id: 'devara-part-1',
      title: 'Devara: Part 1',
      synopsis: 'An epic action saga set across coastal lands where an uncompromising chieftain protects his people from treachery.',
      duration: 178,
      language: 'Telugu, Hindi',
      genre: 'Action, Drama',
      certification: 'A',
      rating: 8.2,
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600',
      status: 'now_showing'
    },
    {
      id: 'pushpa-2',
      title: 'Pushpa 2: The Rule',
      synopsis: 'Pushpa Raj consolidates his syndicate dominance while facing relentless opposition from Bhanwar Singh Shekhawat.',
      duration: 185,
      language: 'Telugu, Hindi, Tamil',
      genre: 'Action, Crime, Thriller',
      certification: 'UA',
      rating: 8.8,
      posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1600',
      status: 'now_showing'
    },
    {
      id: 'manjummel-boys',
      title: 'Manjummel Boys',
      synopsis: 'A group of friends from Kochi embark on a trip to Kodaikanal where an unexpected rescue mission tests their courage.',
      duration: 135,
      language: 'Malayalam, Tamil, Hindi',
      genre: 'Survival, Thriller, Drama',
      certification: 'U',
      rating: 8.6,
      posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1600',
      status: 'now_showing'
    }
  ];

  const createdMovies = [];
  for (const m of moviesData) {
    const movie = await prisma.movie.create({ data: m });
    createdMovies.push(movie);
  }

  // 3. 4 Authentic Indian Cinema Venues
  console.log('🏛️ Seeding 4 Authentic Multiplex Venues (PVR, INOX, Cinépolis)...');
  const venuesData = [
    {
      id: 'theatre-pvr-phoenix',
      name: 'PVR ICON: Phoenix Palladium, Lower Parel',
      chain: 'PVR',
      city: 'Mumbai',
      address: '462, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
      screens: [
        { name: 'Audi 1 - IMAX Laser 3D', screenNumber: 1, format: 'IMAX Laser 3D' },
        { name: 'Audi 2 - Dolby Atmos 7.1', screenNumber: 2, format: 'Dolby Atmos 7.1' }
      ]
    },
    {
      id: 'theatre-inox-inorbit',
      name: 'INOX Megaplex: Inorbit Mall, Malad',
      chain: 'INOX',
      city: 'Mumbai',
      address: 'Inorbit Mall, Link Road, Malad West, Mumbai, Maharashtra 400064',
      screens: [
        { name: 'Screen 1 - 4DX Immersive', screenNumber: 1, format: '4DX' },
        { name: 'Screen 2 - Insignia Dolby', screenNumber: 2, format: 'Dolby Atmos 7.1' }
      ]
    },
    {
      id: 'theatre-cinepolis-viviana',
      name: 'Cinépolis VIP: Viviana Mall, Thane',
      chain: 'Cinépolis',
      city: 'Mumbai',
      address: 'Viviana Mall, Eastern Express Highway, Thane West, Mumbai 400606',
      screens: [
        { name: 'VIP Audi 1 - Luxury Recliner', screenNumber: 1, format: 'VIP Recliner' },
        { name: 'Audi 2 - Macro XE Laser', screenNumber: 2, format: 'Macro XE' }
      ]
    },
    {
      id: 'theatre-pvr-ambience',
      name: "PVR Director's Cut: Ambience Mall, Vasant Kunj",
      chain: 'PVR',
      city: 'Delhi-NCR',
      address: 'Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi 110070',
      screens: [
        { name: "Director's Cut 1 - Ultra Luxe", screenNumber: 1, format: 'VIP Recliner' },
        { name: 'Audi 2 - Dolby 7.1 Atmos', screenNumber: 2, format: 'Dolby Atmos 7.1' }
      ]
    }
  ];

  // Helper to generate full 128-seat layout per screen (Rows A to H, 16 seats each)
  // Rows A-B: RECLINER (₹650)
  // Rows C-F: PRIME (₹350)
  // Rows G-H: EXECUTIVE (₹220)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const allScreens = [];

  for (const v of venuesData) {
    const theatre = await prisma.theatre.create({
      data: {
        id: v.id,
        name: v.name,
        chain: v.chain,
        city: v.city,
        address: v.address,
      }
    });

    for (const s of v.screens) {
      const screen = await prisma.screen.create({
        data: {
          theatreId: theatre.id,
          name: s.name,
          screenNumber: s.screenNumber,
          format: s.format,
        }
      });
      allScreens.push(screen);

      // Create 128 seats for this screen
      const seatsToCreate = [];
      for (const row of rows) {
        const isRecliner = row === 'A' || row === 'B';
        const isPrime = row === 'C' || row === 'D' || row === 'E' || row === 'F';
        const tier = isRecliner ? 'RECLINER' : isPrime ? 'PRIME' : 'EXECUTIVE';
        const price = isRecliner ? 650.0 : isPrime ? 350.0 : 220.0;

        for (let num = 1; num <= 16; num++) {
          seatsToCreate.push({
            screenId: screen.id,
            row,
            number: num,
            seatNumber: `${row}${num}`,
            tier,
            basePrice: price,
          });
        }
      }

      await prisma.seat.createMany({
        data: seatsToCreate
      });
    }
  }

  console.log(`💺 Created full 128-seat layouts for ${allScreens.length} auditorium screens (Total: ${allScreens.length * 128} seats).`);

  // 4. Showtimes
  console.log('⏰ Scheduling Showtimes across Movies & Screens...');
  const showTimesSlots = [
    { time: '10:30 AM', startHour: 10, startMin: 30 },
    { time: '01:45 PM', startHour: 13, startMin: 45 },
    { time: '05:15 PM', startHour: 17, startMin: 15 },
    { time: '08:45 PM', startHour: 20, startMin: 45 }
  ];

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  const createdShowtimes = [];

  for (let sIdx = 0; sIdx < allScreens.length; sIdx++) {
    const screen = allScreens[sIdx];
    const movie = createdMovies[sIdx % createdMovies.length];

    for (const slot of showTimesSlots) {
      const startTime = new Date(today);
      startTime.setHours(slot.startHour, slot.startMin, 0, 0);

      const endTime = new Date(startTime.getTime() + movie.duration * 60 * 1000);

      const showtime = await prisma.showtime.create({
        data: {
          movieId: movie.id,
          screenId: screen.id,
          startTime,
          endTime,
          date: dateStr,
          time: slot.time,
          language: movie.language.split(',')[0].trim(),
          format: screen.format,
          cancellable: true,
          subtitles: true
        }
      });
      createdShowtimes.push(showtime);
    }
  }

  // 5. Pre-fill some booked and held seats on first showtime for realistic live feel
  console.log('🎟️ Pre-populating Sample Live Bookings and M-Tickets...');
  if (createdShowtimes.length > 0) {
    const primaryShow = createdShowtimes[0];
    const screenSeats = await prisma.seat.findMany({
      where: { screenId: primaryShow.screenId }
    });

    const bookedSeatIds = ['C7', 'C8', 'D7', 'D8'];
    const bookedSeats = screenSeats.filter(s => bookedSeatIds.includes(s.seatNumber));

    if (bookedSeats.length > 0) {
      const sampleBooking = await prisma.booking.create({
        data: {
          bookingRef: 'BMS-849204-KL',
          userId: customer.id,
          showtimeId: primaryShow.id,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone!,
          seatsCount: bookedSeats.length,
          seatIds: bookedSeats.map(s => s.seatNumber).join(', '),
          seatDetails: JSON.stringify(bookedSeats.map(s => ({ id: s.seatNumber, tier: s.tier, price: s.basePrice }))),
          baseAmount: 1400.0,
          convenienceFee: 120.0,
          gstAmount: 21.60,
          donationAmount: 2.0,
          discountAmount: 0.0,
          totalAmount: 1543.60,
          status: 'CONFIRMED',
          qrCodeData: JSON.stringify({
            ref: 'BMS-849204-KL',
            id: 'sample-init-booking',
            movie: 'Kalki 2898 AD',
            seats: 'C7, C8, D7, D8',
            theatre: 'PVR ICON: Phoenix Palladium, Lower Parel',
            date: dateStr,
            time: primaryShow.time
          }),
          paymentMethod: 'Instant UPI (Google Pay)'
        }
      });

      // Link payment record
      await prisma.payment.create({
        data: {
          bookingId: sampleBooking.id,
          provider: 'RAZORPAY',
          orderId: 'order_rzp_mock_init_849204',
          paymentId: 'pay_rzp_mock_init_success',
          signature: 'hmac_sha256_mock_verified_signature',
          amount: 1543.60,
          currency: 'INR',
          status: 'SUCCESS'
        }
      });

      // Create SeatReservation records for these booked seats
      for (const seat of bookedSeats) {
        await prisma.seatReservation.create({
          data: {
            showtimeId: primaryShow.id,
            seatId: seat.id,
            status: 'BOOKED',
            bookingId: sampleBooking.id
          }
        });
      }
    }
  }

  console.log('\n✅ Comprehensive CineBook Database Seeding Complete!');
  console.log(`- 3 Users (${customer.email}, ${staff.email}, ${admin.email})`);
  console.log(`- ${createdMovies.length} Popular Movies`);
  console.log(`- 4 Multiplex Theatres (${venuesData.map(v => v.chain).join(', ')})`);
  console.log(`- ${allScreens.length} Screens with 128 seats each (Recliner, Prime, Executive)`);
  console.log(`- ${createdShowtimes.length} Scheduled Showtimes with live reservation states`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
