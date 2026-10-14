
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  passwordHash: 'passwordHash',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MovieScalarFieldEnum = {
  id: 'id',
  title: 'title',
  tagline: 'tagline',
  synopsis: 'synopsis',
  posterUrl: 'posterUrl',
  backdropUrl: 'backdropUrl',
  originalLanguage: 'originalLanguage',
  durationMinutes: 'durationMinutes',
  rating: 'rating',
  votesCount: 'votesCount',
  ageRating: 'ageRating',
  releaseDate: 'releaseDate',
  status: 'status',
  director: 'director',
  formats: 'formats',
  featured: 'featured',
  createdAt: 'createdAt',
  genre: 'genre',
  languages: 'languages'
};

exports.Prisma.TheatreScalarFieldEnum = {
  id: 'id',
  name: 'name',
  city: 'city',
  address: 'address',
  facilities: 'facilities',
  distance: 'distance',
  timezone: 'timezone'
};

exports.Prisma.ScreenScalarFieldEnum = {
  id: 'id',
  theatreId: 'theatreId',
  name: 'name',
  screenType: 'screenType'
};

exports.Prisma.SeatScalarFieldEnum = {
  id: 'id',
  screenId: 'screenId',
  row: 'row',
  number: 'number',
  seatNumber: 'seatNumber',
  tier: 'tier',
  basePrice: 'basePrice'
};

exports.Prisma.ShowtimeScalarFieldEnum = {
  id: 'id',
  cinemaId: 'cinemaId',
  screenId: 'screenId',
  movieId: 'movieId',
  date: 'date',
  time: 'time',
  format: 'format',
  hallName: 'hallName',
  language: 'language',
  priceMultiplier: 'priceMultiplier',
  createdAt: 'createdAt',
  hall: 'hall'
};

exports.Prisma.SeatReservationScalarFieldEnum = {
  id: 'id',
  showtimeId: 'showtimeId',
  seatId: 'seatId',
  status: 'status',
  heldBy: 'heldBy',
  heldExpiresAt: 'heldExpiresAt',
  bookingId: 'bookingId',
  createdAt: 'createdAt'
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  showtimeId: 'showtimeId',
  customerName: 'customerName',
  customerEmail: 'customerEmail',
  customerPhone: 'customerPhone',
  subtotal: 'subtotal',
  convenienceFee: 'convenienceFee',
  tax: 'tax',
  totalAmount: 'totalAmount',
  paymentMethod: 'paymentMethod',
  status: 'status',
  refundStatus: 'refundStatus',
  bookedAt: 'bookedAt',
  cancelledAt: 'cancelledAt',
  refundAmount: 'refundAmount',
  cancellationFee: 'cancellationFee',
  refundId: 'refundId',
  bookingRef: 'bookingRef'
};

exports.Prisma.BookingSeatScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  showtimeId: 'showtimeId',
  seatId: 'seatId',
  seatRow: 'seatRow',
  seatNumber: 'seatNumber',
  tier: 'tier',
  price: 'price'
};

exports.Prisma.BookingAddonScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  addonId: 'addonId',
  name: 'name',
  price: 'price',
  quantity: 'quantity'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  provider: 'provider',
  orderId: 'orderId',
  paymentId: 'paymentId',
  signature: 'signature',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  refundId: 'refundId',
  refundAmount: 'refundAmount',
  createdAt: 'createdAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  movieId: 'movieId',
  userName: 'userName',
  userEmail: 'userEmail',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.MovieCastScalarFieldEnum = {
  id: 'id',
  movieId: 'movieId',
  name: 'name',
  role: 'role',
  avatar: 'avatar'
};

exports.Prisma.CancellationAuditLogScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  bookingRef: 'bookingRef',
  action: 'action',
  actorEmail: 'actorEmail',
  previousStatus: 'previousStatus',
  newStatus: 'newStatus',
  refundStatus: 'refundStatus',
  refundAmount: 'refundAmount',
  cancellationFee: 'cancellationFee',
  refundId: 'refundId',
  failureReason: 'failureReason',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  Movie: 'Movie',
  Theatre: 'Theatre',
  Screen: 'Screen',
  Seat: 'Seat',
  Showtime: 'Showtime',
  SeatReservation: 'SeatReservation',
  Booking: 'Booking',
  BookingSeat: 'BookingSeat',
  BookingAddon: 'BookingAddon',
  Payment: 'Payment',
  Review: 'Review',
  MovieCast: 'MovieCast',
  CancellationAuditLog: 'CancellationAuditLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
