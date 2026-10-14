import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import cinemaRoutes from './routes/cinemas.js';
import showRoutes from './routes/shows.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import couponRoutes from './routes/coupons.js';
import paymentFlowRoutes from './routes/paymentFlow.js';
import seatLockRoutes from './routes/seatLocks.js';
import ticketValidationRoutes from './routes/ticketValidation.js';
import { setSocketIO } from './services/seatReservationService.js';

const app = express();
const httpServer = http.createServer(app);

// Setup Socket.io for Real-time seat reservation broadcasts
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setSocketIO(io);

io.on('connection', (socket) => {
  // Join a specific showtime auditorium room
  socket.on('join:showtime', (showtimeId: string) => {
    if (showtimeId) {
      socket.join(`showtime:${showtimeId}`);
    }
  });

  // Leave showtime auditorium room
  socket.on('leave:showtime', (showtimeId: string) => {
    if (showtimeId) {
      socket.leave(`showtime:${showtimeId}`);
    }
  });

  // Client requests sync
  socket.on('request:sync', (showtimeId: string) => {
    if (showtimeId) {
      socket.emit('seats:sync_requested', { showtimeId, timestamp: Date.now() });
    }
  });
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev server and production origins
  credentials: true
}));
app.use(express.json());

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    ok: true,
    service: 'CineBook Movie Ticket Booking API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/showtimes', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);

// Concurrency & Seat Locking Routes (/api/seats/lock & /api/seats/unlock)
app.use('/api/seats', seatLockRoutes);
app.use('/api/seat-locks', seatLockRoutes);

// Payment Gateway & Webhook Routes (/api/payment/create-order & /api/payment/verify-webhook)
app.use('/api/payment', paymentFlowRoutes);
app.use('/api/payments', paymentFlowRoutes); // support plural alias

// M-Ticket Scanner Verification Route (/api/tickets/verify)
app.use('/api/tickets', ticketValidationRoutes);

// Fallback 404 for unknown api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Start Server with HTTP & WebSockets
httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🎬 CineBook API & Socket.io Server running on port ${PORT}`);
  console.log(`✨ Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ WebSocket connection ready for real-time seat lock broadcasts`);
});

export { app, httpServer, io };
export default app;
// Reload trigger for Supabase DATABASE_URL activation

