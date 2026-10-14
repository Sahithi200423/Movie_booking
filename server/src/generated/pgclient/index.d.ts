
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * User accounts (Customer, Admin, Staff)
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Movie
 * Movie catalogue metadata
 */
export type Movie = $Result.DefaultSelection<Prisma.$MoviePayload>
/**
 * Model Theatre
 * Multiplex venue / Theatre (Maps to Supabase cinemas table)
 */
export type Theatre = $Result.DefaultSelection<Prisma.$TheatrePayload>
/**
 * Model Screen
 * Auditorium screen within a theatre
 */
export type Screen = $Result.DefaultSelection<Prisma.$ScreenPayload>
/**
 * Model Seat
 * Physical seat in an auditorium screen
 */
export type Seat = $Result.DefaultSelection<Prisma.$SeatPayload>
/**
 * Model Showtime
 * Screening instance of a movie in a screen
 */
export type Showtime = $Result.DefaultSelection<Prisma.$ShowtimePayload>
/**
 * Model SeatReservation
 * Real-time seat concurrency lock & booking state
 */
export type SeatReservation = $Result.DefaultSelection<Prisma.$SeatReservationPayload>
/**
 * Model Booking
 * Customer ticket booking record
 */
export type Booking = $Result.DefaultSelection<Prisma.$BookingPayload>
/**
 * Model BookingSeat
 * Reserved seats for a booking
 */
export type BookingSeat = $Result.DefaultSelection<Prisma.$BookingSeatPayload>
/**
 * Model BookingAddon
 * Food and snack addons for a booking
 */
export type BookingAddon = $Result.DefaultSelection<Prisma.$BookingAddonPayload>
/**
 * Model Payment
 * Financial transaction record with Razorpay / Gateway
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model Review
 * Audience movie reviews & ratings
 */
export type Review = $Result.DefaultSelection<Prisma.$ReviewPayload>
/**
 * Model MovieCast
 * Movie cast members
 */
export type MovieCast = $Result.DefaultSelection<Prisma.$MovieCastPayload>
/**
 * Model CancellationAuditLog
 * Cancellation and refund audit logs
 */
export type CancellationAuditLog = $Result.DefaultSelection<Prisma.$CancellationAuditLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.movie`: Exposes CRUD operations for the **Movie** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Movies
    * const movies = await prisma.movie.findMany()
    * ```
    */
  get movie(): Prisma.MovieDelegate<ExtArgs>;

  /**
   * `prisma.theatre`: Exposes CRUD operations for the **Theatre** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Theatres
    * const theatres = await prisma.theatre.findMany()
    * ```
    */
  get theatre(): Prisma.TheatreDelegate<ExtArgs>;

  /**
   * `prisma.screen`: Exposes CRUD operations for the **Screen** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Screens
    * const screens = await prisma.screen.findMany()
    * ```
    */
  get screen(): Prisma.ScreenDelegate<ExtArgs>;

  /**
   * `prisma.seat`: Exposes CRUD operations for the **Seat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Seats
    * const seats = await prisma.seat.findMany()
    * ```
    */
  get seat(): Prisma.SeatDelegate<ExtArgs>;

  /**
   * `prisma.showtime`: Exposes CRUD operations for the **Showtime** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Showtimes
    * const showtimes = await prisma.showtime.findMany()
    * ```
    */
  get showtime(): Prisma.ShowtimeDelegate<ExtArgs>;

  /**
   * `prisma.seatReservation`: Exposes CRUD operations for the **SeatReservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SeatReservations
    * const seatReservations = await prisma.seatReservation.findMany()
    * ```
    */
  get seatReservation(): Prisma.SeatReservationDelegate<ExtArgs>;

  /**
   * `prisma.booking`: Exposes CRUD operations for the **Booking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookings
    * const bookings = await prisma.booking.findMany()
    * ```
    */
  get booking(): Prisma.BookingDelegate<ExtArgs>;

  /**
   * `prisma.bookingSeat`: Exposes CRUD operations for the **BookingSeat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookingSeats
    * const bookingSeats = await prisma.bookingSeat.findMany()
    * ```
    */
  get bookingSeat(): Prisma.BookingSeatDelegate<ExtArgs>;

  /**
   * `prisma.bookingAddon`: Exposes CRUD operations for the **BookingAddon** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookingAddons
    * const bookingAddons = await prisma.bookingAddon.findMany()
    * ```
    */
  get bookingAddon(): Prisma.BookingAddonDelegate<ExtArgs>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs>;

  /**
   * `prisma.review`: Exposes CRUD operations for the **Review** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reviews
    * const reviews = await prisma.review.findMany()
    * ```
    */
  get review(): Prisma.ReviewDelegate<ExtArgs>;

  /**
   * `prisma.movieCast`: Exposes CRUD operations for the **MovieCast** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MovieCasts
    * const movieCasts = await prisma.movieCast.findMany()
    * ```
    */
  get movieCast(): Prisma.MovieCastDelegate<ExtArgs>;

  /**
   * `prisma.cancellationAuditLog`: Exposes CRUD operations for the **CancellationAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CancellationAuditLogs
    * const cancellationAuditLogs = await prisma.cancellationAuditLog.findMany()
    * ```
    */
  get cancellationAuditLog(): Prisma.CancellationAuditLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "movie" | "theatre" | "screen" | "seat" | "showtime" | "seatReservation" | "booking" | "bookingSeat" | "bookingAddon" | "payment" | "review" | "movieCast" | "cancellationAuditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Movie: {
        payload: Prisma.$MoviePayload<ExtArgs>
        fields: Prisma.MovieFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MovieFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MovieFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload>
          }
          findFirst: {
            args: Prisma.MovieFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MovieFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload>
          }
          findMany: {
            args: Prisma.MovieFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload>[]
          }
          create: {
            args: Prisma.MovieCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload>
          }
          createMany: {
            args: Prisma.MovieCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MovieCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload>[]
          }
          delete: {
            args: Prisma.MovieDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload>
          }
          update: {
            args: Prisma.MovieUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload>
          }
          deleteMany: {
            args: Prisma.MovieDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MovieUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MovieUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoviePayload>
          }
          aggregate: {
            args: Prisma.MovieAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMovie>
          }
          groupBy: {
            args: Prisma.MovieGroupByArgs<ExtArgs>
            result: $Utils.Optional<MovieGroupByOutputType>[]
          }
          count: {
            args: Prisma.MovieCountArgs<ExtArgs>
            result: $Utils.Optional<MovieCountAggregateOutputType> | number
          }
        }
      }
      Theatre: {
        payload: Prisma.$TheatrePayload<ExtArgs>
        fields: Prisma.TheatreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TheatreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TheatreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload>
          }
          findFirst: {
            args: Prisma.TheatreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TheatreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload>
          }
          findMany: {
            args: Prisma.TheatreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload>[]
          }
          create: {
            args: Prisma.TheatreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload>
          }
          createMany: {
            args: Prisma.TheatreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TheatreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload>[]
          }
          delete: {
            args: Prisma.TheatreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload>
          }
          update: {
            args: Prisma.TheatreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload>
          }
          deleteMany: {
            args: Prisma.TheatreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TheatreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TheatreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TheatrePayload>
          }
          aggregate: {
            args: Prisma.TheatreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTheatre>
          }
          groupBy: {
            args: Prisma.TheatreGroupByArgs<ExtArgs>
            result: $Utils.Optional<TheatreGroupByOutputType>[]
          }
          count: {
            args: Prisma.TheatreCountArgs<ExtArgs>
            result: $Utils.Optional<TheatreCountAggregateOutputType> | number
          }
        }
      }
      Screen: {
        payload: Prisma.$ScreenPayload<ExtArgs>
        fields: Prisma.ScreenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScreenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScreenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload>
          }
          findFirst: {
            args: Prisma.ScreenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScreenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload>
          }
          findMany: {
            args: Prisma.ScreenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload>[]
          }
          create: {
            args: Prisma.ScreenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload>
          }
          createMany: {
            args: Prisma.ScreenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScreenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload>[]
          }
          delete: {
            args: Prisma.ScreenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload>
          }
          update: {
            args: Prisma.ScreenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload>
          }
          deleteMany: {
            args: Prisma.ScreenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScreenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ScreenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenPayload>
          }
          aggregate: {
            args: Prisma.ScreenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScreen>
          }
          groupBy: {
            args: Prisma.ScreenGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScreenGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScreenCountArgs<ExtArgs>
            result: $Utils.Optional<ScreenCountAggregateOutputType> | number
          }
        }
      }
      Seat: {
        payload: Prisma.$SeatPayload<ExtArgs>
        fields: Prisma.SeatFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeatFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeatFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload>
          }
          findFirst: {
            args: Prisma.SeatFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeatFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload>
          }
          findMany: {
            args: Prisma.SeatFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload>[]
          }
          create: {
            args: Prisma.SeatCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload>
          }
          createMany: {
            args: Prisma.SeatCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SeatCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload>[]
          }
          delete: {
            args: Prisma.SeatDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload>
          }
          update: {
            args: Prisma.SeatUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload>
          }
          deleteMany: {
            args: Prisma.SeatDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeatUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeatUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatPayload>
          }
          aggregate: {
            args: Prisma.SeatAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeat>
          }
          groupBy: {
            args: Prisma.SeatGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeatGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeatCountArgs<ExtArgs>
            result: $Utils.Optional<SeatCountAggregateOutputType> | number
          }
        }
      }
      Showtime: {
        payload: Prisma.$ShowtimePayload<ExtArgs>
        fields: Prisma.ShowtimeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShowtimeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShowtimeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload>
          }
          findFirst: {
            args: Prisma.ShowtimeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShowtimeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload>
          }
          findMany: {
            args: Prisma.ShowtimeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload>[]
          }
          create: {
            args: Prisma.ShowtimeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload>
          }
          createMany: {
            args: Prisma.ShowtimeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShowtimeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload>[]
          }
          delete: {
            args: Prisma.ShowtimeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload>
          }
          update: {
            args: Prisma.ShowtimeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload>
          }
          deleteMany: {
            args: Prisma.ShowtimeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShowtimeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ShowtimeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShowtimePayload>
          }
          aggregate: {
            args: Prisma.ShowtimeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShowtime>
          }
          groupBy: {
            args: Prisma.ShowtimeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShowtimeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShowtimeCountArgs<ExtArgs>
            result: $Utils.Optional<ShowtimeCountAggregateOutputType> | number
          }
        }
      }
      SeatReservation: {
        payload: Prisma.$SeatReservationPayload<ExtArgs>
        fields: Prisma.SeatReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeatReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeatReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload>
          }
          findFirst: {
            args: Prisma.SeatReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeatReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload>
          }
          findMany: {
            args: Prisma.SeatReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload>[]
          }
          create: {
            args: Prisma.SeatReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload>
          }
          createMany: {
            args: Prisma.SeatReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SeatReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload>[]
          }
          delete: {
            args: Prisma.SeatReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload>
          }
          update: {
            args: Prisma.SeatReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload>
          }
          deleteMany: {
            args: Prisma.SeatReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeatReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeatReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeatReservationPayload>
          }
          aggregate: {
            args: Prisma.SeatReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeatReservation>
          }
          groupBy: {
            args: Prisma.SeatReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeatReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeatReservationCountArgs<ExtArgs>
            result: $Utils.Optional<SeatReservationCountAggregateOutputType> | number
          }
        }
      }
      Booking: {
        payload: Prisma.$BookingPayload<ExtArgs>
        fields: Prisma.BookingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findFirst: {
            args: Prisma.BookingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findMany: {
            args: Prisma.BookingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          create: {
            args: Prisma.BookingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          createMany: {
            args: Prisma.BookingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          delete: {
            args: Prisma.BookingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          update: {
            args: Prisma.BookingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          deleteMany: {
            args: Prisma.BookingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BookingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          aggregate: {
            args: Prisma.BookingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBooking>
          }
          groupBy: {
            args: Prisma.BookingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingCountArgs<ExtArgs>
            result: $Utils.Optional<BookingCountAggregateOutputType> | number
          }
        }
      }
      BookingSeat: {
        payload: Prisma.$BookingSeatPayload<ExtArgs>
        fields: Prisma.BookingSeatFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingSeatFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingSeatFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload>
          }
          findFirst: {
            args: Prisma.BookingSeatFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingSeatFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload>
          }
          findMany: {
            args: Prisma.BookingSeatFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload>[]
          }
          create: {
            args: Prisma.BookingSeatCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload>
          }
          createMany: {
            args: Prisma.BookingSeatCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingSeatCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload>[]
          }
          delete: {
            args: Prisma.BookingSeatDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload>
          }
          update: {
            args: Prisma.BookingSeatUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload>
          }
          deleteMany: {
            args: Prisma.BookingSeatDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingSeatUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BookingSeatUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingSeatPayload>
          }
          aggregate: {
            args: Prisma.BookingSeatAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookingSeat>
          }
          groupBy: {
            args: Prisma.BookingSeatGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingSeatGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingSeatCountArgs<ExtArgs>
            result: $Utils.Optional<BookingSeatCountAggregateOutputType> | number
          }
        }
      }
      BookingAddon: {
        payload: Prisma.$BookingAddonPayload<ExtArgs>
        fields: Prisma.BookingAddonFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingAddonFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingAddonFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload>
          }
          findFirst: {
            args: Prisma.BookingAddonFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingAddonFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload>
          }
          findMany: {
            args: Prisma.BookingAddonFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload>[]
          }
          create: {
            args: Prisma.BookingAddonCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload>
          }
          createMany: {
            args: Prisma.BookingAddonCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingAddonCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload>[]
          }
          delete: {
            args: Prisma.BookingAddonDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload>
          }
          update: {
            args: Prisma.BookingAddonUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload>
          }
          deleteMany: {
            args: Prisma.BookingAddonDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingAddonUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BookingAddonUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingAddonPayload>
          }
          aggregate: {
            args: Prisma.BookingAddonAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookingAddon>
          }
          groupBy: {
            args: Prisma.BookingAddonGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingAddonGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingAddonCountArgs<ExtArgs>
            result: $Utils.Optional<BookingAddonCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Review: {
        payload: Prisma.$ReviewPayload<ExtArgs>
        fields: Prisma.ReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findFirst: {
            args: Prisma.ReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findMany: {
            args: Prisma.ReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          create: {
            args: Prisma.ReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          createMany: {
            args: Prisma.ReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          delete: {
            args: Prisma.ReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          update: {
            args: Prisma.ReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          deleteMany: {
            args: Prisma.ReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          aggregate: {
            args: Prisma.ReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReview>
          }
          groupBy: {
            args: Prisma.ReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewCountAggregateOutputType> | number
          }
        }
      }
      MovieCast: {
        payload: Prisma.$MovieCastPayload<ExtArgs>
        fields: Prisma.MovieCastFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MovieCastFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MovieCastFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload>
          }
          findFirst: {
            args: Prisma.MovieCastFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MovieCastFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload>
          }
          findMany: {
            args: Prisma.MovieCastFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload>[]
          }
          create: {
            args: Prisma.MovieCastCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload>
          }
          createMany: {
            args: Prisma.MovieCastCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MovieCastCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload>[]
          }
          delete: {
            args: Prisma.MovieCastDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload>
          }
          update: {
            args: Prisma.MovieCastUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload>
          }
          deleteMany: {
            args: Prisma.MovieCastDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MovieCastUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MovieCastUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovieCastPayload>
          }
          aggregate: {
            args: Prisma.MovieCastAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMovieCast>
          }
          groupBy: {
            args: Prisma.MovieCastGroupByArgs<ExtArgs>
            result: $Utils.Optional<MovieCastGroupByOutputType>[]
          }
          count: {
            args: Prisma.MovieCastCountArgs<ExtArgs>
            result: $Utils.Optional<MovieCastCountAggregateOutputType> | number
          }
        }
      }
      CancellationAuditLog: {
        payload: Prisma.$CancellationAuditLogPayload<ExtArgs>
        fields: Prisma.CancellationAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CancellationAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CancellationAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload>
          }
          findFirst: {
            args: Prisma.CancellationAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CancellationAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload>
          }
          findMany: {
            args: Prisma.CancellationAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload>[]
          }
          create: {
            args: Prisma.CancellationAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload>
          }
          createMany: {
            args: Prisma.CancellationAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CancellationAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload>[]
          }
          delete: {
            args: Prisma.CancellationAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload>
          }
          update: {
            args: Prisma.CancellationAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.CancellationAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CancellationAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CancellationAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancellationAuditLogPayload>
          }
          aggregate: {
            args: Prisma.CancellationAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCancellationAuditLog>
          }
          groupBy: {
            args: Prisma.CancellationAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<CancellationAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.CancellationAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<CancellationAuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    bookings: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | UserCountOutputTypeCountBookingsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }


  /**
   * Count Type MovieCountOutputType
   */

  export type MovieCountOutputType = {
    showtimes: number
    reviews: number
    cast: number
  }

  export type MovieCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    showtimes?: boolean | MovieCountOutputTypeCountShowtimesArgs
    reviews?: boolean | MovieCountOutputTypeCountReviewsArgs
    cast?: boolean | MovieCountOutputTypeCountCastArgs
  }

  // Custom InputTypes
  /**
   * MovieCountOutputType without action
   */
  export type MovieCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCountOutputType
     */
    select?: MovieCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MovieCountOutputType without action
   */
  export type MovieCountOutputTypeCountShowtimesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShowtimeWhereInput
  }

  /**
   * MovieCountOutputType without action
   */
  export type MovieCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
  }

  /**
   * MovieCountOutputType without action
   */
  export type MovieCountOutputTypeCountCastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovieCastWhereInput
  }


  /**
   * Count Type TheatreCountOutputType
   */

  export type TheatreCountOutputType = {
    screens: number
    showtimes: number
  }

  export type TheatreCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    screens?: boolean | TheatreCountOutputTypeCountScreensArgs
    showtimes?: boolean | TheatreCountOutputTypeCountShowtimesArgs
  }

  // Custom InputTypes
  /**
   * TheatreCountOutputType without action
   */
  export type TheatreCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TheatreCountOutputType
     */
    select?: TheatreCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TheatreCountOutputType without action
   */
  export type TheatreCountOutputTypeCountScreensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScreenWhereInput
  }

  /**
   * TheatreCountOutputType without action
   */
  export type TheatreCountOutputTypeCountShowtimesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShowtimeWhereInput
  }


  /**
   * Count Type ScreenCountOutputType
   */

  export type ScreenCountOutputType = {
    seats: number
    showtimes: number
  }

  export type ScreenCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seats?: boolean | ScreenCountOutputTypeCountSeatsArgs
    showtimes?: boolean | ScreenCountOutputTypeCountShowtimesArgs
  }

  // Custom InputTypes
  /**
   * ScreenCountOutputType without action
   */
  export type ScreenCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScreenCountOutputType
     */
    select?: ScreenCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ScreenCountOutputType without action
   */
  export type ScreenCountOutputTypeCountSeatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeatWhereInput
  }

  /**
   * ScreenCountOutputType without action
   */
  export type ScreenCountOutputTypeCountShowtimesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShowtimeWhereInput
  }


  /**
   * Count Type SeatCountOutputType
   */

  export type SeatCountOutputType = {
    reservations: number
  }

  export type SeatCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | SeatCountOutputTypeCountReservationsArgs
  }

  // Custom InputTypes
  /**
   * SeatCountOutputType without action
   */
  export type SeatCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatCountOutputType
     */
    select?: SeatCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SeatCountOutputType without action
   */
  export type SeatCountOutputTypeCountReservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeatReservationWhereInput
  }


  /**
   * Count Type ShowtimeCountOutputType
   */

  export type ShowtimeCountOutputType = {
    reservations: number
    bookings: number
  }

  export type ShowtimeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | ShowtimeCountOutputTypeCountReservationsArgs
    bookings?: boolean | ShowtimeCountOutputTypeCountBookingsArgs
  }

  // Custom InputTypes
  /**
   * ShowtimeCountOutputType without action
   */
  export type ShowtimeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShowtimeCountOutputType
     */
    select?: ShowtimeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ShowtimeCountOutputType without action
   */
  export type ShowtimeCountOutputTypeCountReservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeatReservationWhereInput
  }

  /**
   * ShowtimeCountOutputType without action
   */
  export type ShowtimeCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }


  /**
   * Count Type BookingCountOutputType
   */

  export type BookingCountOutputType = {
    seats: number
    addons: number
    auditLogs: number
  }

  export type BookingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seats?: boolean | BookingCountOutputTypeCountSeatsArgs
    addons?: boolean | BookingCountOutputTypeCountAddonsArgs
    auditLogs?: boolean | BookingCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingCountOutputType
     */
    select?: BookingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeCountSeatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingSeatWhereInput
  }

  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeCountAddonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingAddonWhereInput
  }

  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CancellationAuditLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    passwordHash: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    phone: string | null
    passwordHash: string | null
    role: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bookings?: boolean | User$bookingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | User$bookingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      bookings: Prisma.$BookingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      phone: string | null
      passwordHash: string | null
      role: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookings<T extends User$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, User$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.bookings
   */
  export type User$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Movie
   */

  export type AggregateMovie = {
    _count: MovieCountAggregateOutputType | null
    _avg: MovieAvgAggregateOutputType | null
    _sum: MovieSumAggregateOutputType | null
    _min: MovieMinAggregateOutputType | null
    _max: MovieMaxAggregateOutputType | null
  }

  export type MovieAvgAggregateOutputType = {
    durationMinutes: number | null
    rating: Decimal | null
  }

  export type MovieSumAggregateOutputType = {
    durationMinutes: number | null
    rating: Decimal | null
  }

  export type MovieMinAggregateOutputType = {
    id: string | null
    title: string | null
    tagline: string | null
    synopsis: string | null
    posterUrl: string | null
    backdropUrl: string | null
    originalLanguage: string | null
    durationMinutes: number | null
    rating: Decimal | null
    votesCount: string | null
    ageRating: string | null
    releaseDate: string | null
    status: string | null
    director: string | null
    featured: boolean | null
    createdAt: Date | null
  }

  export type MovieMaxAggregateOutputType = {
    id: string | null
    title: string | null
    tagline: string | null
    synopsis: string | null
    posterUrl: string | null
    backdropUrl: string | null
    originalLanguage: string | null
    durationMinutes: number | null
    rating: Decimal | null
    votesCount: string | null
    ageRating: string | null
    releaseDate: string | null
    status: string | null
    director: string | null
    featured: boolean | null
    createdAt: Date | null
  }

  export type MovieCountAggregateOutputType = {
    id: number
    title: number
    tagline: number
    synopsis: number
    posterUrl: number
    backdropUrl: number
    originalLanguage: number
    durationMinutes: number
    rating: number
    votesCount: number
    ageRating: number
    releaseDate: number
    status: number
    director: number
    formats: number
    featured: number
    createdAt: number
    genre: number
    languages: number
    _all: number
  }


  export type MovieAvgAggregateInputType = {
    durationMinutes?: true
    rating?: true
  }

  export type MovieSumAggregateInputType = {
    durationMinutes?: true
    rating?: true
  }

  export type MovieMinAggregateInputType = {
    id?: true
    title?: true
    tagline?: true
    synopsis?: true
    posterUrl?: true
    backdropUrl?: true
    originalLanguage?: true
    durationMinutes?: true
    rating?: true
    votesCount?: true
    ageRating?: true
    releaseDate?: true
    status?: true
    director?: true
    featured?: true
    createdAt?: true
  }

  export type MovieMaxAggregateInputType = {
    id?: true
    title?: true
    tagline?: true
    synopsis?: true
    posterUrl?: true
    backdropUrl?: true
    originalLanguage?: true
    durationMinutes?: true
    rating?: true
    votesCount?: true
    ageRating?: true
    releaseDate?: true
    status?: true
    director?: true
    featured?: true
    createdAt?: true
  }

  export type MovieCountAggregateInputType = {
    id?: true
    title?: true
    tagline?: true
    synopsis?: true
    posterUrl?: true
    backdropUrl?: true
    originalLanguage?: true
    durationMinutes?: true
    rating?: true
    votesCount?: true
    ageRating?: true
    releaseDate?: true
    status?: true
    director?: true
    formats?: true
    featured?: true
    createdAt?: true
    genre?: true
    languages?: true
    _all?: true
  }

  export type MovieAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Movie to aggregate.
     */
    where?: MovieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movies to fetch.
     */
    orderBy?: MovieOrderByWithRelationInput | MovieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MovieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Movies
    **/
    _count?: true | MovieCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MovieAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MovieSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MovieMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MovieMaxAggregateInputType
  }

  export type GetMovieAggregateType<T extends MovieAggregateArgs> = {
        [P in keyof T & keyof AggregateMovie]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMovie[P]>
      : GetScalarType<T[P], AggregateMovie[P]>
  }




  export type MovieGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovieWhereInput
    orderBy?: MovieOrderByWithAggregationInput | MovieOrderByWithAggregationInput[]
    by: MovieScalarFieldEnum[] | MovieScalarFieldEnum
    having?: MovieScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MovieCountAggregateInputType | true
    _avg?: MovieAvgAggregateInputType
    _sum?: MovieSumAggregateInputType
    _min?: MovieMinAggregateInputType
    _max?: MovieMaxAggregateInputType
  }

  export type MovieGroupByOutputType = {
    id: string
    title: string
    tagline: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage: string
    durationMinutes: number
    rating: Decimal
    votesCount: string
    ageRating: string
    releaseDate: string
    status: string
    director: string
    formats: string[]
    featured: boolean
    createdAt: Date
    genre: string[]
    languages: string[]
    _count: MovieCountAggregateOutputType | null
    _avg: MovieAvgAggregateOutputType | null
    _sum: MovieSumAggregateOutputType | null
    _min: MovieMinAggregateOutputType | null
    _max: MovieMaxAggregateOutputType | null
  }

  type GetMovieGroupByPayload<T extends MovieGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MovieGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MovieGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MovieGroupByOutputType[P]>
            : GetScalarType<T[P], MovieGroupByOutputType[P]>
        }
      >
    >


  export type MovieSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    tagline?: boolean
    synopsis?: boolean
    posterUrl?: boolean
    backdropUrl?: boolean
    originalLanguage?: boolean
    durationMinutes?: boolean
    rating?: boolean
    votesCount?: boolean
    ageRating?: boolean
    releaseDate?: boolean
    status?: boolean
    director?: boolean
    formats?: boolean
    featured?: boolean
    createdAt?: boolean
    genre?: boolean
    languages?: boolean
    showtimes?: boolean | Movie$showtimesArgs<ExtArgs>
    reviews?: boolean | Movie$reviewsArgs<ExtArgs>
    cast?: boolean | Movie$castArgs<ExtArgs>
    _count?: boolean | MovieCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movie"]>

  export type MovieSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    tagline?: boolean
    synopsis?: boolean
    posterUrl?: boolean
    backdropUrl?: boolean
    originalLanguage?: boolean
    durationMinutes?: boolean
    rating?: boolean
    votesCount?: boolean
    ageRating?: boolean
    releaseDate?: boolean
    status?: boolean
    director?: boolean
    formats?: boolean
    featured?: boolean
    createdAt?: boolean
    genre?: boolean
    languages?: boolean
  }, ExtArgs["result"]["movie"]>

  export type MovieSelectScalar = {
    id?: boolean
    title?: boolean
    tagline?: boolean
    synopsis?: boolean
    posterUrl?: boolean
    backdropUrl?: boolean
    originalLanguage?: boolean
    durationMinutes?: boolean
    rating?: boolean
    votesCount?: boolean
    ageRating?: boolean
    releaseDate?: boolean
    status?: boolean
    director?: boolean
    formats?: boolean
    featured?: boolean
    createdAt?: boolean
    genre?: boolean
    languages?: boolean
  }

  export type MovieInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    showtimes?: boolean | Movie$showtimesArgs<ExtArgs>
    reviews?: boolean | Movie$reviewsArgs<ExtArgs>
    cast?: boolean | Movie$castArgs<ExtArgs>
    _count?: boolean | MovieCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MovieIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MoviePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Movie"
    objects: {
      showtimes: Prisma.$ShowtimePayload<ExtArgs>[]
      reviews: Prisma.$ReviewPayload<ExtArgs>[]
      cast: Prisma.$MovieCastPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      tagline: string | null
      synopsis: string
      posterUrl: string
      backdropUrl: string
      originalLanguage: string
      durationMinutes: number
      rating: Prisma.Decimal
      votesCount: string
      ageRating: string
      releaseDate: string
      status: string
      director: string
      formats: string[]
      featured: boolean
      createdAt: Date
      genre: string[]
      languages: string[]
    }, ExtArgs["result"]["movie"]>
    composites: {}
  }

  type MovieGetPayload<S extends boolean | null | undefined | MovieDefaultArgs> = $Result.GetResult<Prisma.$MoviePayload, S>

  type MovieCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MovieFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MovieCountAggregateInputType | true
    }

  export interface MovieDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Movie'], meta: { name: 'Movie' } }
    /**
     * Find zero or one Movie that matches the filter.
     * @param {MovieFindUniqueArgs} args - Arguments to find a Movie
     * @example
     * // Get one Movie
     * const movie = await prisma.movie.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MovieFindUniqueArgs>(args: SelectSubset<T, MovieFindUniqueArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Movie that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MovieFindUniqueOrThrowArgs} args - Arguments to find a Movie
     * @example
     * // Get one Movie
     * const movie = await prisma.movie.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MovieFindUniqueOrThrowArgs>(args: SelectSubset<T, MovieFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Movie that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieFindFirstArgs} args - Arguments to find a Movie
     * @example
     * // Get one Movie
     * const movie = await prisma.movie.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MovieFindFirstArgs>(args?: SelectSubset<T, MovieFindFirstArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Movie that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieFindFirstOrThrowArgs} args - Arguments to find a Movie
     * @example
     * // Get one Movie
     * const movie = await prisma.movie.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MovieFindFirstOrThrowArgs>(args?: SelectSubset<T, MovieFindFirstOrThrowArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Movies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Movies
     * const movies = await prisma.movie.findMany()
     * 
     * // Get first 10 Movies
     * const movies = await prisma.movie.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const movieWithIdOnly = await prisma.movie.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MovieFindManyArgs>(args?: SelectSubset<T, MovieFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Movie.
     * @param {MovieCreateArgs} args - Arguments to create a Movie.
     * @example
     * // Create one Movie
     * const Movie = await prisma.movie.create({
     *   data: {
     *     // ... data to create a Movie
     *   }
     * })
     * 
     */
    create<T extends MovieCreateArgs>(args: SelectSubset<T, MovieCreateArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Movies.
     * @param {MovieCreateManyArgs} args - Arguments to create many Movies.
     * @example
     * // Create many Movies
     * const movie = await prisma.movie.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MovieCreateManyArgs>(args?: SelectSubset<T, MovieCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Movies and returns the data saved in the database.
     * @param {MovieCreateManyAndReturnArgs} args - Arguments to create many Movies.
     * @example
     * // Create many Movies
     * const movie = await prisma.movie.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Movies and only return the `id`
     * const movieWithIdOnly = await prisma.movie.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MovieCreateManyAndReturnArgs>(args?: SelectSubset<T, MovieCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Movie.
     * @param {MovieDeleteArgs} args - Arguments to delete one Movie.
     * @example
     * // Delete one Movie
     * const Movie = await prisma.movie.delete({
     *   where: {
     *     // ... filter to delete one Movie
     *   }
     * })
     * 
     */
    delete<T extends MovieDeleteArgs>(args: SelectSubset<T, MovieDeleteArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Movie.
     * @param {MovieUpdateArgs} args - Arguments to update one Movie.
     * @example
     * // Update one Movie
     * const movie = await prisma.movie.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MovieUpdateArgs>(args: SelectSubset<T, MovieUpdateArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Movies.
     * @param {MovieDeleteManyArgs} args - Arguments to filter Movies to delete.
     * @example
     * // Delete a few Movies
     * const { count } = await prisma.movie.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MovieDeleteManyArgs>(args?: SelectSubset<T, MovieDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Movies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Movies
     * const movie = await prisma.movie.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MovieUpdateManyArgs>(args: SelectSubset<T, MovieUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Movie.
     * @param {MovieUpsertArgs} args - Arguments to update or create a Movie.
     * @example
     * // Update or create a Movie
     * const movie = await prisma.movie.upsert({
     *   create: {
     *     // ... data to create a Movie
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Movie we want to update
     *   }
     * })
     */
    upsert<T extends MovieUpsertArgs>(args: SelectSubset<T, MovieUpsertArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Movies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieCountArgs} args - Arguments to filter Movies to count.
     * @example
     * // Count the number of Movies
     * const count = await prisma.movie.count({
     *   where: {
     *     // ... the filter for the Movies we want to count
     *   }
     * })
    **/
    count<T extends MovieCountArgs>(
      args?: Subset<T, MovieCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MovieCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Movie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MovieAggregateArgs>(args: Subset<T, MovieAggregateArgs>): Prisma.PrismaPromise<GetMovieAggregateType<T>>

    /**
     * Group by Movie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MovieGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MovieGroupByArgs['orderBy'] }
        : { orderBy?: MovieGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MovieGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMovieGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Movie model
   */
  readonly fields: MovieFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Movie.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MovieClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    showtimes<T extends Movie$showtimesArgs<ExtArgs> = {}>(args?: Subset<T, Movie$showtimesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findMany"> | Null>
    reviews<T extends Movie$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, Movie$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany"> | Null>
    cast<T extends Movie$castArgs<ExtArgs> = {}>(args?: Subset<T, Movie$castArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Movie model
   */ 
  interface MovieFieldRefs {
    readonly id: FieldRef<"Movie", 'String'>
    readonly title: FieldRef<"Movie", 'String'>
    readonly tagline: FieldRef<"Movie", 'String'>
    readonly synopsis: FieldRef<"Movie", 'String'>
    readonly posterUrl: FieldRef<"Movie", 'String'>
    readonly backdropUrl: FieldRef<"Movie", 'String'>
    readonly originalLanguage: FieldRef<"Movie", 'String'>
    readonly durationMinutes: FieldRef<"Movie", 'Int'>
    readonly rating: FieldRef<"Movie", 'Decimal'>
    readonly votesCount: FieldRef<"Movie", 'String'>
    readonly ageRating: FieldRef<"Movie", 'String'>
    readonly releaseDate: FieldRef<"Movie", 'String'>
    readonly status: FieldRef<"Movie", 'String'>
    readonly director: FieldRef<"Movie", 'String'>
    readonly formats: FieldRef<"Movie", 'String[]'>
    readonly featured: FieldRef<"Movie", 'Boolean'>
    readonly createdAt: FieldRef<"Movie", 'DateTime'>
    readonly genre: FieldRef<"Movie", 'String[]'>
    readonly languages: FieldRef<"Movie", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * Movie findUnique
   */
  export type MovieFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    /**
     * Filter, which Movie to fetch.
     */
    where: MovieWhereUniqueInput
  }

  /**
   * Movie findUniqueOrThrow
   */
  export type MovieFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    /**
     * Filter, which Movie to fetch.
     */
    where: MovieWhereUniqueInput
  }

  /**
   * Movie findFirst
   */
  export type MovieFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    /**
     * Filter, which Movie to fetch.
     */
    where?: MovieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movies to fetch.
     */
    orderBy?: MovieOrderByWithRelationInput | MovieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Movies.
     */
    cursor?: MovieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Movies.
     */
    distinct?: MovieScalarFieldEnum | MovieScalarFieldEnum[]
  }

  /**
   * Movie findFirstOrThrow
   */
  export type MovieFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    /**
     * Filter, which Movie to fetch.
     */
    where?: MovieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movies to fetch.
     */
    orderBy?: MovieOrderByWithRelationInput | MovieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Movies.
     */
    cursor?: MovieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Movies.
     */
    distinct?: MovieScalarFieldEnum | MovieScalarFieldEnum[]
  }

  /**
   * Movie findMany
   */
  export type MovieFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    /**
     * Filter, which Movies to fetch.
     */
    where?: MovieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movies to fetch.
     */
    orderBy?: MovieOrderByWithRelationInput | MovieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Movies.
     */
    cursor?: MovieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movies.
     */
    skip?: number
    distinct?: MovieScalarFieldEnum | MovieScalarFieldEnum[]
  }

  /**
   * Movie create
   */
  export type MovieCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    /**
     * The data needed to create a Movie.
     */
    data: XOR<MovieCreateInput, MovieUncheckedCreateInput>
  }

  /**
   * Movie createMany
   */
  export type MovieCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Movies.
     */
    data: MovieCreateManyInput | MovieCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Movie createManyAndReturn
   */
  export type MovieCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Movies.
     */
    data: MovieCreateManyInput | MovieCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Movie update
   */
  export type MovieUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    /**
     * The data needed to update a Movie.
     */
    data: XOR<MovieUpdateInput, MovieUncheckedUpdateInput>
    /**
     * Choose, which Movie to update.
     */
    where: MovieWhereUniqueInput
  }

  /**
   * Movie updateMany
   */
  export type MovieUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Movies.
     */
    data: XOR<MovieUpdateManyMutationInput, MovieUncheckedUpdateManyInput>
    /**
     * Filter which Movies to update
     */
    where?: MovieWhereInput
  }

  /**
   * Movie upsert
   */
  export type MovieUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    /**
     * The filter to search for the Movie to update in case it exists.
     */
    where: MovieWhereUniqueInput
    /**
     * In case the Movie found by the `where` argument doesn't exist, create a new Movie with this data.
     */
    create: XOR<MovieCreateInput, MovieUncheckedCreateInput>
    /**
     * In case the Movie was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MovieUpdateInput, MovieUncheckedUpdateInput>
  }

  /**
   * Movie delete
   */
  export type MovieDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    /**
     * Filter which Movie to delete.
     */
    where: MovieWhereUniqueInput
  }

  /**
   * Movie deleteMany
   */
  export type MovieDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Movies to delete
     */
    where?: MovieWhereInput
  }

  /**
   * Movie.showtimes
   */
  export type Movie$showtimesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    where?: ShowtimeWhereInput
    orderBy?: ShowtimeOrderByWithRelationInput | ShowtimeOrderByWithRelationInput[]
    cursor?: ShowtimeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShowtimeScalarFieldEnum | ShowtimeScalarFieldEnum[]
  }

  /**
   * Movie.reviews
   */
  export type Movie$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    cursor?: ReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Movie.cast
   */
  export type Movie$castArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    where?: MovieCastWhereInput
    orderBy?: MovieCastOrderByWithRelationInput | MovieCastOrderByWithRelationInput[]
    cursor?: MovieCastWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MovieCastScalarFieldEnum | MovieCastScalarFieldEnum[]
  }

  /**
   * Movie without action
   */
  export type MovieDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
  }


  /**
   * Model Theatre
   */

  export type AggregateTheatre = {
    _count: TheatreCountAggregateOutputType | null
    _min: TheatreMinAggregateOutputType | null
    _max: TheatreMaxAggregateOutputType | null
  }

  export type TheatreMinAggregateOutputType = {
    id: string | null
    name: string | null
    city: string | null
    address: string | null
    distance: string | null
    timezone: string | null
  }

  export type TheatreMaxAggregateOutputType = {
    id: string | null
    name: string | null
    city: string | null
    address: string | null
    distance: string | null
    timezone: string | null
  }

  export type TheatreCountAggregateOutputType = {
    id: number
    name: number
    city: number
    address: number
    facilities: number
    distance: number
    timezone: number
    _all: number
  }


  export type TheatreMinAggregateInputType = {
    id?: true
    name?: true
    city?: true
    address?: true
    distance?: true
    timezone?: true
  }

  export type TheatreMaxAggregateInputType = {
    id?: true
    name?: true
    city?: true
    address?: true
    distance?: true
    timezone?: true
  }

  export type TheatreCountAggregateInputType = {
    id?: true
    name?: true
    city?: true
    address?: true
    facilities?: true
    distance?: true
    timezone?: true
    _all?: true
  }

  export type TheatreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Theatre to aggregate.
     */
    where?: TheatreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Theatres to fetch.
     */
    orderBy?: TheatreOrderByWithRelationInput | TheatreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TheatreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Theatres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Theatres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Theatres
    **/
    _count?: true | TheatreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TheatreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TheatreMaxAggregateInputType
  }

  export type GetTheatreAggregateType<T extends TheatreAggregateArgs> = {
        [P in keyof T & keyof AggregateTheatre]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTheatre[P]>
      : GetScalarType<T[P], AggregateTheatre[P]>
  }




  export type TheatreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TheatreWhereInput
    orderBy?: TheatreOrderByWithAggregationInput | TheatreOrderByWithAggregationInput[]
    by: TheatreScalarFieldEnum[] | TheatreScalarFieldEnum
    having?: TheatreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TheatreCountAggregateInputType | true
    _min?: TheatreMinAggregateInputType
    _max?: TheatreMaxAggregateInputType
  }

  export type TheatreGroupByOutputType = {
    id: string
    name: string
    city: string
    address: string
    facilities: string[]
    distance: string
    timezone: string
    _count: TheatreCountAggregateOutputType | null
    _min: TheatreMinAggregateOutputType | null
    _max: TheatreMaxAggregateOutputType | null
  }

  type GetTheatreGroupByPayload<T extends TheatreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TheatreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TheatreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TheatreGroupByOutputType[P]>
            : GetScalarType<T[P], TheatreGroupByOutputType[P]>
        }
      >
    >


  export type TheatreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    address?: boolean
    facilities?: boolean
    distance?: boolean
    timezone?: boolean
    screens?: boolean | Theatre$screensArgs<ExtArgs>
    showtimes?: boolean | Theatre$showtimesArgs<ExtArgs>
    _count?: boolean | TheatreCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["theatre"]>

  export type TheatreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    address?: boolean
    facilities?: boolean
    distance?: boolean
    timezone?: boolean
  }, ExtArgs["result"]["theatre"]>

  export type TheatreSelectScalar = {
    id?: boolean
    name?: boolean
    city?: boolean
    address?: boolean
    facilities?: boolean
    distance?: boolean
    timezone?: boolean
  }

  export type TheatreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    screens?: boolean | Theatre$screensArgs<ExtArgs>
    showtimes?: boolean | Theatre$showtimesArgs<ExtArgs>
    _count?: boolean | TheatreCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TheatreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TheatrePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Theatre"
    objects: {
      screens: Prisma.$ScreenPayload<ExtArgs>[]
      showtimes: Prisma.$ShowtimePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      city: string
      address: string
      facilities: string[]
      distance: string
      timezone: string
    }, ExtArgs["result"]["theatre"]>
    composites: {}
  }

  type TheatreGetPayload<S extends boolean | null | undefined | TheatreDefaultArgs> = $Result.GetResult<Prisma.$TheatrePayload, S>

  type TheatreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TheatreFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TheatreCountAggregateInputType | true
    }

  export interface TheatreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Theatre'], meta: { name: 'Theatre' } }
    /**
     * Find zero or one Theatre that matches the filter.
     * @param {TheatreFindUniqueArgs} args - Arguments to find a Theatre
     * @example
     * // Get one Theatre
     * const theatre = await prisma.theatre.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TheatreFindUniqueArgs>(args: SelectSubset<T, TheatreFindUniqueArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Theatre that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TheatreFindUniqueOrThrowArgs} args - Arguments to find a Theatre
     * @example
     * // Get one Theatre
     * const theatre = await prisma.theatre.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TheatreFindUniqueOrThrowArgs>(args: SelectSubset<T, TheatreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Theatre that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TheatreFindFirstArgs} args - Arguments to find a Theatre
     * @example
     * // Get one Theatre
     * const theatre = await prisma.theatre.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TheatreFindFirstArgs>(args?: SelectSubset<T, TheatreFindFirstArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Theatre that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TheatreFindFirstOrThrowArgs} args - Arguments to find a Theatre
     * @example
     * // Get one Theatre
     * const theatre = await prisma.theatre.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TheatreFindFirstOrThrowArgs>(args?: SelectSubset<T, TheatreFindFirstOrThrowArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Theatres that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TheatreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Theatres
     * const theatres = await prisma.theatre.findMany()
     * 
     * // Get first 10 Theatres
     * const theatres = await prisma.theatre.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const theatreWithIdOnly = await prisma.theatre.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TheatreFindManyArgs>(args?: SelectSubset<T, TheatreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Theatre.
     * @param {TheatreCreateArgs} args - Arguments to create a Theatre.
     * @example
     * // Create one Theatre
     * const Theatre = await prisma.theatre.create({
     *   data: {
     *     // ... data to create a Theatre
     *   }
     * })
     * 
     */
    create<T extends TheatreCreateArgs>(args: SelectSubset<T, TheatreCreateArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Theatres.
     * @param {TheatreCreateManyArgs} args - Arguments to create many Theatres.
     * @example
     * // Create many Theatres
     * const theatre = await prisma.theatre.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TheatreCreateManyArgs>(args?: SelectSubset<T, TheatreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Theatres and returns the data saved in the database.
     * @param {TheatreCreateManyAndReturnArgs} args - Arguments to create many Theatres.
     * @example
     * // Create many Theatres
     * const theatre = await prisma.theatre.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Theatres and only return the `id`
     * const theatreWithIdOnly = await prisma.theatre.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TheatreCreateManyAndReturnArgs>(args?: SelectSubset<T, TheatreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Theatre.
     * @param {TheatreDeleteArgs} args - Arguments to delete one Theatre.
     * @example
     * // Delete one Theatre
     * const Theatre = await prisma.theatre.delete({
     *   where: {
     *     // ... filter to delete one Theatre
     *   }
     * })
     * 
     */
    delete<T extends TheatreDeleteArgs>(args: SelectSubset<T, TheatreDeleteArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Theatre.
     * @param {TheatreUpdateArgs} args - Arguments to update one Theatre.
     * @example
     * // Update one Theatre
     * const theatre = await prisma.theatre.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TheatreUpdateArgs>(args: SelectSubset<T, TheatreUpdateArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Theatres.
     * @param {TheatreDeleteManyArgs} args - Arguments to filter Theatres to delete.
     * @example
     * // Delete a few Theatres
     * const { count } = await prisma.theatre.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TheatreDeleteManyArgs>(args?: SelectSubset<T, TheatreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Theatres.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TheatreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Theatres
     * const theatre = await prisma.theatre.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TheatreUpdateManyArgs>(args: SelectSubset<T, TheatreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Theatre.
     * @param {TheatreUpsertArgs} args - Arguments to update or create a Theatre.
     * @example
     * // Update or create a Theatre
     * const theatre = await prisma.theatre.upsert({
     *   create: {
     *     // ... data to create a Theatre
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Theatre we want to update
     *   }
     * })
     */
    upsert<T extends TheatreUpsertArgs>(args: SelectSubset<T, TheatreUpsertArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Theatres.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TheatreCountArgs} args - Arguments to filter Theatres to count.
     * @example
     * // Count the number of Theatres
     * const count = await prisma.theatre.count({
     *   where: {
     *     // ... the filter for the Theatres we want to count
     *   }
     * })
    **/
    count<T extends TheatreCountArgs>(
      args?: Subset<T, TheatreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TheatreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Theatre.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TheatreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TheatreAggregateArgs>(args: Subset<T, TheatreAggregateArgs>): Prisma.PrismaPromise<GetTheatreAggregateType<T>>

    /**
     * Group by Theatre.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TheatreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TheatreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TheatreGroupByArgs['orderBy'] }
        : { orderBy?: TheatreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TheatreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTheatreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Theatre model
   */
  readonly fields: TheatreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Theatre.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TheatreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    screens<T extends Theatre$screensArgs<ExtArgs> = {}>(args?: Subset<T, Theatre$screensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "findMany"> | Null>
    showtimes<T extends Theatre$showtimesArgs<ExtArgs> = {}>(args?: Subset<T, Theatre$showtimesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Theatre model
   */ 
  interface TheatreFieldRefs {
    readonly id: FieldRef<"Theatre", 'String'>
    readonly name: FieldRef<"Theatre", 'String'>
    readonly city: FieldRef<"Theatre", 'String'>
    readonly address: FieldRef<"Theatre", 'String'>
    readonly facilities: FieldRef<"Theatre", 'String[]'>
    readonly distance: FieldRef<"Theatre", 'String'>
    readonly timezone: FieldRef<"Theatre", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Theatre findUnique
   */
  export type TheatreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    /**
     * Filter, which Theatre to fetch.
     */
    where: TheatreWhereUniqueInput
  }

  /**
   * Theatre findUniqueOrThrow
   */
  export type TheatreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    /**
     * Filter, which Theatre to fetch.
     */
    where: TheatreWhereUniqueInput
  }

  /**
   * Theatre findFirst
   */
  export type TheatreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    /**
     * Filter, which Theatre to fetch.
     */
    where?: TheatreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Theatres to fetch.
     */
    orderBy?: TheatreOrderByWithRelationInput | TheatreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Theatres.
     */
    cursor?: TheatreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Theatres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Theatres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Theatres.
     */
    distinct?: TheatreScalarFieldEnum | TheatreScalarFieldEnum[]
  }

  /**
   * Theatre findFirstOrThrow
   */
  export type TheatreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    /**
     * Filter, which Theatre to fetch.
     */
    where?: TheatreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Theatres to fetch.
     */
    orderBy?: TheatreOrderByWithRelationInput | TheatreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Theatres.
     */
    cursor?: TheatreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Theatres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Theatres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Theatres.
     */
    distinct?: TheatreScalarFieldEnum | TheatreScalarFieldEnum[]
  }

  /**
   * Theatre findMany
   */
  export type TheatreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    /**
     * Filter, which Theatres to fetch.
     */
    where?: TheatreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Theatres to fetch.
     */
    orderBy?: TheatreOrderByWithRelationInput | TheatreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Theatres.
     */
    cursor?: TheatreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Theatres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Theatres.
     */
    skip?: number
    distinct?: TheatreScalarFieldEnum | TheatreScalarFieldEnum[]
  }

  /**
   * Theatre create
   */
  export type TheatreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    /**
     * The data needed to create a Theatre.
     */
    data: XOR<TheatreCreateInput, TheatreUncheckedCreateInput>
  }

  /**
   * Theatre createMany
   */
  export type TheatreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Theatres.
     */
    data: TheatreCreateManyInput | TheatreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Theatre createManyAndReturn
   */
  export type TheatreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Theatres.
     */
    data: TheatreCreateManyInput | TheatreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Theatre update
   */
  export type TheatreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    /**
     * The data needed to update a Theatre.
     */
    data: XOR<TheatreUpdateInput, TheatreUncheckedUpdateInput>
    /**
     * Choose, which Theatre to update.
     */
    where: TheatreWhereUniqueInput
  }

  /**
   * Theatre updateMany
   */
  export type TheatreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Theatres.
     */
    data: XOR<TheatreUpdateManyMutationInput, TheatreUncheckedUpdateManyInput>
    /**
     * Filter which Theatres to update
     */
    where?: TheatreWhereInput
  }

  /**
   * Theatre upsert
   */
  export type TheatreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    /**
     * The filter to search for the Theatre to update in case it exists.
     */
    where: TheatreWhereUniqueInput
    /**
     * In case the Theatre found by the `where` argument doesn't exist, create a new Theatre with this data.
     */
    create: XOR<TheatreCreateInput, TheatreUncheckedCreateInput>
    /**
     * In case the Theatre was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TheatreUpdateInput, TheatreUncheckedUpdateInput>
  }

  /**
   * Theatre delete
   */
  export type TheatreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    /**
     * Filter which Theatre to delete.
     */
    where: TheatreWhereUniqueInput
  }

  /**
   * Theatre deleteMany
   */
  export type TheatreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Theatres to delete
     */
    where?: TheatreWhereInput
  }

  /**
   * Theatre.screens
   */
  export type Theatre$screensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    where?: ScreenWhereInput
    orderBy?: ScreenOrderByWithRelationInput | ScreenOrderByWithRelationInput[]
    cursor?: ScreenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScreenScalarFieldEnum | ScreenScalarFieldEnum[]
  }

  /**
   * Theatre.showtimes
   */
  export type Theatre$showtimesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    where?: ShowtimeWhereInput
    orderBy?: ShowtimeOrderByWithRelationInput | ShowtimeOrderByWithRelationInput[]
    cursor?: ShowtimeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShowtimeScalarFieldEnum | ShowtimeScalarFieldEnum[]
  }

  /**
   * Theatre without action
   */
  export type TheatreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
  }


  /**
   * Model Screen
   */

  export type AggregateScreen = {
    _count: ScreenCountAggregateOutputType | null
    _min: ScreenMinAggregateOutputType | null
    _max: ScreenMaxAggregateOutputType | null
  }

  export type ScreenMinAggregateOutputType = {
    id: string | null
    theatreId: string | null
    name: string | null
    screenType: string | null
  }

  export type ScreenMaxAggregateOutputType = {
    id: string | null
    theatreId: string | null
    name: string | null
    screenType: string | null
  }

  export type ScreenCountAggregateOutputType = {
    id: number
    theatreId: number
    name: number
    screenType: number
    _all: number
  }


  export type ScreenMinAggregateInputType = {
    id?: true
    theatreId?: true
    name?: true
    screenType?: true
  }

  export type ScreenMaxAggregateInputType = {
    id?: true
    theatreId?: true
    name?: true
    screenType?: true
  }

  export type ScreenCountAggregateInputType = {
    id?: true
    theatreId?: true
    name?: true
    screenType?: true
    _all?: true
  }

  export type ScreenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Screen to aggregate.
     */
    where?: ScreenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Screens to fetch.
     */
    orderBy?: ScreenOrderByWithRelationInput | ScreenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScreenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Screens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Screens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Screens
    **/
    _count?: true | ScreenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScreenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScreenMaxAggregateInputType
  }

  export type GetScreenAggregateType<T extends ScreenAggregateArgs> = {
        [P in keyof T & keyof AggregateScreen]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScreen[P]>
      : GetScalarType<T[P], AggregateScreen[P]>
  }




  export type ScreenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScreenWhereInput
    orderBy?: ScreenOrderByWithAggregationInput | ScreenOrderByWithAggregationInput[]
    by: ScreenScalarFieldEnum[] | ScreenScalarFieldEnum
    having?: ScreenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScreenCountAggregateInputType | true
    _min?: ScreenMinAggregateInputType
    _max?: ScreenMaxAggregateInputType
  }

  export type ScreenGroupByOutputType = {
    id: string
    theatreId: string | null
    name: string
    screenType: string
    _count: ScreenCountAggregateOutputType | null
    _min: ScreenMinAggregateOutputType | null
    _max: ScreenMaxAggregateOutputType | null
  }

  type GetScreenGroupByPayload<T extends ScreenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScreenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScreenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScreenGroupByOutputType[P]>
            : GetScalarType<T[P], ScreenGroupByOutputType[P]>
        }
      >
    >


  export type ScreenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    theatreId?: boolean
    name?: boolean
    screenType?: boolean
    theatre?: boolean | Screen$theatreArgs<ExtArgs>
    seats?: boolean | Screen$seatsArgs<ExtArgs>
    showtimes?: boolean | Screen$showtimesArgs<ExtArgs>
    _count?: boolean | ScreenCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["screen"]>

  export type ScreenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    theatreId?: boolean
    name?: boolean
    screenType?: boolean
    theatre?: boolean | Screen$theatreArgs<ExtArgs>
  }, ExtArgs["result"]["screen"]>

  export type ScreenSelectScalar = {
    id?: boolean
    theatreId?: boolean
    name?: boolean
    screenType?: boolean
  }

  export type ScreenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    theatre?: boolean | Screen$theatreArgs<ExtArgs>
    seats?: boolean | Screen$seatsArgs<ExtArgs>
    showtimes?: boolean | Screen$showtimesArgs<ExtArgs>
    _count?: boolean | ScreenCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ScreenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    theatre?: boolean | Screen$theatreArgs<ExtArgs>
  }

  export type $ScreenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Screen"
    objects: {
      theatre: Prisma.$TheatrePayload<ExtArgs> | null
      seats: Prisma.$SeatPayload<ExtArgs>[]
      showtimes: Prisma.$ShowtimePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      theatreId: string | null
      name: string
      screenType: string
    }, ExtArgs["result"]["screen"]>
    composites: {}
  }

  type ScreenGetPayload<S extends boolean | null | undefined | ScreenDefaultArgs> = $Result.GetResult<Prisma.$ScreenPayload, S>

  type ScreenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ScreenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ScreenCountAggregateInputType | true
    }

  export interface ScreenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Screen'], meta: { name: 'Screen' } }
    /**
     * Find zero or one Screen that matches the filter.
     * @param {ScreenFindUniqueArgs} args - Arguments to find a Screen
     * @example
     * // Get one Screen
     * const screen = await prisma.screen.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScreenFindUniqueArgs>(args: SelectSubset<T, ScreenFindUniqueArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Screen that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ScreenFindUniqueOrThrowArgs} args - Arguments to find a Screen
     * @example
     * // Get one Screen
     * const screen = await prisma.screen.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScreenFindUniqueOrThrowArgs>(args: SelectSubset<T, ScreenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Screen that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenFindFirstArgs} args - Arguments to find a Screen
     * @example
     * // Get one Screen
     * const screen = await prisma.screen.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScreenFindFirstArgs>(args?: SelectSubset<T, ScreenFindFirstArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Screen that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenFindFirstOrThrowArgs} args - Arguments to find a Screen
     * @example
     * // Get one Screen
     * const screen = await prisma.screen.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScreenFindFirstOrThrowArgs>(args?: SelectSubset<T, ScreenFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Screens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Screens
     * const screens = await prisma.screen.findMany()
     * 
     * // Get first 10 Screens
     * const screens = await prisma.screen.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const screenWithIdOnly = await prisma.screen.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScreenFindManyArgs>(args?: SelectSubset<T, ScreenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Screen.
     * @param {ScreenCreateArgs} args - Arguments to create a Screen.
     * @example
     * // Create one Screen
     * const Screen = await prisma.screen.create({
     *   data: {
     *     // ... data to create a Screen
     *   }
     * })
     * 
     */
    create<T extends ScreenCreateArgs>(args: SelectSubset<T, ScreenCreateArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Screens.
     * @param {ScreenCreateManyArgs} args - Arguments to create many Screens.
     * @example
     * // Create many Screens
     * const screen = await prisma.screen.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScreenCreateManyArgs>(args?: SelectSubset<T, ScreenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Screens and returns the data saved in the database.
     * @param {ScreenCreateManyAndReturnArgs} args - Arguments to create many Screens.
     * @example
     * // Create many Screens
     * const screen = await prisma.screen.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Screens and only return the `id`
     * const screenWithIdOnly = await prisma.screen.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScreenCreateManyAndReturnArgs>(args?: SelectSubset<T, ScreenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Screen.
     * @param {ScreenDeleteArgs} args - Arguments to delete one Screen.
     * @example
     * // Delete one Screen
     * const Screen = await prisma.screen.delete({
     *   where: {
     *     // ... filter to delete one Screen
     *   }
     * })
     * 
     */
    delete<T extends ScreenDeleteArgs>(args: SelectSubset<T, ScreenDeleteArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Screen.
     * @param {ScreenUpdateArgs} args - Arguments to update one Screen.
     * @example
     * // Update one Screen
     * const screen = await prisma.screen.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScreenUpdateArgs>(args: SelectSubset<T, ScreenUpdateArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Screens.
     * @param {ScreenDeleteManyArgs} args - Arguments to filter Screens to delete.
     * @example
     * // Delete a few Screens
     * const { count } = await prisma.screen.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScreenDeleteManyArgs>(args?: SelectSubset<T, ScreenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Screens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Screens
     * const screen = await prisma.screen.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScreenUpdateManyArgs>(args: SelectSubset<T, ScreenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Screen.
     * @param {ScreenUpsertArgs} args - Arguments to update or create a Screen.
     * @example
     * // Update or create a Screen
     * const screen = await prisma.screen.upsert({
     *   create: {
     *     // ... data to create a Screen
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Screen we want to update
     *   }
     * })
     */
    upsert<T extends ScreenUpsertArgs>(args: SelectSubset<T, ScreenUpsertArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Screens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenCountArgs} args - Arguments to filter Screens to count.
     * @example
     * // Count the number of Screens
     * const count = await prisma.screen.count({
     *   where: {
     *     // ... the filter for the Screens we want to count
     *   }
     * })
    **/
    count<T extends ScreenCountArgs>(
      args?: Subset<T, ScreenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScreenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Screen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScreenAggregateArgs>(args: Subset<T, ScreenAggregateArgs>): Prisma.PrismaPromise<GetScreenAggregateType<T>>

    /**
     * Group by Screen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScreenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScreenGroupByArgs['orderBy'] }
        : { orderBy?: ScreenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScreenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScreenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Screen model
   */
  readonly fields: ScreenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Screen.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScreenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    theatre<T extends Screen$theatreArgs<ExtArgs> = {}>(args?: Subset<T, Screen$theatreArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    seats<T extends Screen$seatsArgs<ExtArgs> = {}>(args?: Subset<T, Screen$seatsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "findMany"> | Null>
    showtimes<T extends Screen$showtimesArgs<ExtArgs> = {}>(args?: Subset<T, Screen$showtimesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Screen model
   */ 
  interface ScreenFieldRefs {
    readonly id: FieldRef<"Screen", 'String'>
    readonly theatreId: FieldRef<"Screen", 'String'>
    readonly name: FieldRef<"Screen", 'String'>
    readonly screenType: FieldRef<"Screen", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Screen findUnique
   */
  export type ScreenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    /**
     * Filter, which Screen to fetch.
     */
    where: ScreenWhereUniqueInput
  }

  /**
   * Screen findUniqueOrThrow
   */
  export type ScreenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    /**
     * Filter, which Screen to fetch.
     */
    where: ScreenWhereUniqueInput
  }

  /**
   * Screen findFirst
   */
  export type ScreenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    /**
     * Filter, which Screen to fetch.
     */
    where?: ScreenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Screens to fetch.
     */
    orderBy?: ScreenOrderByWithRelationInput | ScreenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Screens.
     */
    cursor?: ScreenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Screens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Screens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Screens.
     */
    distinct?: ScreenScalarFieldEnum | ScreenScalarFieldEnum[]
  }

  /**
   * Screen findFirstOrThrow
   */
  export type ScreenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    /**
     * Filter, which Screen to fetch.
     */
    where?: ScreenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Screens to fetch.
     */
    orderBy?: ScreenOrderByWithRelationInput | ScreenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Screens.
     */
    cursor?: ScreenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Screens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Screens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Screens.
     */
    distinct?: ScreenScalarFieldEnum | ScreenScalarFieldEnum[]
  }

  /**
   * Screen findMany
   */
  export type ScreenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    /**
     * Filter, which Screens to fetch.
     */
    where?: ScreenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Screens to fetch.
     */
    orderBy?: ScreenOrderByWithRelationInput | ScreenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Screens.
     */
    cursor?: ScreenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Screens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Screens.
     */
    skip?: number
    distinct?: ScreenScalarFieldEnum | ScreenScalarFieldEnum[]
  }

  /**
   * Screen create
   */
  export type ScreenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    /**
     * The data needed to create a Screen.
     */
    data: XOR<ScreenCreateInput, ScreenUncheckedCreateInput>
  }

  /**
   * Screen createMany
   */
  export type ScreenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Screens.
     */
    data: ScreenCreateManyInput | ScreenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Screen createManyAndReturn
   */
  export type ScreenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Screens.
     */
    data: ScreenCreateManyInput | ScreenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Screen update
   */
  export type ScreenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    /**
     * The data needed to update a Screen.
     */
    data: XOR<ScreenUpdateInput, ScreenUncheckedUpdateInput>
    /**
     * Choose, which Screen to update.
     */
    where: ScreenWhereUniqueInput
  }

  /**
   * Screen updateMany
   */
  export type ScreenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Screens.
     */
    data: XOR<ScreenUpdateManyMutationInput, ScreenUncheckedUpdateManyInput>
    /**
     * Filter which Screens to update
     */
    where?: ScreenWhereInput
  }

  /**
   * Screen upsert
   */
  export type ScreenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    /**
     * The filter to search for the Screen to update in case it exists.
     */
    where: ScreenWhereUniqueInput
    /**
     * In case the Screen found by the `where` argument doesn't exist, create a new Screen with this data.
     */
    create: XOR<ScreenCreateInput, ScreenUncheckedCreateInput>
    /**
     * In case the Screen was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScreenUpdateInput, ScreenUncheckedUpdateInput>
  }

  /**
   * Screen delete
   */
  export type ScreenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    /**
     * Filter which Screen to delete.
     */
    where: ScreenWhereUniqueInput
  }

  /**
   * Screen deleteMany
   */
  export type ScreenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Screens to delete
     */
    where?: ScreenWhereInput
  }

  /**
   * Screen.theatre
   */
  export type Screen$theatreArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    where?: TheatreWhereInput
  }

  /**
   * Screen.seats
   */
  export type Screen$seatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    where?: SeatWhereInput
    orderBy?: SeatOrderByWithRelationInput | SeatOrderByWithRelationInput[]
    cursor?: SeatWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SeatScalarFieldEnum | SeatScalarFieldEnum[]
  }

  /**
   * Screen.showtimes
   */
  export type Screen$showtimesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    where?: ShowtimeWhereInput
    orderBy?: ShowtimeOrderByWithRelationInput | ShowtimeOrderByWithRelationInput[]
    cursor?: ShowtimeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShowtimeScalarFieldEnum | ShowtimeScalarFieldEnum[]
  }

  /**
   * Screen without action
   */
  export type ScreenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
  }


  /**
   * Model Seat
   */

  export type AggregateSeat = {
    _count: SeatCountAggregateOutputType | null
    _avg: SeatAvgAggregateOutputType | null
    _sum: SeatSumAggregateOutputType | null
    _min: SeatMinAggregateOutputType | null
    _max: SeatMaxAggregateOutputType | null
  }

  export type SeatAvgAggregateOutputType = {
    number: number | null
    basePrice: Decimal | null
  }

  export type SeatSumAggregateOutputType = {
    number: number | null
    basePrice: Decimal | null
  }

  export type SeatMinAggregateOutputType = {
    id: string | null
    screenId: string | null
    row: string | null
    number: number | null
    seatNumber: string | null
    tier: string | null
    basePrice: Decimal | null
  }

  export type SeatMaxAggregateOutputType = {
    id: string | null
    screenId: string | null
    row: string | null
    number: number | null
    seatNumber: string | null
    tier: string | null
    basePrice: Decimal | null
  }

  export type SeatCountAggregateOutputType = {
    id: number
    screenId: number
    row: number
    number: number
    seatNumber: number
    tier: number
    basePrice: number
    _all: number
  }


  export type SeatAvgAggregateInputType = {
    number?: true
    basePrice?: true
  }

  export type SeatSumAggregateInputType = {
    number?: true
    basePrice?: true
  }

  export type SeatMinAggregateInputType = {
    id?: true
    screenId?: true
    row?: true
    number?: true
    seatNumber?: true
    tier?: true
    basePrice?: true
  }

  export type SeatMaxAggregateInputType = {
    id?: true
    screenId?: true
    row?: true
    number?: true
    seatNumber?: true
    tier?: true
    basePrice?: true
  }

  export type SeatCountAggregateInputType = {
    id?: true
    screenId?: true
    row?: true
    number?: true
    seatNumber?: true
    tier?: true
    basePrice?: true
    _all?: true
  }

  export type SeatAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Seat to aggregate.
     */
    where?: SeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Seats to fetch.
     */
    orderBy?: SeatOrderByWithRelationInput | SeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Seats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Seats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Seats
    **/
    _count?: true | SeatCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SeatAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SeatSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeatMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeatMaxAggregateInputType
  }

  export type GetSeatAggregateType<T extends SeatAggregateArgs> = {
        [P in keyof T & keyof AggregateSeat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeat[P]>
      : GetScalarType<T[P], AggregateSeat[P]>
  }




  export type SeatGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeatWhereInput
    orderBy?: SeatOrderByWithAggregationInput | SeatOrderByWithAggregationInput[]
    by: SeatScalarFieldEnum[] | SeatScalarFieldEnum
    having?: SeatScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeatCountAggregateInputType | true
    _avg?: SeatAvgAggregateInputType
    _sum?: SeatSumAggregateInputType
    _min?: SeatMinAggregateInputType
    _max?: SeatMaxAggregateInputType
  }

  export type SeatGroupByOutputType = {
    id: string
    screenId: string | null
    row: string
    number: number
    seatNumber: string | null
    tier: string
    basePrice: Decimal
    _count: SeatCountAggregateOutputType | null
    _avg: SeatAvgAggregateOutputType | null
    _sum: SeatSumAggregateOutputType | null
    _min: SeatMinAggregateOutputType | null
    _max: SeatMaxAggregateOutputType | null
  }

  type GetSeatGroupByPayload<T extends SeatGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeatGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeatGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeatGroupByOutputType[P]>
            : GetScalarType<T[P], SeatGroupByOutputType[P]>
        }
      >
    >


  export type SeatSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    screenId?: boolean
    row?: boolean
    number?: boolean
    seatNumber?: boolean
    tier?: boolean
    basePrice?: boolean
    screen?: boolean | Seat$screenArgs<ExtArgs>
    reservations?: boolean | Seat$reservationsArgs<ExtArgs>
    _count?: boolean | SeatCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seat"]>

  export type SeatSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    screenId?: boolean
    row?: boolean
    number?: boolean
    seatNumber?: boolean
    tier?: boolean
    basePrice?: boolean
    screen?: boolean | Seat$screenArgs<ExtArgs>
  }, ExtArgs["result"]["seat"]>

  export type SeatSelectScalar = {
    id?: boolean
    screenId?: boolean
    row?: boolean
    number?: boolean
    seatNumber?: boolean
    tier?: boolean
    basePrice?: boolean
  }

  export type SeatInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    screen?: boolean | Seat$screenArgs<ExtArgs>
    reservations?: boolean | Seat$reservationsArgs<ExtArgs>
    _count?: boolean | SeatCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SeatIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    screen?: boolean | Seat$screenArgs<ExtArgs>
  }

  export type $SeatPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Seat"
    objects: {
      screen: Prisma.$ScreenPayload<ExtArgs> | null
      reservations: Prisma.$SeatReservationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      screenId: string | null
      row: string
      number: number
      seatNumber: string | null
      tier: string
      basePrice: Prisma.Decimal
    }, ExtArgs["result"]["seat"]>
    composites: {}
  }

  type SeatGetPayload<S extends boolean | null | undefined | SeatDefaultArgs> = $Result.GetResult<Prisma.$SeatPayload, S>

  type SeatCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SeatFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SeatCountAggregateInputType | true
    }

  export interface SeatDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Seat'], meta: { name: 'Seat' } }
    /**
     * Find zero or one Seat that matches the filter.
     * @param {SeatFindUniqueArgs} args - Arguments to find a Seat
     * @example
     * // Get one Seat
     * const seat = await prisma.seat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeatFindUniqueArgs>(args: SelectSubset<T, SeatFindUniqueArgs<ExtArgs>>): Prisma__SeatClient<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Seat that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SeatFindUniqueOrThrowArgs} args - Arguments to find a Seat
     * @example
     * // Get one Seat
     * const seat = await prisma.seat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeatFindUniqueOrThrowArgs>(args: SelectSubset<T, SeatFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeatClient<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Seat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatFindFirstArgs} args - Arguments to find a Seat
     * @example
     * // Get one Seat
     * const seat = await prisma.seat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeatFindFirstArgs>(args?: SelectSubset<T, SeatFindFirstArgs<ExtArgs>>): Prisma__SeatClient<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Seat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatFindFirstOrThrowArgs} args - Arguments to find a Seat
     * @example
     * // Get one Seat
     * const seat = await prisma.seat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeatFindFirstOrThrowArgs>(args?: SelectSubset<T, SeatFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeatClient<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Seats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Seats
     * const seats = await prisma.seat.findMany()
     * 
     * // Get first 10 Seats
     * const seats = await prisma.seat.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seatWithIdOnly = await prisma.seat.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeatFindManyArgs>(args?: SelectSubset<T, SeatFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Seat.
     * @param {SeatCreateArgs} args - Arguments to create a Seat.
     * @example
     * // Create one Seat
     * const Seat = await prisma.seat.create({
     *   data: {
     *     // ... data to create a Seat
     *   }
     * })
     * 
     */
    create<T extends SeatCreateArgs>(args: SelectSubset<T, SeatCreateArgs<ExtArgs>>): Prisma__SeatClient<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Seats.
     * @param {SeatCreateManyArgs} args - Arguments to create many Seats.
     * @example
     * // Create many Seats
     * const seat = await prisma.seat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeatCreateManyArgs>(args?: SelectSubset<T, SeatCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Seats and returns the data saved in the database.
     * @param {SeatCreateManyAndReturnArgs} args - Arguments to create many Seats.
     * @example
     * // Create many Seats
     * const seat = await prisma.seat.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Seats and only return the `id`
     * const seatWithIdOnly = await prisma.seat.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SeatCreateManyAndReturnArgs>(args?: SelectSubset<T, SeatCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Seat.
     * @param {SeatDeleteArgs} args - Arguments to delete one Seat.
     * @example
     * // Delete one Seat
     * const Seat = await prisma.seat.delete({
     *   where: {
     *     // ... filter to delete one Seat
     *   }
     * })
     * 
     */
    delete<T extends SeatDeleteArgs>(args: SelectSubset<T, SeatDeleteArgs<ExtArgs>>): Prisma__SeatClient<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Seat.
     * @param {SeatUpdateArgs} args - Arguments to update one Seat.
     * @example
     * // Update one Seat
     * const seat = await prisma.seat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeatUpdateArgs>(args: SelectSubset<T, SeatUpdateArgs<ExtArgs>>): Prisma__SeatClient<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Seats.
     * @param {SeatDeleteManyArgs} args - Arguments to filter Seats to delete.
     * @example
     * // Delete a few Seats
     * const { count } = await prisma.seat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeatDeleteManyArgs>(args?: SelectSubset<T, SeatDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Seats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Seats
     * const seat = await prisma.seat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeatUpdateManyArgs>(args: SelectSubset<T, SeatUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Seat.
     * @param {SeatUpsertArgs} args - Arguments to update or create a Seat.
     * @example
     * // Update or create a Seat
     * const seat = await prisma.seat.upsert({
     *   create: {
     *     // ... data to create a Seat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Seat we want to update
     *   }
     * })
     */
    upsert<T extends SeatUpsertArgs>(args: SelectSubset<T, SeatUpsertArgs<ExtArgs>>): Prisma__SeatClient<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Seats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatCountArgs} args - Arguments to filter Seats to count.
     * @example
     * // Count the number of Seats
     * const count = await prisma.seat.count({
     *   where: {
     *     // ... the filter for the Seats we want to count
     *   }
     * })
    **/
    count<T extends SeatCountArgs>(
      args?: Subset<T, SeatCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeatCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Seat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeatAggregateArgs>(args: Subset<T, SeatAggregateArgs>): Prisma.PrismaPromise<GetSeatAggregateType<T>>

    /**
     * Group by Seat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeatGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeatGroupByArgs['orderBy'] }
        : { orderBy?: SeatGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeatGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeatGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Seat model
   */
  readonly fields: SeatFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Seat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeatClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    screen<T extends Seat$screenArgs<ExtArgs> = {}>(args?: Subset<T, Seat$screenArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    reservations<T extends Seat$reservationsArgs<ExtArgs> = {}>(args?: Subset<T, Seat$reservationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Seat model
   */ 
  interface SeatFieldRefs {
    readonly id: FieldRef<"Seat", 'String'>
    readonly screenId: FieldRef<"Seat", 'String'>
    readonly row: FieldRef<"Seat", 'String'>
    readonly number: FieldRef<"Seat", 'Int'>
    readonly seatNumber: FieldRef<"Seat", 'String'>
    readonly tier: FieldRef<"Seat", 'String'>
    readonly basePrice: FieldRef<"Seat", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * Seat findUnique
   */
  export type SeatFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    /**
     * Filter, which Seat to fetch.
     */
    where: SeatWhereUniqueInput
  }

  /**
   * Seat findUniqueOrThrow
   */
  export type SeatFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    /**
     * Filter, which Seat to fetch.
     */
    where: SeatWhereUniqueInput
  }

  /**
   * Seat findFirst
   */
  export type SeatFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    /**
     * Filter, which Seat to fetch.
     */
    where?: SeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Seats to fetch.
     */
    orderBy?: SeatOrderByWithRelationInput | SeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Seats.
     */
    cursor?: SeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Seats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Seats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Seats.
     */
    distinct?: SeatScalarFieldEnum | SeatScalarFieldEnum[]
  }

  /**
   * Seat findFirstOrThrow
   */
  export type SeatFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    /**
     * Filter, which Seat to fetch.
     */
    where?: SeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Seats to fetch.
     */
    orderBy?: SeatOrderByWithRelationInput | SeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Seats.
     */
    cursor?: SeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Seats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Seats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Seats.
     */
    distinct?: SeatScalarFieldEnum | SeatScalarFieldEnum[]
  }

  /**
   * Seat findMany
   */
  export type SeatFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    /**
     * Filter, which Seats to fetch.
     */
    where?: SeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Seats to fetch.
     */
    orderBy?: SeatOrderByWithRelationInput | SeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Seats.
     */
    cursor?: SeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Seats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Seats.
     */
    skip?: number
    distinct?: SeatScalarFieldEnum | SeatScalarFieldEnum[]
  }

  /**
   * Seat create
   */
  export type SeatCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    /**
     * The data needed to create a Seat.
     */
    data: XOR<SeatCreateInput, SeatUncheckedCreateInput>
  }

  /**
   * Seat createMany
   */
  export type SeatCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Seats.
     */
    data: SeatCreateManyInput | SeatCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Seat createManyAndReturn
   */
  export type SeatCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Seats.
     */
    data: SeatCreateManyInput | SeatCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Seat update
   */
  export type SeatUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    /**
     * The data needed to update a Seat.
     */
    data: XOR<SeatUpdateInput, SeatUncheckedUpdateInput>
    /**
     * Choose, which Seat to update.
     */
    where: SeatWhereUniqueInput
  }

  /**
   * Seat updateMany
   */
  export type SeatUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Seats.
     */
    data: XOR<SeatUpdateManyMutationInput, SeatUncheckedUpdateManyInput>
    /**
     * Filter which Seats to update
     */
    where?: SeatWhereInput
  }

  /**
   * Seat upsert
   */
  export type SeatUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    /**
     * The filter to search for the Seat to update in case it exists.
     */
    where: SeatWhereUniqueInput
    /**
     * In case the Seat found by the `where` argument doesn't exist, create a new Seat with this data.
     */
    create: XOR<SeatCreateInput, SeatUncheckedCreateInput>
    /**
     * In case the Seat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeatUpdateInput, SeatUncheckedUpdateInput>
  }

  /**
   * Seat delete
   */
  export type SeatDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
    /**
     * Filter which Seat to delete.
     */
    where: SeatWhereUniqueInput
  }

  /**
   * Seat deleteMany
   */
  export type SeatDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Seats to delete
     */
    where?: SeatWhereInput
  }

  /**
   * Seat.screen
   */
  export type Seat$screenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    where?: ScreenWhereInput
  }

  /**
   * Seat.reservations
   */
  export type Seat$reservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    where?: SeatReservationWhereInput
    orderBy?: SeatReservationOrderByWithRelationInput | SeatReservationOrderByWithRelationInput[]
    cursor?: SeatReservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SeatReservationScalarFieldEnum | SeatReservationScalarFieldEnum[]
  }

  /**
   * Seat without action
   */
  export type SeatDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seat
     */
    select?: SeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatInclude<ExtArgs> | null
  }


  /**
   * Model Showtime
   */

  export type AggregateShowtime = {
    _count: ShowtimeCountAggregateOutputType | null
    _avg: ShowtimeAvgAggregateOutputType | null
    _sum: ShowtimeSumAggregateOutputType | null
    _min: ShowtimeMinAggregateOutputType | null
    _max: ShowtimeMaxAggregateOutputType | null
  }

  export type ShowtimeAvgAggregateOutputType = {
    priceMultiplier: Decimal | null
  }

  export type ShowtimeSumAggregateOutputType = {
    priceMultiplier: Decimal | null
  }

  export type ShowtimeMinAggregateOutputType = {
    id: string | null
    cinemaId: string | null
    screenId: string | null
    movieId: string | null
    date: string | null
    time: string | null
    format: string | null
    hallName: string | null
    language: string | null
    priceMultiplier: Decimal | null
    createdAt: Date | null
    hall: string | null
  }

  export type ShowtimeMaxAggregateOutputType = {
    id: string | null
    cinemaId: string | null
    screenId: string | null
    movieId: string | null
    date: string | null
    time: string | null
    format: string | null
    hallName: string | null
    language: string | null
    priceMultiplier: Decimal | null
    createdAt: Date | null
    hall: string | null
  }

  export type ShowtimeCountAggregateOutputType = {
    id: number
    cinemaId: number
    screenId: number
    movieId: number
    date: number
    time: number
    format: number
    hallName: number
    language: number
    priceMultiplier: number
    createdAt: number
    hall: number
    _all: number
  }


  export type ShowtimeAvgAggregateInputType = {
    priceMultiplier?: true
  }

  export type ShowtimeSumAggregateInputType = {
    priceMultiplier?: true
  }

  export type ShowtimeMinAggregateInputType = {
    id?: true
    cinemaId?: true
    screenId?: true
    movieId?: true
    date?: true
    time?: true
    format?: true
    hallName?: true
    language?: true
    priceMultiplier?: true
    createdAt?: true
    hall?: true
  }

  export type ShowtimeMaxAggregateInputType = {
    id?: true
    cinemaId?: true
    screenId?: true
    movieId?: true
    date?: true
    time?: true
    format?: true
    hallName?: true
    language?: true
    priceMultiplier?: true
    createdAt?: true
    hall?: true
  }

  export type ShowtimeCountAggregateInputType = {
    id?: true
    cinemaId?: true
    screenId?: true
    movieId?: true
    date?: true
    time?: true
    format?: true
    hallName?: true
    language?: true
    priceMultiplier?: true
    createdAt?: true
    hall?: true
    _all?: true
  }

  export type ShowtimeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Showtime to aggregate.
     */
    where?: ShowtimeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Showtimes to fetch.
     */
    orderBy?: ShowtimeOrderByWithRelationInput | ShowtimeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShowtimeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Showtimes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Showtimes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Showtimes
    **/
    _count?: true | ShowtimeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShowtimeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShowtimeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShowtimeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShowtimeMaxAggregateInputType
  }

  export type GetShowtimeAggregateType<T extends ShowtimeAggregateArgs> = {
        [P in keyof T & keyof AggregateShowtime]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShowtime[P]>
      : GetScalarType<T[P], AggregateShowtime[P]>
  }




  export type ShowtimeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShowtimeWhereInput
    orderBy?: ShowtimeOrderByWithAggregationInput | ShowtimeOrderByWithAggregationInput[]
    by: ShowtimeScalarFieldEnum[] | ShowtimeScalarFieldEnum
    having?: ShowtimeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShowtimeCountAggregateInputType | true
    _avg?: ShowtimeAvgAggregateInputType
    _sum?: ShowtimeSumAggregateInputType
    _min?: ShowtimeMinAggregateInputType
    _max?: ShowtimeMaxAggregateInputType
  }

  export type ShowtimeGroupByOutputType = {
    id: string
    cinemaId: string | null
    screenId: string | null
    movieId: string | null
    date: string
    time: string
    format: string
    hallName: string
    language: string
    priceMultiplier: Decimal
    createdAt: Date
    hall: string | null
    _count: ShowtimeCountAggregateOutputType | null
    _avg: ShowtimeAvgAggregateOutputType | null
    _sum: ShowtimeSumAggregateOutputType | null
    _min: ShowtimeMinAggregateOutputType | null
    _max: ShowtimeMaxAggregateOutputType | null
  }

  type GetShowtimeGroupByPayload<T extends ShowtimeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShowtimeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShowtimeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShowtimeGroupByOutputType[P]>
            : GetScalarType<T[P], ShowtimeGroupByOutputType[P]>
        }
      >
    >


  export type ShowtimeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cinemaId?: boolean
    screenId?: boolean
    movieId?: boolean
    date?: boolean
    time?: boolean
    format?: boolean
    hallName?: boolean
    language?: boolean
    priceMultiplier?: boolean
    createdAt?: boolean
    hall?: boolean
    cinema?: boolean | Showtime$cinemaArgs<ExtArgs>
    screen?: boolean | Showtime$screenArgs<ExtArgs>
    movie?: boolean | Showtime$movieArgs<ExtArgs>
    reservations?: boolean | Showtime$reservationsArgs<ExtArgs>
    bookings?: boolean | Showtime$bookingsArgs<ExtArgs>
    _count?: boolean | ShowtimeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["showtime"]>

  export type ShowtimeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cinemaId?: boolean
    screenId?: boolean
    movieId?: boolean
    date?: boolean
    time?: boolean
    format?: boolean
    hallName?: boolean
    language?: boolean
    priceMultiplier?: boolean
    createdAt?: boolean
    hall?: boolean
    cinema?: boolean | Showtime$cinemaArgs<ExtArgs>
    screen?: boolean | Showtime$screenArgs<ExtArgs>
    movie?: boolean | Showtime$movieArgs<ExtArgs>
  }, ExtArgs["result"]["showtime"]>

  export type ShowtimeSelectScalar = {
    id?: boolean
    cinemaId?: boolean
    screenId?: boolean
    movieId?: boolean
    date?: boolean
    time?: boolean
    format?: boolean
    hallName?: boolean
    language?: boolean
    priceMultiplier?: boolean
    createdAt?: boolean
    hall?: boolean
  }

  export type ShowtimeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cinema?: boolean | Showtime$cinemaArgs<ExtArgs>
    screen?: boolean | Showtime$screenArgs<ExtArgs>
    movie?: boolean | Showtime$movieArgs<ExtArgs>
    reservations?: boolean | Showtime$reservationsArgs<ExtArgs>
    bookings?: boolean | Showtime$bookingsArgs<ExtArgs>
    _count?: boolean | ShowtimeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ShowtimeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cinema?: boolean | Showtime$cinemaArgs<ExtArgs>
    screen?: boolean | Showtime$screenArgs<ExtArgs>
    movie?: boolean | Showtime$movieArgs<ExtArgs>
  }

  export type $ShowtimePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Showtime"
    objects: {
      cinema: Prisma.$TheatrePayload<ExtArgs> | null
      screen: Prisma.$ScreenPayload<ExtArgs> | null
      movie: Prisma.$MoviePayload<ExtArgs> | null
      reservations: Prisma.$SeatReservationPayload<ExtArgs>[]
      bookings: Prisma.$BookingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cinemaId: string | null
      screenId: string | null
      movieId: string | null
      date: string
      time: string
      format: string
      hallName: string
      language: string
      priceMultiplier: Prisma.Decimal
      createdAt: Date
      hall: string | null
    }, ExtArgs["result"]["showtime"]>
    composites: {}
  }

  type ShowtimeGetPayload<S extends boolean | null | undefined | ShowtimeDefaultArgs> = $Result.GetResult<Prisma.$ShowtimePayload, S>

  type ShowtimeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ShowtimeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ShowtimeCountAggregateInputType | true
    }

  export interface ShowtimeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Showtime'], meta: { name: 'Showtime' } }
    /**
     * Find zero or one Showtime that matches the filter.
     * @param {ShowtimeFindUniqueArgs} args - Arguments to find a Showtime
     * @example
     * // Get one Showtime
     * const showtime = await prisma.showtime.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShowtimeFindUniqueArgs>(args: SelectSubset<T, ShowtimeFindUniqueArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Showtime that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ShowtimeFindUniqueOrThrowArgs} args - Arguments to find a Showtime
     * @example
     * // Get one Showtime
     * const showtime = await prisma.showtime.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShowtimeFindUniqueOrThrowArgs>(args: SelectSubset<T, ShowtimeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Showtime that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowtimeFindFirstArgs} args - Arguments to find a Showtime
     * @example
     * // Get one Showtime
     * const showtime = await prisma.showtime.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShowtimeFindFirstArgs>(args?: SelectSubset<T, ShowtimeFindFirstArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Showtime that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowtimeFindFirstOrThrowArgs} args - Arguments to find a Showtime
     * @example
     * // Get one Showtime
     * const showtime = await prisma.showtime.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShowtimeFindFirstOrThrowArgs>(args?: SelectSubset<T, ShowtimeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Showtimes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowtimeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Showtimes
     * const showtimes = await prisma.showtime.findMany()
     * 
     * // Get first 10 Showtimes
     * const showtimes = await prisma.showtime.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const showtimeWithIdOnly = await prisma.showtime.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShowtimeFindManyArgs>(args?: SelectSubset<T, ShowtimeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Showtime.
     * @param {ShowtimeCreateArgs} args - Arguments to create a Showtime.
     * @example
     * // Create one Showtime
     * const Showtime = await prisma.showtime.create({
     *   data: {
     *     // ... data to create a Showtime
     *   }
     * })
     * 
     */
    create<T extends ShowtimeCreateArgs>(args: SelectSubset<T, ShowtimeCreateArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Showtimes.
     * @param {ShowtimeCreateManyArgs} args - Arguments to create many Showtimes.
     * @example
     * // Create many Showtimes
     * const showtime = await prisma.showtime.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShowtimeCreateManyArgs>(args?: SelectSubset<T, ShowtimeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Showtimes and returns the data saved in the database.
     * @param {ShowtimeCreateManyAndReturnArgs} args - Arguments to create many Showtimes.
     * @example
     * // Create many Showtimes
     * const showtime = await prisma.showtime.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Showtimes and only return the `id`
     * const showtimeWithIdOnly = await prisma.showtime.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShowtimeCreateManyAndReturnArgs>(args?: SelectSubset<T, ShowtimeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Showtime.
     * @param {ShowtimeDeleteArgs} args - Arguments to delete one Showtime.
     * @example
     * // Delete one Showtime
     * const Showtime = await prisma.showtime.delete({
     *   where: {
     *     // ... filter to delete one Showtime
     *   }
     * })
     * 
     */
    delete<T extends ShowtimeDeleteArgs>(args: SelectSubset<T, ShowtimeDeleteArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Showtime.
     * @param {ShowtimeUpdateArgs} args - Arguments to update one Showtime.
     * @example
     * // Update one Showtime
     * const showtime = await prisma.showtime.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShowtimeUpdateArgs>(args: SelectSubset<T, ShowtimeUpdateArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Showtimes.
     * @param {ShowtimeDeleteManyArgs} args - Arguments to filter Showtimes to delete.
     * @example
     * // Delete a few Showtimes
     * const { count } = await prisma.showtime.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShowtimeDeleteManyArgs>(args?: SelectSubset<T, ShowtimeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Showtimes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowtimeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Showtimes
     * const showtime = await prisma.showtime.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShowtimeUpdateManyArgs>(args: SelectSubset<T, ShowtimeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Showtime.
     * @param {ShowtimeUpsertArgs} args - Arguments to update or create a Showtime.
     * @example
     * // Update or create a Showtime
     * const showtime = await prisma.showtime.upsert({
     *   create: {
     *     // ... data to create a Showtime
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Showtime we want to update
     *   }
     * })
     */
    upsert<T extends ShowtimeUpsertArgs>(args: SelectSubset<T, ShowtimeUpsertArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Showtimes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowtimeCountArgs} args - Arguments to filter Showtimes to count.
     * @example
     * // Count the number of Showtimes
     * const count = await prisma.showtime.count({
     *   where: {
     *     // ... the filter for the Showtimes we want to count
     *   }
     * })
    **/
    count<T extends ShowtimeCountArgs>(
      args?: Subset<T, ShowtimeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShowtimeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Showtime.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowtimeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShowtimeAggregateArgs>(args: Subset<T, ShowtimeAggregateArgs>): Prisma.PrismaPromise<GetShowtimeAggregateType<T>>

    /**
     * Group by Showtime.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowtimeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShowtimeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShowtimeGroupByArgs['orderBy'] }
        : { orderBy?: ShowtimeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShowtimeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShowtimeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Showtime model
   */
  readonly fields: ShowtimeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Showtime.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShowtimeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cinema<T extends Showtime$cinemaArgs<ExtArgs> = {}>(args?: Subset<T, Showtime$cinemaArgs<ExtArgs>>): Prisma__TheatreClient<$Result.GetResult<Prisma.$TheatrePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    screen<T extends Showtime$screenArgs<ExtArgs> = {}>(args?: Subset<T, Showtime$screenArgs<ExtArgs>>): Prisma__ScreenClient<$Result.GetResult<Prisma.$ScreenPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    movie<T extends Showtime$movieArgs<ExtArgs> = {}>(args?: Subset<T, Showtime$movieArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    reservations<T extends Showtime$reservationsArgs<ExtArgs> = {}>(args?: Subset<T, Showtime$reservationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "findMany"> | Null>
    bookings<T extends Showtime$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, Showtime$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Showtime model
   */ 
  interface ShowtimeFieldRefs {
    readonly id: FieldRef<"Showtime", 'String'>
    readonly cinemaId: FieldRef<"Showtime", 'String'>
    readonly screenId: FieldRef<"Showtime", 'String'>
    readonly movieId: FieldRef<"Showtime", 'String'>
    readonly date: FieldRef<"Showtime", 'String'>
    readonly time: FieldRef<"Showtime", 'String'>
    readonly format: FieldRef<"Showtime", 'String'>
    readonly hallName: FieldRef<"Showtime", 'String'>
    readonly language: FieldRef<"Showtime", 'String'>
    readonly priceMultiplier: FieldRef<"Showtime", 'Decimal'>
    readonly createdAt: FieldRef<"Showtime", 'DateTime'>
    readonly hall: FieldRef<"Showtime", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Showtime findUnique
   */
  export type ShowtimeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    /**
     * Filter, which Showtime to fetch.
     */
    where: ShowtimeWhereUniqueInput
  }

  /**
   * Showtime findUniqueOrThrow
   */
  export type ShowtimeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    /**
     * Filter, which Showtime to fetch.
     */
    where: ShowtimeWhereUniqueInput
  }

  /**
   * Showtime findFirst
   */
  export type ShowtimeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    /**
     * Filter, which Showtime to fetch.
     */
    where?: ShowtimeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Showtimes to fetch.
     */
    orderBy?: ShowtimeOrderByWithRelationInput | ShowtimeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Showtimes.
     */
    cursor?: ShowtimeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Showtimes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Showtimes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Showtimes.
     */
    distinct?: ShowtimeScalarFieldEnum | ShowtimeScalarFieldEnum[]
  }

  /**
   * Showtime findFirstOrThrow
   */
  export type ShowtimeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    /**
     * Filter, which Showtime to fetch.
     */
    where?: ShowtimeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Showtimes to fetch.
     */
    orderBy?: ShowtimeOrderByWithRelationInput | ShowtimeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Showtimes.
     */
    cursor?: ShowtimeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Showtimes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Showtimes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Showtimes.
     */
    distinct?: ShowtimeScalarFieldEnum | ShowtimeScalarFieldEnum[]
  }

  /**
   * Showtime findMany
   */
  export type ShowtimeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    /**
     * Filter, which Showtimes to fetch.
     */
    where?: ShowtimeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Showtimes to fetch.
     */
    orderBy?: ShowtimeOrderByWithRelationInput | ShowtimeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Showtimes.
     */
    cursor?: ShowtimeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Showtimes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Showtimes.
     */
    skip?: number
    distinct?: ShowtimeScalarFieldEnum | ShowtimeScalarFieldEnum[]
  }

  /**
   * Showtime create
   */
  export type ShowtimeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    /**
     * The data needed to create a Showtime.
     */
    data: XOR<ShowtimeCreateInput, ShowtimeUncheckedCreateInput>
  }

  /**
   * Showtime createMany
   */
  export type ShowtimeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Showtimes.
     */
    data: ShowtimeCreateManyInput | ShowtimeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Showtime createManyAndReturn
   */
  export type ShowtimeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Showtimes.
     */
    data: ShowtimeCreateManyInput | ShowtimeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Showtime update
   */
  export type ShowtimeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    /**
     * The data needed to update a Showtime.
     */
    data: XOR<ShowtimeUpdateInput, ShowtimeUncheckedUpdateInput>
    /**
     * Choose, which Showtime to update.
     */
    where: ShowtimeWhereUniqueInput
  }

  /**
   * Showtime updateMany
   */
  export type ShowtimeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Showtimes.
     */
    data: XOR<ShowtimeUpdateManyMutationInput, ShowtimeUncheckedUpdateManyInput>
    /**
     * Filter which Showtimes to update
     */
    where?: ShowtimeWhereInput
  }

  /**
   * Showtime upsert
   */
  export type ShowtimeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    /**
     * The filter to search for the Showtime to update in case it exists.
     */
    where: ShowtimeWhereUniqueInput
    /**
     * In case the Showtime found by the `where` argument doesn't exist, create a new Showtime with this data.
     */
    create: XOR<ShowtimeCreateInput, ShowtimeUncheckedCreateInput>
    /**
     * In case the Showtime was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShowtimeUpdateInput, ShowtimeUncheckedUpdateInput>
  }

  /**
   * Showtime delete
   */
  export type ShowtimeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
    /**
     * Filter which Showtime to delete.
     */
    where: ShowtimeWhereUniqueInput
  }

  /**
   * Showtime deleteMany
   */
  export type ShowtimeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Showtimes to delete
     */
    where?: ShowtimeWhereInput
  }

  /**
   * Showtime.cinema
   */
  export type Showtime$cinemaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theatre
     */
    select?: TheatreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TheatreInclude<ExtArgs> | null
    where?: TheatreWhereInput
  }

  /**
   * Showtime.screen
   */
  export type Showtime$screenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screen
     */
    select?: ScreenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenInclude<ExtArgs> | null
    where?: ScreenWhereInput
  }

  /**
   * Showtime.movie
   */
  export type Showtime$movieArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movie
     */
    select?: MovieSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieInclude<ExtArgs> | null
    where?: MovieWhereInput
  }

  /**
   * Showtime.reservations
   */
  export type Showtime$reservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    where?: SeatReservationWhereInput
    orderBy?: SeatReservationOrderByWithRelationInput | SeatReservationOrderByWithRelationInput[]
    cursor?: SeatReservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SeatReservationScalarFieldEnum | SeatReservationScalarFieldEnum[]
  }

  /**
   * Showtime.bookings
   */
  export type Showtime$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Showtime without action
   */
  export type ShowtimeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Showtime
     */
    select?: ShowtimeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowtimeInclude<ExtArgs> | null
  }


  /**
   * Model SeatReservation
   */

  export type AggregateSeatReservation = {
    _count: SeatReservationCountAggregateOutputType | null
    _min: SeatReservationMinAggregateOutputType | null
    _max: SeatReservationMaxAggregateOutputType | null
  }

  export type SeatReservationMinAggregateOutputType = {
    id: string | null
    showtimeId: string | null
    seatId: string | null
    status: string | null
    heldBy: string | null
    heldExpiresAt: Date | null
    bookingId: string | null
    createdAt: Date | null
  }

  export type SeatReservationMaxAggregateOutputType = {
    id: string | null
    showtimeId: string | null
    seatId: string | null
    status: string | null
    heldBy: string | null
    heldExpiresAt: Date | null
    bookingId: string | null
    createdAt: Date | null
  }

  export type SeatReservationCountAggregateOutputType = {
    id: number
    showtimeId: number
    seatId: number
    status: number
    heldBy: number
    heldExpiresAt: number
    bookingId: number
    createdAt: number
    _all: number
  }


  export type SeatReservationMinAggregateInputType = {
    id?: true
    showtimeId?: true
    seatId?: true
    status?: true
    heldBy?: true
    heldExpiresAt?: true
    bookingId?: true
    createdAt?: true
  }

  export type SeatReservationMaxAggregateInputType = {
    id?: true
    showtimeId?: true
    seatId?: true
    status?: true
    heldBy?: true
    heldExpiresAt?: true
    bookingId?: true
    createdAt?: true
  }

  export type SeatReservationCountAggregateInputType = {
    id?: true
    showtimeId?: true
    seatId?: true
    status?: true
    heldBy?: true
    heldExpiresAt?: true
    bookingId?: true
    createdAt?: true
    _all?: true
  }

  export type SeatReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeatReservation to aggregate.
     */
    where?: SeatReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeatReservations to fetch.
     */
    orderBy?: SeatReservationOrderByWithRelationInput | SeatReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeatReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeatReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeatReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SeatReservations
    **/
    _count?: true | SeatReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeatReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeatReservationMaxAggregateInputType
  }

  export type GetSeatReservationAggregateType<T extends SeatReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateSeatReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeatReservation[P]>
      : GetScalarType<T[P], AggregateSeatReservation[P]>
  }




  export type SeatReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeatReservationWhereInput
    orderBy?: SeatReservationOrderByWithAggregationInput | SeatReservationOrderByWithAggregationInput[]
    by: SeatReservationScalarFieldEnum[] | SeatReservationScalarFieldEnum
    having?: SeatReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeatReservationCountAggregateInputType | true
    _min?: SeatReservationMinAggregateInputType
    _max?: SeatReservationMaxAggregateInputType
  }

  export type SeatReservationGroupByOutputType = {
    id: string
    showtimeId: string
    seatId: string
    status: string
    heldBy: string | null
    heldExpiresAt: Date | null
    bookingId: string | null
    createdAt: Date
    _count: SeatReservationCountAggregateOutputType | null
    _min: SeatReservationMinAggregateOutputType | null
    _max: SeatReservationMaxAggregateOutputType | null
  }

  type GetSeatReservationGroupByPayload<T extends SeatReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeatReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeatReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeatReservationGroupByOutputType[P]>
            : GetScalarType<T[P], SeatReservationGroupByOutputType[P]>
        }
      >
    >


  export type SeatReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    showtimeId?: boolean
    seatId?: boolean
    status?: boolean
    heldBy?: boolean
    heldExpiresAt?: boolean
    bookingId?: boolean
    createdAt?: boolean
    showtime?: boolean | ShowtimeDefaultArgs<ExtArgs>
    seat?: boolean | SeatDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seatReservation"]>

  export type SeatReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    showtimeId?: boolean
    seatId?: boolean
    status?: boolean
    heldBy?: boolean
    heldExpiresAt?: boolean
    bookingId?: boolean
    createdAt?: boolean
    showtime?: boolean | ShowtimeDefaultArgs<ExtArgs>
    seat?: boolean | SeatDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seatReservation"]>

  export type SeatReservationSelectScalar = {
    id?: boolean
    showtimeId?: boolean
    seatId?: boolean
    status?: boolean
    heldBy?: boolean
    heldExpiresAt?: boolean
    bookingId?: boolean
    createdAt?: boolean
  }

  export type SeatReservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    showtime?: boolean | ShowtimeDefaultArgs<ExtArgs>
    seat?: boolean | SeatDefaultArgs<ExtArgs>
  }
  export type SeatReservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    showtime?: boolean | ShowtimeDefaultArgs<ExtArgs>
    seat?: boolean | SeatDefaultArgs<ExtArgs>
  }

  export type $SeatReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SeatReservation"
    objects: {
      showtime: Prisma.$ShowtimePayload<ExtArgs>
      seat: Prisma.$SeatPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      showtimeId: string
      seatId: string
      status: string
      heldBy: string | null
      heldExpiresAt: Date | null
      bookingId: string | null
      createdAt: Date
    }, ExtArgs["result"]["seatReservation"]>
    composites: {}
  }

  type SeatReservationGetPayload<S extends boolean | null | undefined | SeatReservationDefaultArgs> = $Result.GetResult<Prisma.$SeatReservationPayload, S>

  type SeatReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SeatReservationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SeatReservationCountAggregateInputType | true
    }

  export interface SeatReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SeatReservation'], meta: { name: 'SeatReservation' } }
    /**
     * Find zero or one SeatReservation that matches the filter.
     * @param {SeatReservationFindUniqueArgs} args - Arguments to find a SeatReservation
     * @example
     * // Get one SeatReservation
     * const seatReservation = await prisma.seatReservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeatReservationFindUniqueArgs>(args: SelectSubset<T, SeatReservationFindUniqueArgs<ExtArgs>>): Prisma__SeatReservationClient<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SeatReservation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SeatReservationFindUniqueOrThrowArgs} args - Arguments to find a SeatReservation
     * @example
     * // Get one SeatReservation
     * const seatReservation = await prisma.seatReservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeatReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, SeatReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeatReservationClient<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SeatReservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatReservationFindFirstArgs} args - Arguments to find a SeatReservation
     * @example
     * // Get one SeatReservation
     * const seatReservation = await prisma.seatReservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeatReservationFindFirstArgs>(args?: SelectSubset<T, SeatReservationFindFirstArgs<ExtArgs>>): Prisma__SeatReservationClient<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SeatReservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatReservationFindFirstOrThrowArgs} args - Arguments to find a SeatReservation
     * @example
     * // Get one SeatReservation
     * const seatReservation = await prisma.seatReservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeatReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, SeatReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeatReservationClient<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SeatReservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeatReservations
     * const seatReservations = await prisma.seatReservation.findMany()
     * 
     * // Get first 10 SeatReservations
     * const seatReservations = await prisma.seatReservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seatReservationWithIdOnly = await prisma.seatReservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeatReservationFindManyArgs>(args?: SelectSubset<T, SeatReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SeatReservation.
     * @param {SeatReservationCreateArgs} args - Arguments to create a SeatReservation.
     * @example
     * // Create one SeatReservation
     * const SeatReservation = await prisma.seatReservation.create({
     *   data: {
     *     // ... data to create a SeatReservation
     *   }
     * })
     * 
     */
    create<T extends SeatReservationCreateArgs>(args: SelectSubset<T, SeatReservationCreateArgs<ExtArgs>>): Prisma__SeatReservationClient<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SeatReservations.
     * @param {SeatReservationCreateManyArgs} args - Arguments to create many SeatReservations.
     * @example
     * // Create many SeatReservations
     * const seatReservation = await prisma.seatReservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeatReservationCreateManyArgs>(args?: SelectSubset<T, SeatReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SeatReservations and returns the data saved in the database.
     * @param {SeatReservationCreateManyAndReturnArgs} args - Arguments to create many SeatReservations.
     * @example
     * // Create many SeatReservations
     * const seatReservation = await prisma.seatReservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SeatReservations and only return the `id`
     * const seatReservationWithIdOnly = await prisma.seatReservation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SeatReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, SeatReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SeatReservation.
     * @param {SeatReservationDeleteArgs} args - Arguments to delete one SeatReservation.
     * @example
     * // Delete one SeatReservation
     * const SeatReservation = await prisma.seatReservation.delete({
     *   where: {
     *     // ... filter to delete one SeatReservation
     *   }
     * })
     * 
     */
    delete<T extends SeatReservationDeleteArgs>(args: SelectSubset<T, SeatReservationDeleteArgs<ExtArgs>>): Prisma__SeatReservationClient<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SeatReservation.
     * @param {SeatReservationUpdateArgs} args - Arguments to update one SeatReservation.
     * @example
     * // Update one SeatReservation
     * const seatReservation = await prisma.seatReservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeatReservationUpdateArgs>(args: SelectSubset<T, SeatReservationUpdateArgs<ExtArgs>>): Prisma__SeatReservationClient<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SeatReservations.
     * @param {SeatReservationDeleteManyArgs} args - Arguments to filter SeatReservations to delete.
     * @example
     * // Delete a few SeatReservations
     * const { count } = await prisma.seatReservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeatReservationDeleteManyArgs>(args?: SelectSubset<T, SeatReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeatReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeatReservations
     * const seatReservation = await prisma.seatReservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeatReservationUpdateManyArgs>(args: SelectSubset<T, SeatReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SeatReservation.
     * @param {SeatReservationUpsertArgs} args - Arguments to update or create a SeatReservation.
     * @example
     * // Update or create a SeatReservation
     * const seatReservation = await prisma.seatReservation.upsert({
     *   create: {
     *     // ... data to create a SeatReservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeatReservation we want to update
     *   }
     * })
     */
    upsert<T extends SeatReservationUpsertArgs>(args: SelectSubset<T, SeatReservationUpsertArgs<ExtArgs>>): Prisma__SeatReservationClient<$Result.GetResult<Prisma.$SeatReservationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SeatReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatReservationCountArgs} args - Arguments to filter SeatReservations to count.
     * @example
     * // Count the number of SeatReservations
     * const count = await prisma.seatReservation.count({
     *   where: {
     *     // ... the filter for the SeatReservations we want to count
     *   }
     * })
    **/
    count<T extends SeatReservationCountArgs>(
      args?: Subset<T, SeatReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeatReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SeatReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeatReservationAggregateArgs>(args: Subset<T, SeatReservationAggregateArgs>): Prisma.PrismaPromise<GetSeatReservationAggregateType<T>>

    /**
     * Group by SeatReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeatReservationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeatReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeatReservationGroupByArgs['orderBy'] }
        : { orderBy?: SeatReservationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeatReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeatReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SeatReservation model
   */
  readonly fields: SeatReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SeatReservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeatReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    showtime<T extends ShowtimeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShowtimeDefaultArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    seat<T extends SeatDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SeatDefaultArgs<ExtArgs>>): Prisma__SeatClient<$Result.GetResult<Prisma.$SeatPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SeatReservation model
   */ 
  interface SeatReservationFieldRefs {
    readonly id: FieldRef<"SeatReservation", 'String'>
    readonly showtimeId: FieldRef<"SeatReservation", 'String'>
    readonly seatId: FieldRef<"SeatReservation", 'String'>
    readonly status: FieldRef<"SeatReservation", 'String'>
    readonly heldBy: FieldRef<"SeatReservation", 'String'>
    readonly heldExpiresAt: FieldRef<"SeatReservation", 'DateTime'>
    readonly bookingId: FieldRef<"SeatReservation", 'String'>
    readonly createdAt: FieldRef<"SeatReservation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SeatReservation findUnique
   */
  export type SeatReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    /**
     * Filter, which SeatReservation to fetch.
     */
    where: SeatReservationWhereUniqueInput
  }

  /**
   * SeatReservation findUniqueOrThrow
   */
  export type SeatReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    /**
     * Filter, which SeatReservation to fetch.
     */
    where: SeatReservationWhereUniqueInput
  }

  /**
   * SeatReservation findFirst
   */
  export type SeatReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    /**
     * Filter, which SeatReservation to fetch.
     */
    where?: SeatReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeatReservations to fetch.
     */
    orderBy?: SeatReservationOrderByWithRelationInput | SeatReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeatReservations.
     */
    cursor?: SeatReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeatReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeatReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeatReservations.
     */
    distinct?: SeatReservationScalarFieldEnum | SeatReservationScalarFieldEnum[]
  }

  /**
   * SeatReservation findFirstOrThrow
   */
  export type SeatReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    /**
     * Filter, which SeatReservation to fetch.
     */
    where?: SeatReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeatReservations to fetch.
     */
    orderBy?: SeatReservationOrderByWithRelationInput | SeatReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeatReservations.
     */
    cursor?: SeatReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeatReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeatReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeatReservations.
     */
    distinct?: SeatReservationScalarFieldEnum | SeatReservationScalarFieldEnum[]
  }

  /**
   * SeatReservation findMany
   */
  export type SeatReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    /**
     * Filter, which SeatReservations to fetch.
     */
    where?: SeatReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeatReservations to fetch.
     */
    orderBy?: SeatReservationOrderByWithRelationInput | SeatReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SeatReservations.
     */
    cursor?: SeatReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeatReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeatReservations.
     */
    skip?: number
    distinct?: SeatReservationScalarFieldEnum | SeatReservationScalarFieldEnum[]
  }

  /**
   * SeatReservation create
   */
  export type SeatReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    /**
     * The data needed to create a SeatReservation.
     */
    data: XOR<SeatReservationCreateInput, SeatReservationUncheckedCreateInput>
  }

  /**
   * SeatReservation createMany
   */
  export type SeatReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeatReservations.
     */
    data: SeatReservationCreateManyInput | SeatReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeatReservation createManyAndReturn
   */
  export type SeatReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SeatReservations.
     */
    data: SeatReservationCreateManyInput | SeatReservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SeatReservation update
   */
  export type SeatReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    /**
     * The data needed to update a SeatReservation.
     */
    data: XOR<SeatReservationUpdateInput, SeatReservationUncheckedUpdateInput>
    /**
     * Choose, which SeatReservation to update.
     */
    where: SeatReservationWhereUniqueInput
  }

  /**
   * SeatReservation updateMany
   */
  export type SeatReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SeatReservations.
     */
    data: XOR<SeatReservationUpdateManyMutationInput, SeatReservationUncheckedUpdateManyInput>
    /**
     * Filter which SeatReservations to update
     */
    where?: SeatReservationWhereInput
  }

  /**
   * SeatReservation upsert
   */
  export type SeatReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    /**
     * The filter to search for the SeatReservation to update in case it exists.
     */
    where: SeatReservationWhereUniqueInput
    /**
     * In case the SeatReservation found by the `where` argument doesn't exist, create a new SeatReservation with this data.
     */
    create: XOR<SeatReservationCreateInput, SeatReservationUncheckedCreateInput>
    /**
     * In case the SeatReservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeatReservationUpdateInput, SeatReservationUncheckedUpdateInput>
  }

  /**
   * SeatReservation delete
   */
  export type SeatReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
    /**
     * Filter which SeatReservation to delete.
     */
    where: SeatReservationWhereUniqueInput
  }

  /**
   * SeatReservation deleteMany
   */
  export type SeatReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeatReservations to delete
     */
    where?: SeatReservationWhereInput
  }

  /**
   * SeatReservation without action
   */
  export type SeatReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeatReservation
     */
    select?: SeatReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeatReservationInclude<ExtArgs> | null
  }


  /**
   * Model Booking
   */

  export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  export type BookingAvgAggregateOutputType = {
    subtotal: Decimal | null
    convenienceFee: Decimal | null
    tax: Decimal | null
    totalAmount: Decimal | null
    refundAmount: Decimal | null
    cancellationFee: Decimal | null
  }

  export type BookingSumAggregateOutputType = {
    subtotal: Decimal | null
    convenienceFee: Decimal | null
    tax: Decimal | null
    totalAmount: Decimal | null
    refundAmount: Decimal | null
    cancellationFee: Decimal | null
  }

  export type BookingMinAggregateOutputType = {
    id: string | null
    userId: string | null
    showtimeId: string | null
    customerName: string | null
    customerEmail: string | null
    customerPhone: string | null
    subtotal: Decimal | null
    convenienceFee: Decimal | null
    tax: Decimal | null
    totalAmount: Decimal | null
    paymentMethod: string | null
    status: string | null
    refundStatus: string | null
    bookedAt: Date | null
    cancelledAt: Date | null
    refundAmount: Decimal | null
    cancellationFee: Decimal | null
    refundId: string | null
    bookingRef: string | null
  }

  export type BookingMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    showtimeId: string | null
    customerName: string | null
    customerEmail: string | null
    customerPhone: string | null
    subtotal: Decimal | null
    convenienceFee: Decimal | null
    tax: Decimal | null
    totalAmount: Decimal | null
    paymentMethod: string | null
    status: string | null
    refundStatus: string | null
    bookedAt: Date | null
    cancelledAt: Date | null
    refundAmount: Decimal | null
    cancellationFee: Decimal | null
    refundId: string | null
    bookingRef: string | null
  }

  export type BookingCountAggregateOutputType = {
    id: number
    userId: number
    showtimeId: number
    customerName: number
    customerEmail: number
    customerPhone: number
    subtotal: number
    convenienceFee: number
    tax: number
    totalAmount: number
    paymentMethod: number
    status: number
    refundStatus: number
    bookedAt: number
    cancelledAt: number
    refundAmount: number
    cancellationFee: number
    refundId: number
    bookingRef: number
    _all: number
  }


  export type BookingAvgAggregateInputType = {
    subtotal?: true
    convenienceFee?: true
    tax?: true
    totalAmount?: true
    refundAmount?: true
    cancellationFee?: true
  }

  export type BookingSumAggregateInputType = {
    subtotal?: true
    convenienceFee?: true
    tax?: true
    totalAmount?: true
    refundAmount?: true
    cancellationFee?: true
  }

  export type BookingMinAggregateInputType = {
    id?: true
    userId?: true
    showtimeId?: true
    customerName?: true
    customerEmail?: true
    customerPhone?: true
    subtotal?: true
    convenienceFee?: true
    tax?: true
    totalAmount?: true
    paymentMethod?: true
    status?: true
    refundStatus?: true
    bookedAt?: true
    cancelledAt?: true
    refundAmount?: true
    cancellationFee?: true
    refundId?: true
    bookingRef?: true
  }

  export type BookingMaxAggregateInputType = {
    id?: true
    userId?: true
    showtimeId?: true
    customerName?: true
    customerEmail?: true
    customerPhone?: true
    subtotal?: true
    convenienceFee?: true
    tax?: true
    totalAmount?: true
    paymentMethod?: true
    status?: true
    refundStatus?: true
    bookedAt?: true
    cancelledAt?: true
    refundAmount?: true
    cancellationFee?: true
    refundId?: true
    bookingRef?: true
  }

  export type BookingCountAggregateInputType = {
    id?: true
    userId?: true
    showtimeId?: true
    customerName?: true
    customerEmail?: true
    customerPhone?: true
    subtotal?: true
    convenienceFee?: true
    tax?: true
    totalAmount?: true
    paymentMethod?: true
    status?: true
    refundStatus?: true
    bookedAt?: true
    cancelledAt?: true
    refundAmount?: true
    cancellationFee?: true
    refundId?: true
    bookingRef?: true
    _all?: true
  }

  export type BookingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Booking to aggregate.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookings
    **/
    _count?: true | BookingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingMaxAggregateInputType
  }

  export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
        [P in keyof T & keyof AggregateBooking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooking[P]>
      : GetScalarType<T[P], AggregateBooking[P]>
  }




  export type BookingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithAggregationInput | BookingOrderByWithAggregationInput[]
    by: BookingScalarFieldEnum[] | BookingScalarFieldEnum
    having?: BookingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingCountAggregateInputType | true
    _avg?: BookingAvgAggregateInputType
    _sum?: BookingSumAggregateInputType
    _min?: BookingMinAggregateInputType
    _max?: BookingMaxAggregateInputType
  }

  export type BookingGroupByOutputType = {
    id: string
    userId: string | null
    showtimeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal
    convenienceFee: Decimal
    tax: Decimal
    totalAmount: Decimal
    paymentMethod: string
    status: string
    refundStatus: string
    bookedAt: Date
    cancelledAt: Date | null
    refundAmount: Decimal
    cancellationFee: Decimal
    refundId: string | null
    bookingRef: string | null
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingGroupByOutputType[P]>
            : GetScalarType<T[P], BookingGroupByOutputType[P]>
        }
      >
    >


  export type BookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    showtimeId?: boolean
    customerName?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    subtotal?: boolean
    convenienceFee?: boolean
    tax?: boolean
    totalAmount?: boolean
    paymentMethod?: boolean
    status?: boolean
    refundStatus?: boolean
    bookedAt?: boolean
    cancelledAt?: boolean
    refundAmount?: boolean
    cancellationFee?: boolean
    refundId?: boolean
    bookingRef?: boolean
    user?: boolean | Booking$userArgs<ExtArgs>
    showtime?: boolean | ShowtimeDefaultArgs<ExtArgs>
    payment?: boolean | Booking$paymentArgs<ExtArgs>
    seats?: boolean | Booking$seatsArgs<ExtArgs>
    addons?: boolean | Booking$addonsArgs<ExtArgs>
    auditLogs?: boolean | Booking$auditLogsArgs<ExtArgs>
    _count?: boolean | BookingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    showtimeId?: boolean
    customerName?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    subtotal?: boolean
    convenienceFee?: boolean
    tax?: boolean
    totalAmount?: boolean
    paymentMethod?: boolean
    status?: boolean
    refundStatus?: boolean
    bookedAt?: boolean
    cancelledAt?: boolean
    refundAmount?: boolean
    cancellationFee?: boolean
    refundId?: boolean
    bookingRef?: boolean
    user?: boolean | Booking$userArgs<ExtArgs>
    showtime?: boolean | ShowtimeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectScalar = {
    id?: boolean
    userId?: boolean
    showtimeId?: boolean
    customerName?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    subtotal?: boolean
    convenienceFee?: boolean
    tax?: boolean
    totalAmount?: boolean
    paymentMethod?: boolean
    status?: boolean
    refundStatus?: boolean
    bookedAt?: boolean
    cancelledAt?: boolean
    refundAmount?: boolean
    cancellationFee?: boolean
    refundId?: boolean
    bookingRef?: boolean
  }

  export type BookingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Booking$userArgs<ExtArgs>
    showtime?: boolean | ShowtimeDefaultArgs<ExtArgs>
    payment?: boolean | Booking$paymentArgs<ExtArgs>
    seats?: boolean | Booking$seatsArgs<ExtArgs>
    addons?: boolean | Booking$addonsArgs<ExtArgs>
    auditLogs?: boolean | Booking$auditLogsArgs<ExtArgs>
    _count?: boolean | BookingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BookingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Booking$userArgs<ExtArgs>
    showtime?: boolean | ShowtimeDefaultArgs<ExtArgs>
  }

  export type $BookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Booking"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      showtime: Prisma.$ShowtimePayload<ExtArgs>
      payment: Prisma.$PaymentPayload<ExtArgs> | null
      seats: Prisma.$BookingSeatPayload<ExtArgs>[]
      addons: Prisma.$BookingAddonPayload<ExtArgs>[]
      auditLogs: Prisma.$CancellationAuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      showtimeId: string
      customerName: string
      customerEmail: string
      customerPhone: string
      subtotal: Prisma.Decimal
      convenienceFee: Prisma.Decimal
      tax: Prisma.Decimal
      totalAmount: Prisma.Decimal
      paymentMethod: string
      status: string
      refundStatus: string
      bookedAt: Date
      cancelledAt: Date | null
      refundAmount: Prisma.Decimal
      cancellationFee: Prisma.Decimal
      refundId: string | null
      bookingRef: string | null
    }, ExtArgs["result"]["booking"]>
    composites: {}
  }

  type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> = $Result.GetResult<Prisma.$BookingPayload, S>

  type BookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BookingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BookingCountAggregateInputType | true
    }

  export interface BookingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Booking'], meta: { name: 'Booking' } }
    /**
     * Find zero or one Booking that matches the filter.
     * @param {BookingFindUniqueArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingFindUniqueArgs>(args: SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Booking that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BookingFindUniqueOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Booking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingFindFirstArgs>(args?: SelectSubset<T, BookingFindFirstArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Booking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Bookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookings
     * const bookings = await prisma.booking.findMany()
     * 
     * // Get first 10 Bookings
     * const bookings = await prisma.booking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingWithIdOnly = await prisma.booking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingFindManyArgs>(args?: SelectSubset<T, BookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Booking.
     * @param {BookingCreateArgs} args - Arguments to create a Booking.
     * @example
     * // Create one Booking
     * const Booking = await prisma.booking.create({
     *   data: {
     *     // ... data to create a Booking
     *   }
     * })
     * 
     */
    create<T extends BookingCreateArgs>(args: SelectSubset<T, BookingCreateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Bookings.
     * @param {BookingCreateManyArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingCreateManyArgs>(args?: SelectSubset<T, BookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookings and returns the data saved in the database.
     * @param {BookingCreateManyAndReturnArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Booking.
     * @param {BookingDeleteArgs} args - Arguments to delete one Booking.
     * @example
     * // Delete one Booking
     * const Booking = await prisma.booking.delete({
     *   where: {
     *     // ... filter to delete one Booking
     *   }
     * })
     * 
     */
    delete<T extends BookingDeleteArgs>(args: SelectSubset<T, BookingDeleteArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Booking.
     * @param {BookingUpdateArgs} args - Arguments to update one Booking.
     * @example
     * // Update one Booking
     * const booking = await prisma.booking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingUpdateArgs>(args: SelectSubset<T, BookingUpdateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Bookings.
     * @param {BookingDeleteManyArgs} args - Arguments to filter Bookings to delete.
     * @example
     * // Delete a few Bookings
     * const { count } = await prisma.booking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingDeleteManyArgs>(args?: SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingUpdateManyArgs>(args: SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Booking.
     * @param {BookingUpsertArgs} args - Arguments to update or create a Booking.
     * @example
     * // Update or create a Booking
     * const booking = await prisma.booking.upsert({
     *   create: {
     *     // ... data to create a Booking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Booking we want to update
     *   }
     * })
     */
    upsert<T extends BookingUpsertArgs>(args: SelectSubset<T, BookingUpsertArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingCountArgs} args - Arguments to filter Bookings to count.
     * @example
     * // Count the number of Bookings
     * const count = await prisma.booking.count({
     *   where: {
     *     // ... the filter for the Bookings we want to count
     *   }
     * })
    **/
    count<T extends BookingCountArgs>(
      args?: Subset<T, BookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingAggregateArgs>(args: Subset<T, BookingAggregateArgs>): Prisma.PrismaPromise<GetBookingAggregateType<T>>

    /**
     * Group by Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingGroupByArgs['orderBy'] }
        : { orderBy?: BookingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Booking model
   */
  readonly fields: BookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Booking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Booking$userArgs<ExtArgs> = {}>(args?: Subset<T, Booking$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    showtime<T extends ShowtimeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShowtimeDefaultArgs<ExtArgs>>): Prisma__ShowtimeClient<$Result.GetResult<Prisma.$ShowtimePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    payment<T extends Booking$paymentArgs<ExtArgs> = {}>(args?: Subset<T, Booking$paymentArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    seats<T extends Booking$seatsArgs<ExtArgs> = {}>(args?: Subset<T, Booking$seatsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "findMany"> | Null>
    addons<T extends Booking$addonsArgs<ExtArgs> = {}>(args?: Subset<T, Booking$addonsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogs<T extends Booking$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Booking$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Booking model
   */ 
  interface BookingFieldRefs {
    readonly id: FieldRef<"Booking", 'String'>
    readonly userId: FieldRef<"Booking", 'String'>
    readonly showtimeId: FieldRef<"Booking", 'String'>
    readonly customerName: FieldRef<"Booking", 'String'>
    readonly customerEmail: FieldRef<"Booking", 'String'>
    readonly customerPhone: FieldRef<"Booking", 'String'>
    readonly subtotal: FieldRef<"Booking", 'Decimal'>
    readonly convenienceFee: FieldRef<"Booking", 'Decimal'>
    readonly tax: FieldRef<"Booking", 'Decimal'>
    readonly totalAmount: FieldRef<"Booking", 'Decimal'>
    readonly paymentMethod: FieldRef<"Booking", 'String'>
    readonly status: FieldRef<"Booking", 'String'>
    readonly refundStatus: FieldRef<"Booking", 'String'>
    readonly bookedAt: FieldRef<"Booking", 'DateTime'>
    readonly cancelledAt: FieldRef<"Booking", 'DateTime'>
    readonly refundAmount: FieldRef<"Booking", 'Decimal'>
    readonly cancellationFee: FieldRef<"Booking", 'Decimal'>
    readonly refundId: FieldRef<"Booking", 'String'>
    readonly bookingRef: FieldRef<"Booking", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Booking findUnique
   */
  export type BookingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findUniqueOrThrow
   */
  export type BookingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findFirst
   */
  export type BookingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findFirstOrThrow
   */
  export type BookingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findMany
   */
  export type BookingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Bookings to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking create
   */
  export type BookingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to create a Booking.
     */
    data: XOR<BookingCreateInput, BookingUncheckedCreateInput>
  }

  /**
   * Booking createMany
   */
  export type BookingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Booking createManyAndReturn
   */
  export type BookingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking update
   */
  export type BookingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to update a Booking.
     */
    data: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
    /**
     * Choose, which Booking to update.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking updateMany
   */
  export type BookingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
  }

  /**
   * Booking upsert
   */
  export type BookingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The filter to search for the Booking to update in case it exists.
     */
    where: BookingWhereUniqueInput
    /**
     * In case the Booking found by the `where` argument doesn't exist, create a new Booking with this data.
     */
    create: XOR<BookingCreateInput, BookingUncheckedCreateInput>
    /**
     * In case the Booking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
  }

  /**
   * Booking delete
   */
  export type BookingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter which Booking to delete.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking deleteMany
   */
  export type BookingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookings to delete
     */
    where?: BookingWhereInput
  }

  /**
   * Booking.user
   */
  export type Booking$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Booking.payment
   */
  export type Booking$paymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
  }

  /**
   * Booking.seats
   */
  export type Booking$seatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    where?: BookingSeatWhereInput
    orderBy?: BookingSeatOrderByWithRelationInput | BookingSeatOrderByWithRelationInput[]
    cursor?: BookingSeatWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingSeatScalarFieldEnum | BookingSeatScalarFieldEnum[]
  }

  /**
   * Booking.addons
   */
  export type Booking$addonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    where?: BookingAddonWhereInput
    orderBy?: BookingAddonOrderByWithRelationInput | BookingAddonOrderByWithRelationInput[]
    cursor?: BookingAddonWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingAddonScalarFieldEnum | BookingAddonScalarFieldEnum[]
  }

  /**
   * Booking.auditLogs
   */
  export type Booking$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    where?: CancellationAuditLogWhereInput
    orderBy?: CancellationAuditLogOrderByWithRelationInput | CancellationAuditLogOrderByWithRelationInput[]
    cursor?: CancellationAuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CancellationAuditLogScalarFieldEnum | CancellationAuditLogScalarFieldEnum[]
  }

  /**
   * Booking without action
   */
  export type BookingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
  }


  /**
   * Model BookingSeat
   */

  export type AggregateBookingSeat = {
    _count: BookingSeatCountAggregateOutputType | null
    _avg: BookingSeatAvgAggregateOutputType | null
    _sum: BookingSeatSumAggregateOutputType | null
    _min: BookingSeatMinAggregateOutputType | null
    _max: BookingSeatMaxAggregateOutputType | null
  }

  export type BookingSeatAvgAggregateOutputType = {
    id: number | null
    seatNumber: number | null
    price: Decimal | null
  }

  export type BookingSeatSumAggregateOutputType = {
    id: number | null
    seatNumber: number | null
    price: Decimal | null
  }

  export type BookingSeatMinAggregateOutputType = {
    id: number | null
    bookingId: string | null
    showtimeId: string | null
    seatId: string | null
    seatRow: string | null
    seatNumber: number | null
    tier: string | null
    price: Decimal | null
  }

  export type BookingSeatMaxAggregateOutputType = {
    id: number | null
    bookingId: string | null
    showtimeId: string | null
    seatId: string | null
    seatRow: string | null
    seatNumber: number | null
    tier: string | null
    price: Decimal | null
  }

  export type BookingSeatCountAggregateOutputType = {
    id: number
    bookingId: number
    showtimeId: number
    seatId: number
    seatRow: number
    seatNumber: number
    tier: number
    price: number
    _all: number
  }


  export type BookingSeatAvgAggregateInputType = {
    id?: true
    seatNumber?: true
    price?: true
  }

  export type BookingSeatSumAggregateInputType = {
    id?: true
    seatNumber?: true
    price?: true
  }

  export type BookingSeatMinAggregateInputType = {
    id?: true
    bookingId?: true
    showtimeId?: true
    seatId?: true
    seatRow?: true
    seatNumber?: true
    tier?: true
    price?: true
  }

  export type BookingSeatMaxAggregateInputType = {
    id?: true
    bookingId?: true
    showtimeId?: true
    seatId?: true
    seatRow?: true
    seatNumber?: true
    tier?: true
    price?: true
  }

  export type BookingSeatCountAggregateInputType = {
    id?: true
    bookingId?: true
    showtimeId?: true
    seatId?: true
    seatRow?: true
    seatNumber?: true
    tier?: true
    price?: true
    _all?: true
  }

  export type BookingSeatAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingSeat to aggregate.
     */
    where?: BookingSeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingSeats to fetch.
     */
    orderBy?: BookingSeatOrderByWithRelationInput | BookingSeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingSeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingSeats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingSeats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookingSeats
    **/
    _count?: true | BookingSeatCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingSeatAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingSeatSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingSeatMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingSeatMaxAggregateInputType
  }

  export type GetBookingSeatAggregateType<T extends BookingSeatAggregateArgs> = {
        [P in keyof T & keyof AggregateBookingSeat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookingSeat[P]>
      : GetScalarType<T[P], AggregateBookingSeat[P]>
  }




  export type BookingSeatGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingSeatWhereInput
    orderBy?: BookingSeatOrderByWithAggregationInput | BookingSeatOrderByWithAggregationInput[]
    by: BookingSeatScalarFieldEnum[] | BookingSeatScalarFieldEnum
    having?: BookingSeatScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingSeatCountAggregateInputType | true
    _avg?: BookingSeatAvgAggregateInputType
    _sum?: BookingSeatSumAggregateInputType
    _min?: BookingSeatMinAggregateInputType
    _max?: BookingSeatMaxAggregateInputType
  }

  export type BookingSeatGroupByOutputType = {
    id: number
    bookingId: string
    showtimeId: string
    seatId: string
    seatRow: string
    seatNumber: number
    tier: string
    price: Decimal
    _count: BookingSeatCountAggregateOutputType | null
    _avg: BookingSeatAvgAggregateOutputType | null
    _sum: BookingSeatSumAggregateOutputType | null
    _min: BookingSeatMinAggregateOutputType | null
    _max: BookingSeatMaxAggregateOutputType | null
  }

  type GetBookingSeatGroupByPayload<T extends BookingSeatGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingSeatGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingSeatGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingSeatGroupByOutputType[P]>
            : GetScalarType<T[P], BookingSeatGroupByOutputType[P]>
        }
      >
    >


  export type BookingSeatSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    showtimeId?: boolean
    seatId?: boolean
    seatRow?: boolean
    seatNumber?: boolean
    tier?: boolean
    price?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingSeat"]>

  export type BookingSeatSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    showtimeId?: boolean
    seatId?: boolean
    seatRow?: boolean
    seatNumber?: boolean
    tier?: boolean
    price?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingSeat"]>

  export type BookingSeatSelectScalar = {
    id?: boolean
    bookingId?: boolean
    showtimeId?: boolean
    seatId?: boolean
    seatRow?: boolean
    seatNumber?: boolean
    tier?: boolean
    price?: boolean
  }

  export type BookingSeatInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }
  export type BookingSeatIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }

  export type $BookingSeatPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookingSeat"
    objects: {
      booking: Prisma.$BookingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      bookingId: string
      showtimeId: string
      seatId: string
      seatRow: string
      seatNumber: number
      tier: string
      price: Prisma.Decimal
    }, ExtArgs["result"]["bookingSeat"]>
    composites: {}
  }

  type BookingSeatGetPayload<S extends boolean | null | undefined | BookingSeatDefaultArgs> = $Result.GetResult<Prisma.$BookingSeatPayload, S>

  type BookingSeatCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BookingSeatFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BookingSeatCountAggregateInputType | true
    }

  export interface BookingSeatDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookingSeat'], meta: { name: 'BookingSeat' } }
    /**
     * Find zero or one BookingSeat that matches the filter.
     * @param {BookingSeatFindUniqueArgs} args - Arguments to find a BookingSeat
     * @example
     * // Get one BookingSeat
     * const bookingSeat = await prisma.bookingSeat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingSeatFindUniqueArgs>(args: SelectSubset<T, BookingSeatFindUniqueArgs<ExtArgs>>): Prisma__BookingSeatClient<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BookingSeat that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BookingSeatFindUniqueOrThrowArgs} args - Arguments to find a BookingSeat
     * @example
     * // Get one BookingSeat
     * const bookingSeat = await prisma.bookingSeat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingSeatFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingSeatFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingSeatClient<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BookingSeat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingSeatFindFirstArgs} args - Arguments to find a BookingSeat
     * @example
     * // Get one BookingSeat
     * const bookingSeat = await prisma.bookingSeat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingSeatFindFirstArgs>(args?: SelectSubset<T, BookingSeatFindFirstArgs<ExtArgs>>): Prisma__BookingSeatClient<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BookingSeat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingSeatFindFirstOrThrowArgs} args - Arguments to find a BookingSeat
     * @example
     * // Get one BookingSeat
     * const bookingSeat = await prisma.bookingSeat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingSeatFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingSeatFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingSeatClient<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BookingSeats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingSeatFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookingSeats
     * const bookingSeats = await prisma.bookingSeat.findMany()
     * 
     * // Get first 10 BookingSeats
     * const bookingSeats = await prisma.bookingSeat.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingSeatWithIdOnly = await prisma.bookingSeat.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingSeatFindManyArgs>(args?: SelectSubset<T, BookingSeatFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BookingSeat.
     * @param {BookingSeatCreateArgs} args - Arguments to create a BookingSeat.
     * @example
     * // Create one BookingSeat
     * const BookingSeat = await prisma.bookingSeat.create({
     *   data: {
     *     // ... data to create a BookingSeat
     *   }
     * })
     * 
     */
    create<T extends BookingSeatCreateArgs>(args: SelectSubset<T, BookingSeatCreateArgs<ExtArgs>>): Prisma__BookingSeatClient<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BookingSeats.
     * @param {BookingSeatCreateManyArgs} args - Arguments to create many BookingSeats.
     * @example
     * // Create many BookingSeats
     * const bookingSeat = await prisma.bookingSeat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingSeatCreateManyArgs>(args?: SelectSubset<T, BookingSeatCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookingSeats and returns the data saved in the database.
     * @param {BookingSeatCreateManyAndReturnArgs} args - Arguments to create many BookingSeats.
     * @example
     * // Create many BookingSeats
     * const bookingSeat = await prisma.bookingSeat.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookingSeats and only return the `id`
     * const bookingSeatWithIdOnly = await prisma.bookingSeat.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingSeatCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingSeatCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BookingSeat.
     * @param {BookingSeatDeleteArgs} args - Arguments to delete one BookingSeat.
     * @example
     * // Delete one BookingSeat
     * const BookingSeat = await prisma.bookingSeat.delete({
     *   where: {
     *     // ... filter to delete one BookingSeat
     *   }
     * })
     * 
     */
    delete<T extends BookingSeatDeleteArgs>(args: SelectSubset<T, BookingSeatDeleteArgs<ExtArgs>>): Prisma__BookingSeatClient<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BookingSeat.
     * @param {BookingSeatUpdateArgs} args - Arguments to update one BookingSeat.
     * @example
     * // Update one BookingSeat
     * const bookingSeat = await prisma.bookingSeat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingSeatUpdateArgs>(args: SelectSubset<T, BookingSeatUpdateArgs<ExtArgs>>): Prisma__BookingSeatClient<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BookingSeats.
     * @param {BookingSeatDeleteManyArgs} args - Arguments to filter BookingSeats to delete.
     * @example
     * // Delete a few BookingSeats
     * const { count } = await prisma.bookingSeat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingSeatDeleteManyArgs>(args?: SelectSubset<T, BookingSeatDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingSeats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingSeatUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookingSeats
     * const bookingSeat = await prisma.bookingSeat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingSeatUpdateManyArgs>(args: SelectSubset<T, BookingSeatUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BookingSeat.
     * @param {BookingSeatUpsertArgs} args - Arguments to update or create a BookingSeat.
     * @example
     * // Update or create a BookingSeat
     * const bookingSeat = await prisma.bookingSeat.upsert({
     *   create: {
     *     // ... data to create a BookingSeat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookingSeat we want to update
     *   }
     * })
     */
    upsert<T extends BookingSeatUpsertArgs>(args: SelectSubset<T, BookingSeatUpsertArgs<ExtArgs>>): Prisma__BookingSeatClient<$Result.GetResult<Prisma.$BookingSeatPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BookingSeats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingSeatCountArgs} args - Arguments to filter BookingSeats to count.
     * @example
     * // Count the number of BookingSeats
     * const count = await prisma.bookingSeat.count({
     *   where: {
     *     // ... the filter for the BookingSeats we want to count
     *   }
     * })
    **/
    count<T extends BookingSeatCountArgs>(
      args?: Subset<T, BookingSeatCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingSeatCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookingSeat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingSeatAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingSeatAggregateArgs>(args: Subset<T, BookingSeatAggregateArgs>): Prisma.PrismaPromise<GetBookingSeatAggregateType<T>>

    /**
     * Group by BookingSeat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingSeatGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingSeatGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingSeatGroupByArgs['orderBy'] }
        : { orderBy?: BookingSeatGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingSeatGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingSeatGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookingSeat model
   */
  readonly fields: BookingSeatFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookingSeat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingSeatClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    booking<T extends BookingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookingDefaultArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BookingSeat model
   */ 
  interface BookingSeatFieldRefs {
    readonly id: FieldRef<"BookingSeat", 'Int'>
    readonly bookingId: FieldRef<"BookingSeat", 'String'>
    readonly showtimeId: FieldRef<"BookingSeat", 'String'>
    readonly seatId: FieldRef<"BookingSeat", 'String'>
    readonly seatRow: FieldRef<"BookingSeat", 'String'>
    readonly seatNumber: FieldRef<"BookingSeat", 'Int'>
    readonly tier: FieldRef<"BookingSeat", 'String'>
    readonly price: FieldRef<"BookingSeat", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * BookingSeat findUnique
   */
  export type BookingSeatFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    /**
     * Filter, which BookingSeat to fetch.
     */
    where: BookingSeatWhereUniqueInput
  }

  /**
   * BookingSeat findUniqueOrThrow
   */
  export type BookingSeatFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    /**
     * Filter, which BookingSeat to fetch.
     */
    where: BookingSeatWhereUniqueInput
  }

  /**
   * BookingSeat findFirst
   */
  export type BookingSeatFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    /**
     * Filter, which BookingSeat to fetch.
     */
    where?: BookingSeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingSeats to fetch.
     */
    orderBy?: BookingSeatOrderByWithRelationInput | BookingSeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingSeats.
     */
    cursor?: BookingSeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingSeats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingSeats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingSeats.
     */
    distinct?: BookingSeatScalarFieldEnum | BookingSeatScalarFieldEnum[]
  }

  /**
   * BookingSeat findFirstOrThrow
   */
  export type BookingSeatFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    /**
     * Filter, which BookingSeat to fetch.
     */
    where?: BookingSeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingSeats to fetch.
     */
    orderBy?: BookingSeatOrderByWithRelationInput | BookingSeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingSeats.
     */
    cursor?: BookingSeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingSeats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingSeats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingSeats.
     */
    distinct?: BookingSeatScalarFieldEnum | BookingSeatScalarFieldEnum[]
  }

  /**
   * BookingSeat findMany
   */
  export type BookingSeatFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    /**
     * Filter, which BookingSeats to fetch.
     */
    where?: BookingSeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingSeats to fetch.
     */
    orderBy?: BookingSeatOrderByWithRelationInput | BookingSeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookingSeats.
     */
    cursor?: BookingSeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingSeats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingSeats.
     */
    skip?: number
    distinct?: BookingSeatScalarFieldEnum | BookingSeatScalarFieldEnum[]
  }

  /**
   * BookingSeat create
   */
  export type BookingSeatCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    /**
     * The data needed to create a BookingSeat.
     */
    data: XOR<BookingSeatCreateInput, BookingSeatUncheckedCreateInput>
  }

  /**
   * BookingSeat createMany
   */
  export type BookingSeatCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookingSeats.
     */
    data: BookingSeatCreateManyInput | BookingSeatCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingSeat createManyAndReturn
   */
  export type BookingSeatCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BookingSeats.
     */
    data: BookingSeatCreateManyInput | BookingSeatCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookingSeat update
   */
  export type BookingSeatUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    /**
     * The data needed to update a BookingSeat.
     */
    data: XOR<BookingSeatUpdateInput, BookingSeatUncheckedUpdateInput>
    /**
     * Choose, which BookingSeat to update.
     */
    where: BookingSeatWhereUniqueInput
  }

  /**
   * BookingSeat updateMany
   */
  export type BookingSeatUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookingSeats.
     */
    data: XOR<BookingSeatUpdateManyMutationInput, BookingSeatUncheckedUpdateManyInput>
    /**
     * Filter which BookingSeats to update
     */
    where?: BookingSeatWhereInput
  }

  /**
   * BookingSeat upsert
   */
  export type BookingSeatUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    /**
     * The filter to search for the BookingSeat to update in case it exists.
     */
    where: BookingSeatWhereUniqueInput
    /**
     * In case the BookingSeat found by the `where` argument doesn't exist, create a new BookingSeat with this data.
     */
    create: XOR<BookingSeatCreateInput, BookingSeatUncheckedCreateInput>
    /**
     * In case the BookingSeat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingSeatUpdateInput, BookingSeatUncheckedUpdateInput>
  }

  /**
   * BookingSeat delete
   */
  export type BookingSeatDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
    /**
     * Filter which BookingSeat to delete.
     */
    where: BookingSeatWhereUniqueInput
  }

  /**
   * BookingSeat deleteMany
   */
  export type BookingSeatDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingSeats to delete
     */
    where?: BookingSeatWhereInput
  }

  /**
   * BookingSeat without action
   */
  export type BookingSeatDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingSeat
     */
    select?: BookingSeatSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingSeatInclude<ExtArgs> | null
  }


  /**
   * Model BookingAddon
   */

  export type AggregateBookingAddon = {
    _count: BookingAddonCountAggregateOutputType | null
    _avg: BookingAddonAvgAggregateOutputType | null
    _sum: BookingAddonSumAggregateOutputType | null
    _min: BookingAddonMinAggregateOutputType | null
    _max: BookingAddonMaxAggregateOutputType | null
  }

  export type BookingAddonAvgAggregateOutputType = {
    id: number | null
    price: Decimal | null
    quantity: number | null
  }

  export type BookingAddonSumAggregateOutputType = {
    id: number | null
    price: Decimal | null
    quantity: number | null
  }

  export type BookingAddonMinAggregateOutputType = {
    id: number | null
    bookingId: string | null
    addonId: string | null
    name: string | null
    price: Decimal | null
    quantity: number | null
  }

  export type BookingAddonMaxAggregateOutputType = {
    id: number | null
    bookingId: string | null
    addonId: string | null
    name: string | null
    price: Decimal | null
    quantity: number | null
  }

  export type BookingAddonCountAggregateOutputType = {
    id: number
    bookingId: number
    addonId: number
    name: number
    price: number
    quantity: number
    _all: number
  }


  export type BookingAddonAvgAggregateInputType = {
    id?: true
    price?: true
    quantity?: true
  }

  export type BookingAddonSumAggregateInputType = {
    id?: true
    price?: true
    quantity?: true
  }

  export type BookingAddonMinAggregateInputType = {
    id?: true
    bookingId?: true
    addonId?: true
    name?: true
    price?: true
    quantity?: true
  }

  export type BookingAddonMaxAggregateInputType = {
    id?: true
    bookingId?: true
    addonId?: true
    name?: true
    price?: true
    quantity?: true
  }

  export type BookingAddonCountAggregateInputType = {
    id?: true
    bookingId?: true
    addonId?: true
    name?: true
    price?: true
    quantity?: true
    _all?: true
  }

  export type BookingAddonAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingAddon to aggregate.
     */
    where?: BookingAddonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingAddons to fetch.
     */
    orderBy?: BookingAddonOrderByWithRelationInput | BookingAddonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingAddonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingAddons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingAddons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookingAddons
    **/
    _count?: true | BookingAddonCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingAddonAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingAddonSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingAddonMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingAddonMaxAggregateInputType
  }

  export type GetBookingAddonAggregateType<T extends BookingAddonAggregateArgs> = {
        [P in keyof T & keyof AggregateBookingAddon]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookingAddon[P]>
      : GetScalarType<T[P], AggregateBookingAddon[P]>
  }




  export type BookingAddonGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingAddonWhereInput
    orderBy?: BookingAddonOrderByWithAggregationInput | BookingAddonOrderByWithAggregationInput[]
    by: BookingAddonScalarFieldEnum[] | BookingAddonScalarFieldEnum
    having?: BookingAddonScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingAddonCountAggregateInputType | true
    _avg?: BookingAddonAvgAggregateInputType
    _sum?: BookingAddonSumAggregateInputType
    _min?: BookingAddonMinAggregateInputType
    _max?: BookingAddonMaxAggregateInputType
  }

  export type BookingAddonGroupByOutputType = {
    id: number
    bookingId: string
    addonId: string
    name: string
    price: Decimal
    quantity: number
    _count: BookingAddonCountAggregateOutputType | null
    _avg: BookingAddonAvgAggregateOutputType | null
    _sum: BookingAddonSumAggregateOutputType | null
    _min: BookingAddonMinAggregateOutputType | null
    _max: BookingAddonMaxAggregateOutputType | null
  }

  type GetBookingAddonGroupByPayload<T extends BookingAddonGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingAddonGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingAddonGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingAddonGroupByOutputType[P]>
            : GetScalarType<T[P], BookingAddonGroupByOutputType[P]>
        }
      >
    >


  export type BookingAddonSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    addonId?: boolean
    name?: boolean
    price?: boolean
    quantity?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingAddon"]>

  export type BookingAddonSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    addonId?: boolean
    name?: boolean
    price?: boolean
    quantity?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingAddon"]>

  export type BookingAddonSelectScalar = {
    id?: boolean
    bookingId?: boolean
    addonId?: boolean
    name?: boolean
    price?: boolean
    quantity?: boolean
  }

  export type BookingAddonInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }
  export type BookingAddonIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }

  export type $BookingAddonPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookingAddon"
    objects: {
      booking: Prisma.$BookingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      bookingId: string
      addonId: string
      name: string
      price: Prisma.Decimal
      quantity: number
    }, ExtArgs["result"]["bookingAddon"]>
    composites: {}
  }

  type BookingAddonGetPayload<S extends boolean | null | undefined | BookingAddonDefaultArgs> = $Result.GetResult<Prisma.$BookingAddonPayload, S>

  type BookingAddonCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BookingAddonFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BookingAddonCountAggregateInputType | true
    }

  export interface BookingAddonDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookingAddon'], meta: { name: 'BookingAddon' } }
    /**
     * Find zero or one BookingAddon that matches the filter.
     * @param {BookingAddonFindUniqueArgs} args - Arguments to find a BookingAddon
     * @example
     * // Get one BookingAddon
     * const bookingAddon = await prisma.bookingAddon.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingAddonFindUniqueArgs>(args: SelectSubset<T, BookingAddonFindUniqueArgs<ExtArgs>>): Prisma__BookingAddonClient<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BookingAddon that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BookingAddonFindUniqueOrThrowArgs} args - Arguments to find a BookingAddon
     * @example
     * // Get one BookingAddon
     * const bookingAddon = await prisma.bookingAddon.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingAddonFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingAddonFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingAddonClient<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BookingAddon that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAddonFindFirstArgs} args - Arguments to find a BookingAddon
     * @example
     * // Get one BookingAddon
     * const bookingAddon = await prisma.bookingAddon.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingAddonFindFirstArgs>(args?: SelectSubset<T, BookingAddonFindFirstArgs<ExtArgs>>): Prisma__BookingAddonClient<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BookingAddon that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAddonFindFirstOrThrowArgs} args - Arguments to find a BookingAddon
     * @example
     * // Get one BookingAddon
     * const bookingAddon = await prisma.bookingAddon.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingAddonFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingAddonFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingAddonClient<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BookingAddons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAddonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookingAddons
     * const bookingAddons = await prisma.bookingAddon.findMany()
     * 
     * // Get first 10 BookingAddons
     * const bookingAddons = await prisma.bookingAddon.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingAddonWithIdOnly = await prisma.bookingAddon.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingAddonFindManyArgs>(args?: SelectSubset<T, BookingAddonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BookingAddon.
     * @param {BookingAddonCreateArgs} args - Arguments to create a BookingAddon.
     * @example
     * // Create one BookingAddon
     * const BookingAddon = await prisma.bookingAddon.create({
     *   data: {
     *     // ... data to create a BookingAddon
     *   }
     * })
     * 
     */
    create<T extends BookingAddonCreateArgs>(args: SelectSubset<T, BookingAddonCreateArgs<ExtArgs>>): Prisma__BookingAddonClient<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BookingAddons.
     * @param {BookingAddonCreateManyArgs} args - Arguments to create many BookingAddons.
     * @example
     * // Create many BookingAddons
     * const bookingAddon = await prisma.bookingAddon.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingAddonCreateManyArgs>(args?: SelectSubset<T, BookingAddonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookingAddons and returns the data saved in the database.
     * @param {BookingAddonCreateManyAndReturnArgs} args - Arguments to create many BookingAddons.
     * @example
     * // Create many BookingAddons
     * const bookingAddon = await prisma.bookingAddon.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookingAddons and only return the `id`
     * const bookingAddonWithIdOnly = await prisma.bookingAddon.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingAddonCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingAddonCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BookingAddon.
     * @param {BookingAddonDeleteArgs} args - Arguments to delete one BookingAddon.
     * @example
     * // Delete one BookingAddon
     * const BookingAddon = await prisma.bookingAddon.delete({
     *   where: {
     *     // ... filter to delete one BookingAddon
     *   }
     * })
     * 
     */
    delete<T extends BookingAddonDeleteArgs>(args: SelectSubset<T, BookingAddonDeleteArgs<ExtArgs>>): Prisma__BookingAddonClient<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BookingAddon.
     * @param {BookingAddonUpdateArgs} args - Arguments to update one BookingAddon.
     * @example
     * // Update one BookingAddon
     * const bookingAddon = await prisma.bookingAddon.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingAddonUpdateArgs>(args: SelectSubset<T, BookingAddonUpdateArgs<ExtArgs>>): Prisma__BookingAddonClient<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BookingAddons.
     * @param {BookingAddonDeleteManyArgs} args - Arguments to filter BookingAddons to delete.
     * @example
     * // Delete a few BookingAddons
     * const { count } = await prisma.bookingAddon.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingAddonDeleteManyArgs>(args?: SelectSubset<T, BookingAddonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingAddons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAddonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookingAddons
     * const bookingAddon = await prisma.bookingAddon.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingAddonUpdateManyArgs>(args: SelectSubset<T, BookingAddonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BookingAddon.
     * @param {BookingAddonUpsertArgs} args - Arguments to update or create a BookingAddon.
     * @example
     * // Update or create a BookingAddon
     * const bookingAddon = await prisma.bookingAddon.upsert({
     *   create: {
     *     // ... data to create a BookingAddon
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookingAddon we want to update
     *   }
     * })
     */
    upsert<T extends BookingAddonUpsertArgs>(args: SelectSubset<T, BookingAddonUpsertArgs<ExtArgs>>): Prisma__BookingAddonClient<$Result.GetResult<Prisma.$BookingAddonPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BookingAddons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAddonCountArgs} args - Arguments to filter BookingAddons to count.
     * @example
     * // Count the number of BookingAddons
     * const count = await prisma.bookingAddon.count({
     *   where: {
     *     // ... the filter for the BookingAddons we want to count
     *   }
     * })
    **/
    count<T extends BookingAddonCountArgs>(
      args?: Subset<T, BookingAddonCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingAddonCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookingAddon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAddonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingAddonAggregateArgs>(args: Subset<T, BookingAddonAggregateArgs>): Prisma.PrismaPromise<GetBookingAddonAggregateType<T>>

    /**
     * Group by BookingAddon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAddonGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingAddonGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingAddonGroupByArgs['orderBy'] }
        : { orderBy?: BookingAddonGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingAddonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingAddonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookingAddon model
   */
  readonly fields: BookingAddonFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookingAddon.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingAddonClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    booking<T extends BookingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookingDefaultArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BookingAddon model
   */ 
  interface BookingAddonFieldRefs {
    readonly id: FieldRef<"BookingAddon", 'Int'>
    readonly bookingId: FieldRef<"BookingAddon", 'String'>
    readonly addonId: FieldRef<"BookingAddon", 'String'>
    readonly name: FieldRef<"BookingAddon", 'String'>
    readonly price: FieldRef<"BookingAddon", 'Decimal'>
    readonly quantity: FieldRef<"BookingAddon", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * BookingAddon findUnique
   */
  export type BookingAddonFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    /**
     * Filter, which BookingAddon to fetch.
     */
    where: BookingAddonWhereUniqueInput
  }

  /**
   * BookingAddon findUniqueOrThrow
   */
  export type BookingAddonFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    /**
     * Filter, which BookingAddon to fetch.
     */
    where: BookingAddonWhereUniqueInput
  }

  /**
   * BookingAddon findFirst
   */
  export type BookingAddonFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    /**
     * Filter, which BookingAddon to fetch.
     */
    where?: BookingAddonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingAddons to fetch.
     */
    orderBy?: BookingAddonOrderByWithRelationInput | BookingAddonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingAddons.
     */
    cursor?: BookingAddonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingAddons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingAddons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingAddons.
     */
    distinct?: BookingAddonScalarFieldEnum | BookingAddonScalarFieldEnum[]
  }

  /**
   * BookingAddon findFirstOrThrow
   */
  export type BookingAddonFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    /**
     * Filter, which BookingAddon to fetch.
     */
    where?: BookingAddonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingAddons to fetch.
     */
    orderBy?: BookingAddonOrderByWithRelationInput | BookingAddonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingAddons.
     */
    cursor?: BookingAddonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingAddons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingAddons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingAddons.
     */
    distinct?: BookingAddonScalarFieldEnum | BookingAddonScalarFieldEnum[]
  }

  /**
   * BookingAddon findMany
   */
  export type BookingAddonFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    /**
     * Filter, which BookingAddons to fetch.
     */
    where?: BookingAddonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingAddons to fetch.
     */
    orderBy?: BookingAddonOrderByWithRelationInput | BookingAddonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookingAddons.
     */
    cursor?: BookingAddonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingAddons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingAddons.
     */
    skip?: number
    distinct?: BookingAddonScalarFieldEnum | BookingAddonScalarFieldEnum[]
  }

  /**
   * BookingAddon create
   */
  export type BookingAddonCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    /**
     * The data needed to create a BookingAddon.
     */
    data: XOR<BookingAddonCreateInput, BookingAddonUncheckedCreateInput>
  }

  /**
   * BookingAddon createMany
   */
  export type BookingAddonCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookingAddons.
     */
    data: BookingAddonCreateManyInput | BookingAddonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingAddon createManyAndReturn
   */
  export type BookingAddonCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BookingAddons.
     */
    data: BookingAddonCreateManyInput | BookingAddonCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookingAddon update
   */
  export type BookingAddonUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    /**
     * The data needed to update a BookingAddon.
     */
    data: XOR<BookingAddonUpdateInput, BookingAddonUncheckedUpdateInput>
    /**
     * Choose, which BookingAddon to update.
     */
    where: BookingAddonWhereUniqueInput
  }

  /**
   * BookingAddon updateMany
   */
  export type BookingAddonUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookingAddons.
     */
    data: XOR<BookingAddonUpdateManyMutationInput, BookingAddonUncheckedUpdateManyInput>
    /**
     * Filter which BookingAddons to update
     */
    where?: BookingAddonWhereInput
  }

  /**
   * BookingAddon upsert
   */
  export type BookingAddonUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    /**
     * The filter to search for the BookingAddon to update in case it exists.
     */
    where: BookingAddonWhereUniqueInput
    /**
     * In case the BookingAddon found by the `where` argument doesn't exist, create a new BookingAddon with this data.
     */
    create: XOR<BookingAddonCreateInput, BookingAddonUncheckedCreateInput>
    /**
     * In case the BookingAddon was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingAddonUpdateInput, BookingAddonUncheckedUpdateInput>
  }

  /**
   * BookingAddon delete
   */
  export type BookingAddonDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
    /**
     * Filter which BookingAddon to delete.
     */
    where: BookingAddonWhereUniqueInput
  }

  /**
   * BookingAddon deleteMany
   */
  export type BookingAddonDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingAddons to delete
     */
    where?: BookingAddonWhereInput
  }

  /**
   * BookingAddon without action
   */
  export type BookingAddonDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingAddon
     */
    select?: BookingAddonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingAddonInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: Decimal | null
    refundAmount: Decimal | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: Decimal | null
    refundAmount: Decimal | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    bookingId: string | null
    provider: string | null
    orderId: string | null
    paymentId: string | null
    signature: string | null
    amount: Decimal | null
    currency: string | null
    status: string | null
    refundId: string | null
    refundAmount: Decimal | null
    createdAt: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    bookingId: string | null
    provider: string | null
    orderId: string | null
    paymentId: string | null
    signature: string | null
    amount: Decimal | null
    currency: string | null
    status: string | null
    refundId: string | null
    refundAmount: Decimal | null
    createdAt: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    bookingId: number
    provider: number
    orderId: number
    paymentId: number
    signature: number
    amount: number
    currency: number
    status: number
    refundId: number
    refundAmount: number
    createdAt: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
    refundAmount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
    refundAmount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    bookingId?: true
    provider?: true
    orderId?: true
    paymentId?: true
    signature?: true
    amount?: true
    currency?: true
    status?: true
    refundId?: true
    refundAmount?: true
    createdAt?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    bookingId?: true
    provider?: true
    orderId?: true
    paymentId?: true
    signature?: true
    amount?: true
    currency?: true
    status?: true
    refundId?: true
    refundAmount?: true
    createdAt?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    bookingId?: true
    provider?: true
    orderId?: true
    paymentId?: true
    signature?: true
    amount?: true
    currency?: true
    status?: true
    refundId?: true
    refundAmount?: true
    createdAt?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    bookingId: string | null
    provider: string
    orderId: string
    paymentId: string | null
    signature: string | null
    amount: Decimal
    currency: string
    status: string
    refundId: string | null
    refundAmount: Decimal | null
    createdAt: Date
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    provider?: boolean
    orderId?: boolean
    paymentId?: boolean
    signature?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    refundId?: boolean
    refundAmount?: boolean
    createdAt?: boolean
    booking?: boolean | Payment$bookingArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    provider?: boolean
    orderId?: boolean
    paymentId?: boolean
    signature?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    refundId?: boolean
    refundAmount?: boolean
    createdAt?: boolean
    booking?: boolean | Payment$bookingArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    bookingId?: boolean
    provider?: boolean
    orderId?: boolean
    paymentId?: boolean
    signature?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    refundId?: boolean
    refundAmount?: boolean
    createdAt?: boolean
  }

  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | Payment$bookingArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | Payment$bookingArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      booking: Prisma.$BookingPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bookingId: string | null
      provider: string
      orderId: string
      paymentId: string | null
      signature: string | null
      amount: Prisma.Decimal
      currency: string
      status: string
      refundId: string | null
      refundAmount: Prisma.Decimal | null
      createdAt: Date
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    booking<T extends Payment$bookingArgs<ExtArgs> = {}>(args?: Subset<T, Payment$bookingArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */ 
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly bookingId: FieldRef<"Payment", 'String'>
    readonly provider: FieldRef<"Payment", 'String'>
    readonly orderId: FieldRef<"Payment", 'String'>
    readonly paymentId: FieldRef<"Payment", 'String'>
    readonly signature: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Decimal'>
    readonly currency: FieldRef<"Payment", 'String'>
    readonly status: FieldRef<"Payment", 'String'>
    readonly refundId: FieldRef<"Payment", 'String'>
    readonly refundAmount: FieldRef<"Payment", 'Decimal'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment.booking
   */
  export type Payment$bookingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model Review
   */

  export type AggregateReview = {
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  export type ReviewAvgAggregateOutputType = {
    rating: Decimal | null
  }

  export type ReviewSumAggregateOutputType = {
    rating: Decimal | null
  }

  export type ReviewMinAggregateOutputType = {
    id: string | null
    movieId: string | null
    userName: string | null
    userEmail: string | null
    rating: Decimal | null
    comment: string | null
    createdAt: Date | null
  }

  export type ReviewMaxAggregateOutputType = {
    id: string | null
    movieId: string | null
    userName: string | null
    userEmail: string | null
    rating: Decimal | null
    comment: string | null
    createdAt: Date | null
  }

  export type ReviewCountAggregateOutputType = {
    id: number
    movieId: number
    userName: number
    userEmail: number
    rating: number
    comment: number
    createdAt: number
    _all: number
  }


  export type ReviewAvgAggregateInputType = {
    rating?: true
  }

  export type ReviewSumAggregateInputType = {
    rating?: true
  }

  export type ReviewMinAggregateInputType = {
    id?: true
    movieId?: true
    userName?: true
    userEmail?: true
    rating?: true
    comment?: true
    createdAt?: true
  }

  export type ReviewMaxAggregateInputType = {
    id?: true
    movieId?: true
    userName?: true
    userEmail?: true
    rating?: true
    comment?: true
    createdAt?: true
  }

  export type ReviewCountAggregateInputType = {
    id?: true
    movieId?: true
    userName?: true
    userEmail?: true
    rating?: true
    comment?: true
    createdAt?: true
    _all?: true
  }

  export type ReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Review to aggregate.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reviews
    **/
    _count?: true | ReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReviewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReviewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewMaxAggregateInputType
  }

  export type GetReviewAggregateType<T extends ReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReview[P]>
      : GetScalarType<T[P], AggregateReview[P]>
  }




  export type ReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithAggregationInput | ReviewOrderByWithAggregationInput[]
    by: ReviewScalarFieldEnum[] | ReviewScalarFieldEnum
    having?: ReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewCountAggregateInputType | true
    _avg?: ReviewAvgAggregateInputType
    _sum?: ReviewSumAggregateInputType
    _min?: ReviewMinAggregateInputType
    _max?: ReviewMaxAggregateInputType
  }

  export type ReviewGroupByOutputType = {
    id: string
    movieId: string
    userName: string
    userEmail: string | null
    rating: Decimal
    comment: string
    createdAt: Date
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  type GetReviewGroupByPayload<T extends ReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewGroupByOutputType[P]>
        }
      >
    >


  export type ReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    movieId?: boolean
    userName?: boolean
    userEmail?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
    movie?: boolean | MovieDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    movieId?: boolean
    userName?: boolean
    userEmail?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
    movie?: boolean | MovieDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectScalar = {
    id?: boolean
    movieId?: boolean
    userName?: boolean
    userEmail?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
  }

  export type ReviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movie?: boolean | MovieDefaultArgs<ExtArgs>
  }
  export type ReviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movie?: boolean | MovieDefaultArgs<ExtArgs>
  }

  export type $ReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Review"
    objects: {
      movie: Prisma.$MoviePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      movieId: string
      userName: string
      userEmail: string | null
      rating: Prisma.Decimal
      comment: string
      createdAt: Date
    }, ExtArgs["result"]["review"]>
    composites: {}
  }

  type ReviewGetPayload<S extends boolean | null | undefined | ReviewDefaultArgs> = $Result.GetResult<Prisma.$ReviewPayload, S>

  type ReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReviewFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReviewCountAggregateInputType | true
    }

  export interface ReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Review'], meta: { name: 'Review' } }
    /**
     * Find zero or one Review that matches the filter.
     * @param {ReviewFindUniqueArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewFindUniqueArgs>(args: SelectSubset<T, ReviewFindUniqueArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Review that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReviewFindUniqueOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Review that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewFindFirstArgs>(args?: SelectSubset<T, ReviewFindFirstArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Review that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reviews
     * const reviews = await prisma.review.findMany()
     * 
     * // Get first 10 Reviews
     * const reviews = await prisma.review.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewWithIdOnly = await prisma.review.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewFindManyArgs>(args?: SelectSubset<T, ReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Review.
     * @param {ReviewCreateArgs} args - Arguments to create a Review.
     * @example
     * // Create one Review
     * const Review = await prisma.review.create({
     *   data: {
     *     // ... data to create a Review
     *   }
     * })
     * 
     */
    create<T extends ReviewCreateArgs>(args: SelectSubset<T, ReviewCreateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reviews.
     * @param {ReviewCreateManyArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewCreateManyArgs>(args?: SelectSubset<T, ReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reviews and returns the data saved in the database.
     * @param {ReviewCreateManyAndReturnArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Review.
     * @param {ReviewDeleteArgs} args - Arguments to delete one Review.
     * @example
     * // Delete one Review
     * const Review = await prisma.review.delete({
     *   where: {
     *     // ... filter to delete one Review
     *   }
     * })
     * 
     */
    delete<T extends ReviewDeleteArgs>(args: SelectSubset<T, ReviewDeleteArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Review.
     * @param {ReviewUpdateArgs} args - Arguments to update one Review.
     * @example
     * // Update one Review
     * const review = await prisma.review.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewUpdateArgs>(args: SelectSubset<T, ReviewUpdateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reviews.
     * @param {ReviewDeleteManyArgs} args - Arguments to filter Reviews to delete.
     * @example
     * // Delete a few Reviews
     * const { count } = await prisma.review.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewDeleteManyArgs>(args?: SelectSubset<T, ReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewUpdateManyArgs>(args: SelectSubset<T, ReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Review.
     * @param {ReviewUpsertArgs} args - Arguments to update or create a Review.
     * @example
     * // Update or create a Review
     * const review = await prisma.review.upsert({
     *   create: {
     *     // ... data to create a Review
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Review we want to update
     *   }
     * })
     */
    upsert<T extends ReviewUpsertArgs>(args: SelectSubset<T, ReviewUpsertArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewCountArgs} args - Arguments to filter Reviews to count.
     * @example
     * // Count the number of Reviews
     * const count = await prisma.review.count({
     *   where: {
     *     // ... the filter for the Reviews we want to count
     *   }
     * })
    **/
    count<T extends ReviewCountArgs>(
      args?: Subset<T, ReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewAggregateArgs>(args: Subset<T, ReviewAggregateArgs>): Prisma.PrismaPromise<GetReviewAggregateType<T>>

    /**
     * Group by Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewGroupByArgs['orderBy'] }
        : { orderBy?: ReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Review model
   */
  readonly fields: ReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Review.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    movie<T extends MovieDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MovieDefaultArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Review model
   */ 
  interface ReviewFieldRefs {
    readonly id: FieldRef<"Review", 'String'>
    readonly movieId: FieldRef<"Review", 'String'>
    readonly userName: FieldRef<"Review", 'String'>
    readonly userEmail: FieldRef<"Review", 'String'>
    readonly rating: FieldRef<"Review", 'Decimal'>
    readonly comment: FieldRef<"Review", 'String'>
    readonly createdAt: FieldRef<"Review", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Review findUnique
   */
  export type ReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findUniqueOrThrow
   */
  export type ReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findFirst
   */
  export type ReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findFirstOrThrow
   */
  export type ReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findMany
   */
  export type ReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Reviews to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review create
   */
  export type ReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to create a Review.
     */
    data: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
  }

  /**
   * Review createMany
   */
  export type ReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Review createManyAndReturn
   */
  export type ReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Review update
   */
  export type ReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to update a Review.
     */
    data: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
    /**
     * Choose, which Review to update.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review updateMany
   */
  export type ReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
  }

  /**
   * Review upsert
   */
  export type ReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The filter to search for the Review to update in case it exists.
     */
    where: ReviewWhereUniqueInput
    /**
     * In case the Review found by the `where` argument doesn't exist, create a new Review with this data.
     */
    create: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
    /**
     * In case the Review was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
  }

  /**
   * Review delete
   */
  export type ReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter which Review to delete.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review deleteMany
   */
  export type ReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reviews to delete
     */
    where?: ReviewWhereInput
  }

  /**
   * Review without action
   */
  export type ReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
  }


  /**
   * Model MovieCast
   */

  export type AggregateMovieCast = {
    _count: MovieCastCountAggregateOutputType | null
    _avg: MovieCastAvgAggregateOutputType | null
    _sum: MovieCastSumAggregateOutputType | null
    _min: MovieCastMinAggregateOutputType | null
    _max: MovieCastMaxAggregateOutputType | null
  }

  export type MovieCastAvgAggregateOutputType = {
    id: number | null
  }

  export type MovieCastSumAggregateOutputType = {
    id: number | null
  }

  export type MovieCastMinAggregateOutputType = {
    id: number | null
    movieId: string | null
    name: string | null
    role: string | null
    avatar: string | null
  }

  export type MovieCastMaxAggregateOutputType = {
    id: number | null
    movieId: string | null
    name: string | null
    role: string | null
    avatar: string | null
  }

  export type MovieCastCountAggregateOutputType = {
    id: number
    movieId: number
    name: number
    role: number
    avatar: number
    _all: number
  }


  export type MovieCastAvgAggregateInputType = {
    id?: true
  }

  export type MovieCastSumAggregateInputType = {
    id?: true
  }

  export type MovieCastMinAggregateInputType = {
    id?: true
    movieId?: true
    name?: true
    role?: true
    avatar?: true
  }

  export type MovieCastMaxAggregateInputType = {
    id?: true
    movieId?: true
    name?: true
    role?: true
    avatar?: true
  }

  export type MovieCastCountAggregateInputType = {
    id?: true
    movieId?: true
    name?: true
    role?: true
    avatar?: true
    _all?: true
  }

  export type MovieCastAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MovieCast to aggregate.
     */
    where?: MovieCastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MovieCasts to fetch.
     */
    orderBy?: MovieCastOrderByWithRelationInput | MovieCastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MovieCastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MovieCasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MovieCasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MovieCasts
    **/
    _count?: true | MovieCastCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MovieCastAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MovieCastSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MovieCastMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MovieCastMaxAggregateInputType
  }

  export type GetMovieCastAggregateType<T extends MovieCastAggregateArgs> = {
        [P in keyof T & keyof AggregateMovieCast]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMovieCast[P]>
      : GetScalarType<T[P], AggregateMovieCast[P]>
  }




  export type MovieCastGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovieCastWhereInput
    orderBy?: MovieCastOrderByWithAggregationInput | MovieCastOrderByWithAggregationInput[]
    by: MovieCastScalarFieldEnum[] | MovieCastScalarFieldEnum
    having?: MovieCastScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MovieCastCountAggregateInputType | true
    _avg?: MovieCastAvgAggregateInputType
    _sum?: MovieCastSumAggregateInputType
    _min?: MovieCastMinAggregateInputType
    _max?: MovieCastMaxAggregateInputType
  }

  export type MovieCastGroupByOutputType = {
    id: number
    movieId: string
    name: string
    role: string
    avatar: string
    _count: MovieCastCountAggregateOutputType | null
    _avg: MovieCastAvgAggregateOutputType | null
    _sum: MovieCastSumAggregateOutputType | null
    _min: MovieCastMinAggregateOutputType | null
    _max: MovieCastMaxAggregateOutputType | null
  }

  type GetMovieCastGroupByPayload<T extends MovieCastGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MovieCastGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MovieCastGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MovieCastGroupByOutputType[P]>
            : GetScalarType<T[P], MovieCastGroupByOutputType[P]>
        }
      >
    >


  export type MovieCastSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    movieId?: boolean
    name?: boolean
    role?: boolean
    avatar?: boolean
    movie?: boolean | MovieDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movieCast"]>

  export type MovieCastSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    movieId?: boolean
    name?: boolean
    role?: boolean
    avatar?: boolean
    movie?: boolean | MovieDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movieCast"]>

  export type MovieCastSelectScalar = {
    id?: boolean
    movieId?: boolean
    name?: boolean
    role?: boolean
    avatar?: boolean
  }

  export type MovieCastInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movie?: boolean | MovieDefaultArgs<ExtArgs>
  }
  export type MovieCastIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movie?: boolean | MovieDefaultArgs<ExtArgs>
  }

  export type $MovieCastPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MovieCast"
    objects: {
      movie: Prisma.$MoviePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      movieId: string
      name: string
      role: string
      avatar: string
    }, ExtArgs["result"]["movieCast"]>
    composites: {}
  }

  type MovieCastGetPayload<S extends boolean | null | undefined | MovieCastDefaultArgs> = $Result.GetResult<Prisma.$MovieCastPayload, S>

  type MovieCastCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MovieCastFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MovieCastCountAggregateInputType | true
    }

  export interface MovieCastDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MovieCast'], meta: { name: 'MovieCast' } }
    /**
     * Find zero or one MovieCast that matches the filter.
     * @param {MovieCastFindUniqueArgs} args - Arguments to find a MovieCast
     * @example
     * // Get one MovieCast
     * const movieCast = await prisma.movieCast.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MovieCastFindUniqueArgs>(args: SelectSubset<T, MovieCastFindUniqueArgs<ExtArgs>>): Prisma__MovieCastClient<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MovieCast that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MovieCastFindUniqueOrThrowArgs} args - Arguments to find a MovieCast
     * @example
     * // Get one MovieCast
     * const movieCast = await prisma.movieCast.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MovieCastFindUniqueOrThrowArgs>(args: SelectSubset<T, MovieCastFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MovieCastClient<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MovieCast that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieCastFindFirstArgs} args - Arguments to find a MovieCast
     * @example
     * // Get one MovieCast
     * const movieCast = await prisma.movieCast.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MovieCastFindFirstArgs>(args?: SelectSubset<T, MovieCastFindFirstArgs<ExtArgs>>): Prisma__MovieCastClient<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MovieCast that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieCastFindFirstOrThrowArgs} args - Arguments to find a MovieCast
     * @example
     * // Get one MovieCast
     * const movieCast = await prisma.movieCast.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MovieCastFindFirstOrThrowArgs>(args?: SelectSubset<T, MovieCastFindFirstOrThrowArgs<ExtArgs>>): Prisma__MovieCastClient<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MovieCasts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieCastFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MovieCasts
     * const movieCasts = await prisma.movieCast.findMany()
     * 
     * // Get first 10 MovieCasts
     * const movieCasts = await prisma.movieCast.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const movieCastWithIdOnly = await prisma.movieCast.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MovieCastFindManyArgs>(args?: SelectSubset<T, MovieCastFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MovieCast.
     * @param {MovieCastCreateArgs} args - Arguments to create a MovieCast.
     * @example
     * // Create one MovieCast
     * const MovieCast = await prisma.movieCast.create({
     *   data: {
     *     // ... data to create a MovieCast
     *   }
     * })
     * 
     */
    create<T extends MovieCastCreateArgs>(args: SelectSubset<T, MovieCastCreateArgs<ExtArgs>>): Prisma__MovieCastClient<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MovieCasts.
     * @param {MovieCastCreateManyArgs} args - Arguments to create many MovieCasts.
     * @example
     * // Create many MovieCasts
     * const movieCast = await prisma.movieCast.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MovieCastCreateManyArgs>(args?: SelectSubset<T, MovieCastCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MovieCasts and returns the data saved in the database.
     * @param {MovieCastCreateManyAndReturnArgs} args - Arguments to create many MovieCasts.
     * @example
     * // Create many MovieCasts
     * const movieCast = await prisma.movieCast.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MovieCasts and only return the `id`
     * const movieCastWithIdOnly = await prisma.movieCast.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MovieCastCreateManyAndReturnArgs>(args?: SelectSubset<T, MovieCastCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MovieCast.
     * @param {MovieCastDeleteArgs} args - Arguments to delete one MovieCast.
     * @example
     * // Delete one MovieCast
     * const MovieCast = await prisma.movieCast.delete({
     *   where: {
     *     // ... filter to delete one MovieCast
     *   }
     * })
     * 
     */
    delete<T extends MovieCastDeleteArgs>(args: SelectSubset<T, MovieCastDeleteArgs<ExtArgs>>): Prisma__MovieCastClient<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MovieCast.
     * @param {MovieCastUpdateArgs} args - Arguments to update one MovieCast.
     * @example
     * // Update one MovieCast
     * const movieCast = await prisma.movieCast.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MovieCastUpdateArgs>(args: SelectSubset<T, MovieCastUpdateArgs<ExtArgs>>): Prisma__MovieCastClient<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MovieCasts.
     * @param {MovieCastDeleteManyArgs} args - Arguments to filter MovieCasts to delete.
     * @example
     * // Delete a few MovieCasts
     * const { count } = await prisma.movieCast.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MovieCastDeleteManyArgs>(args?: SelectSubset<T, MovieCastDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MovieCasts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieCastUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MovieCasts
     * const movieCast = await prisma.movieCast.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MovieCastUpdateManyArgs>(args: SelectSubset<T, MovieCastUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MovieCast.
     * @param {MovieCastUpsertArgs} args - Arguments to update or create a MovieCast.
     * @example
     * // Update or create a MovieCast
     * const movieCast = await prisma.movieCast.upsert({
     *   create: {
     *     // ... data to create a MovieCast
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MovieCast we want to update
     *   }
     * })
     */
    upsert<T extends MovieCastUpsertArgs>(args: SelectSubset<T, MovieCastUpsertArgs<ExtArgs>>): Prisma__MovieCastClient<$Result.GetResult<Prisma.$MovieCastPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MovieCasts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieCastCountArgs} args - Arguments to filter MovieCasts to count.
     * @example
     * // Count the number of MovieCasts
     * const count = await prisma.movieCast.count({
     *   where: {
     *     // ... the filter for the MovieCasts we want to count
     *   }
     * })
    **/
    count<T extends MovieCastCountArgs>(
      args?: Subset<T, MovieCastCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MovieCastCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MovieCast.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieCastAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MovieCastAggregateArgs>(args: Subset<T, MovieCastAggregateArgs>): Prisma.PrismaPromise<GetMovieCastAggregateType<T>>

    /**
     * Group by MovieCast.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovieCastGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MovieCastGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MovieCastGroupByArgs['orderBy'] }
        : { orderBy?: MovieCastGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MovieCastGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMovieCastGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MovieCast model
   */
  readonly fields: MovieCastFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MovieCast.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MovieCastClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    movie<T extends MovieDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MovieDefaultArgs<ExtArgs>>): Prisma__MovieClient<$Result.GetResult<Prisma.$MoviePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MovieCast model
   */ 
  interface MovieCastFieldRefs {
    readonly id: FieldRef<"MovieCast", 'Int'>
    readonly movieId: FieldRef<"MovieCast", 'String'>
    readonly name: FieldRef<"MovieCast", 'String'>
    readonly role: FieldRef<"MovieCast", 'String'>
    readonly avatar: FieldRef<"MovieCast", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MovieCast findUnique
   */
  export type MovieCastFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    /**
     * Filter, which MovieCast to fetch.
     */
    where: MovieCastWhereUniqueInput
  }

  /**
   * MovieCast findUniqueOrThrow
   */
  export type MovieCastFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    /**
     * Filter, which MovieCast to fetch.
     */
    where: MovieCastWhereUniqueInput
  }

  /**
   * MovieCast findFirst
   */
  export type MovieCastFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    /**
     * Filter, which MovieCast to fetch.
     */
    where?: MovieCastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MovieCasts to fetch.
     */
    orderBy?: MovieCastOrderByWithRelationInput | MovieCastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MovieCasts.
     */
    cursor?: MovieCastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MovieCasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MovieCasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MovieCasts.
     */
    distinct?: MovieCastScalarFieldEnum | MovieCastScalarFieldEnum[]
  }

  /**
   * MovieCast findFirstOrThrow
   */
  export type MovieCastFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    /**
     * Filter, which MovieCast to fetch.
     */
    where?: MovieCastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MovieCasts to fetch.
     */
    orderBy?: MovieCastOrderByWithRelationInput | MovieCastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MovieCasts.
     */
    cursor?: MovieCastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MovieCasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MovieCasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MovieCasts.
     */
    distinct?: MovieCastScalarFieldEnum | MovieCastScalarFieldEnum[]
  }

  /**
   * MovieCast findMany
   */
  export type MovieCastFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    /**
     * Filter, which MovieCasts to fetch.
     */
    where?: MovieCastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MovieCasts to fetch.
     */
    orderBy?: MovieCastOrderByWithRelationInput | MovieCastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MovieCasts.
     */
    cursor?: MovieCastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MovieCasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MovieCasts.
     */
    skip?: number
    distinct?: MovieCastScalarFieldEnum | MovieCastScalarFieldEnum[]
  }

  /**
   * MovieCast create
   */
  export type MovieCastCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    /**
     * The data needed to create a MovieCast.
     */
    data: XOR<MovieCastCreateInput, MovieCastUncheckedCreateInput>
  }

  /**
   * MovieCast createMany
   */
  export type MovieCastCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MovieCasts.
     */
    data: MovieCastCreateManyInput | MovieCastCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MovieCast createManyAndReturn
   */
  export type MovieCastCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MovieCasts.
     */
    data: MovieCastCreateManyInput | MovieCastCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MovieCast update
   */
  export type MovieCastUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    /**
     * The data needed to update a MovieCast.
     */
    data: XOR<MovieCastUpdateInput, MovieCastUncheckedUpdateInput>
    /**
     * Choose, which MovieCast to update.
     */
    where: MovieCastWhereUniqueInput
  }

  /**
   * MovieCast updateMany
   */
  export type MovieCastUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MovieCasts.
     */
    data: XOR<MovieCastUpdateManyMutationInput, MovieCastUncheckedUpdateManyInput>
    /**
     * Filter which MovieCasts to update
     */
    where?: MovieCastWhereInput
  }

  /**
   * MovieCast upsert
   */
  export type MovieCastUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    /**
     * The filter to search for the MovieCast to update in case it exists.
     */
    where: MovieCastWhereUniqueInput
    /**
     * In case the MovieCast found by the `where` argument doesn't exist, create a new MovieCast with this data.
     */
    create: XOR<MovieCastCreateInput, MovieCastUncheckedCreateInput>
    /**
     * In case the MovieCast was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MovieCastUpdateInput, MovieCastUncheckedUpdateInput>
  }

  /**
   * MovieCast delete
   */
  export type MovieCastDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
    /**
     * Filter which MovieCast to delete.
     */
    where: MovieCastWhereUniqueInput
  }

  /**
   * MovieCast deleteMany
   */
  export type MovieCastDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MovieCasts to delete
     */
    where?: MovieCastWhereInput
  }

  /**
   * MovieCast without action
   */
  export type MovieCastDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovieCast
     */
    select?: MovieCastSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovieCastInclude<ExtArgs> | null
  }


  /**
   * Model CancellationAuditLog
   */

  export type AggregateCancellationAuditLog = {
    _count: CancellationAuditLogCountAggregateOutputType | null
    _avg: CancellationAuditLogAvgAggregateOutputType | null
    _sum: CancellationAuditLogSumAggregateOutputType | null
    _min: CancellationAuditLogMinAggregateOutputType | null
    _max: CancellationAuditLogMaxAggregateOutputType | null
  }

  export type CancellationAuditLogAvgAggregateOutputType = {
    refundAmount: Decimal | null
    cancellationFee: Decimal | null
  }

  export type CancellationAuditLogSumAggregateOutputType = {
    refundAmount: Decimal | null
    cancellationFee: Decimal | null
  }

  export type CancellationAuditLogMinAggregateOutputType = {
    id: string | null
    bookingId: string | null
    bookingRef: string | null
    action: string | null
    actorEmail: string | null
    previousStatus: string | null
    newStatus: string | null
    refundStatus: string | null
    refundAmount: Decimal | null
    cancellationFee: Decimal | null
    refundId: string | null
    failureReason: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type CancellationAuditLogMaxAggregateOutputType = {
    id: string | null
    bookingId: string | null
    bookingRef: string | null
    action: string | null
    actorEmail: string | null
    previousStatus: string | null
    newStatus: string | null
    refundStatus: string | null
    refundAmount: Decimal | null
    cancellationFee: Decimal | null
    refundId: string | null
    failureReason: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type CancellationAuditLogCountAggregateOutputType = {
    id: number
    bookingId: number
    bookingRef: number
    action: number
    actorEmail: number
    previousStatus: number
    newStatus: number
    refundStatus: number
    refundAmount: number
    cancellationFee: number
    refundId: number
    failureReason: number
    notes: number
    createdAt: number
    _all: number
  }


  export type CancellationAuditLogAvgAggregateInputType = {
    refundAmount?: true
    cancellationFee?: true
  }

  export type CancellationAuditLogSumAggregateInputType = {
    refundAmount?: true
    cancellationFee?: true
  }

  export type CancellationAuditLogMinAggregateInputType = {
    id?: true
    bookingId?: true
    bookingRef?: true
    action?: true
    actorEmail?: true
    previousStatus?: true
    newStatus?: true
    refundStatus?: true
    refundAmount?: true
    cancellationFee?: true
    refundId?: true
    failureReason?: true
    notes?: true
    createdAt?: true
  }

  export type CancellationAuditLogMaxAggregateInputType = {
    id?: true
    bookingId?: true
    bookingRef?: true
    action?: true
    actorEmail?: true
    previousStatus?: true
    newStatus?: true
    refundStatus?: true
    refundAmount?: true
    cancellationFee?: true
    refundId?: true
    failureReason?: true
    notes?: true
    createdAt?: true
  }

  export type CancellationAuditLogCountAggregateInputType = {
    id?: true
    bookingId?: true
    bookingRef?: true
    action?: true
    actorEmail?: true
    previousStatus?: true
    newStatus?: true
    refundStatus?: true
    refundAmount?: true
    cancellationFee?: true
    refundId?: true
    failureReason?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type CancellationAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CancellationAuditLog to aggregate.
     */
    where?: CancellationAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CancellationAuditLogs to fetch.
     */
    orderBy?: CancellationAuditLogOrderByWithRelationInput | CancellationAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CancellationAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CancellationAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CancellationAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CancellationAuditLogs
    **/
    _count?: true | CancellationAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CancellationAuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CancellationAuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CancellationAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CancellationAuditLogMaxAggregateInputType
  }

  export type GetCancellationAuditLogAggregateType<T extends CancellationAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateCancellationAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCancellationAuditLog[P]>
      : GetScalarType<T[P], AggregateCancellationAuditLog[P]>
  }




  export type CancellationAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CancellationAuditLogWhereInput
    orderBy?: CancellationAuditLogOrderByWithAggregationInput | CancellationAuditLogOrderByWithAggregationInput[]
    by: CancellationAuditLogScalarFieldEnum[] | CancellationAuditLogScalarFieldEnum
    having?: CancellationAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CancellationAuditLogCountAggregateInputType | true
    _avg?: CancellationAuditLogAvgAggregateInputType
    _sum?: CancellationAuditLogSumAggregateInputType
    _min?: CancellationAuditLogMinAggregateInputType
    _max?: CancellationAuditLogMaxAggregateInputType
  }

  export type CancellationAuditLogGroupByOutputType = {
    id: string
    bookingId: string | null
    bookingRef: string
    action: string
    actorEmail: string
    previousStatus: string
    newStatus: string
    refundStatus: string
    refundAmount: Decimal
    cancellationFee: Decimal
    refundId: string | null
    failureReason: string | null
    notes: string | null
    createdAt: Date
    _count: CancellationAuditLogCountAggregateOutputType | null
    _avg: CancellationAuditLogAvgAggregateOutputType | null
    _sum: CancellationAuditLogSumAggregateOutputType | null
    _min: CancellationAuditLogMinAggregateOutputType | null
    _max: CancellationAuditLogMaxAggregateOutputType | null
  }

  type GetCancellationAuditLogGroupByPayload<T extends CancellationAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CancellationAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CancellationAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CancellationAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], CancellationAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type CancellationAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    bookingRef?: boolean
    action?: boolean
    actorEmail?: boolean
    previousStatus?: boolean
    newStatus?: boolean
    refundStatus?: boolean
    refundAmount?: boolean
    cancellationFee?: boolean
    refundId?: boolean
    failureReason?: boolean
    notes?: boolean
    createdAt?: boolean
    booking?: boolean | CancellationAuditLog$bookingArgs<ExtArgs>
  }, ExtArgs["result"]["cancellationAuditLog"]>

  export type CancellationAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    bookingRef?: boolean
    action?: boolean
    actorEmail?: boolean
    previousStatus?: boolean
    newStatus?: boolean
    refundStatus?: boolean
    refundAmount?: boolean
    cancellationFee?: boolean
    refundId?: boolean
    failureReason?: boolean
    notes?: boolean
    createdAt?: boolean
    booking?: boolean | CancellationAuditLog$bookingArgs<ExtArgs>
  }, ExtArgs["result"]["cancellationAuditLog"]>

  export type CancellationAuditLogSelectScalar = {
    id?: boolean
    bookingId?: boolean
    bookingRef?: boolean
    action?: boolean
    actorEmail?: boolean
    previousStatus?: boolean
    newStatus?: boolean
    refundStatus?: boolean
    refundAmount?: boolean
    cancellationFee?: boolean
    refundId?: boolean
    failureReason?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type CancellationAuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | CancellationAuditLog$bookingArgs<ExtArgs>
  }
  export type CancellationAuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | CancellationAuditLog$bookingArgs<ExtArgs>
  }

  export type $CancellationAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CancellationAuditLog"
    objects: {
      booking: Prisma.$BookingPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bookingId: string | null
      bookingRef: string
      action: string
      actorEmail: string
      previousStatus: string
      newStatus: string
      refundStatus: string
      refundAmount: Prisma.Decimal
      cancellationFee: Prisma.Decimal
      refundId: string | null
      failureReason: string | null
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["cancellationAuditLog"]>
    composites: {}
  }

  type CancellationAuditLogGetPayload<S extends boolean | null | undefined | CancellationAuditLogDefaultArgs> = $Result.GetResult<Prisma.$CancellationAuditLogPayload, S>

  type CancellationAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CancellationAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CancellationAuditLogCountAggregateInputType | true
    }

  export interface CancellationAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CancellationAuditLog'], meta: { name: 'CancellationAuditLog' } }
    /**
     * Find zero or one CancellationAuditLog that matches the filter.
     * @param {CancellationAuditLogFindUniqueArgs} args - Arguments to find a CancellationAuditLog
     * @example
     * // Get one CancellationAuditLog
     * const cancellationAuditLog = await prisma.cancellationAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CancellationAuditLogFindUniqueArgs>(args: SelectSubset<T, CancellationAuditLogFindUniqueArgs<ExtArgs>>): Prisma__CancellationAuditLogClient<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CancellationAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CancellationAuditLogFindUniqueOrThrowArgs} args - Arguments to find a CancellationAuditLog
     * @example
     * // Get one CancellationAuditLog
     * const cancellationAuditLog = await prisma.cancellationAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CancellationAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, CancellationAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CancellationAuditLogClient<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CancellationAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancellationAuditLogFindFirstArgs} args - Arguments to find a CancellationAuditLog
     * @example
     * // Get one CancellationAuditLog
     * const cancellationAuditLog = await prisma.cancellationAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CancellationAuditLogFindFirstArgs>(args?: SelectSubset<T, CancellationAuditLogFindFirstArgs<ExtArgs>>): Prisma__CancellationAuditLogClient<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CancellationAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancellationAuditLogFindFirstOrThrowArgs} args - Arguments to find a CancellationAuditLog
     * @example
     * // Get one CancellationAuditLog
     * const cancellationAuditLog = await prisma.cancellationAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CancellationAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, CancellationAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__CancellationAuditLogClient<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CancellationAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancellationAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CancellationAuditLogs
     * const cancellationAuditLogs = await prisma.cancellationAuditLog.findMany()
     * 
     * // Get first 10 CancellationAuditLogs
     * const cancellationAuditLogs = await prisma.cancellationAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cancellationAuditLogWithIdOnly = await prisma.cancellationAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CancellationAuditLogFindManyArgs>(args?: SelectSubset<T, CancellationAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CancellationAuditLog.
     * @param {CancellationAuditLogCreateArgs} args - Arguments to create a CancellationAuditLog.
     * @example
     * // Create one CancellationAuditLog
     * const CancellationAuditLog = await prisma.cancellationAuditLog.create({
     *   data: {
     *     // ... data to create a CancellationAuditLog
     *   }
     * })
     * 
     */
    create<T extends CancellationAuditLogCreateArgs>(args: SelectSubset<T, CancellationAuditLogCreateArgs<ExtArgs>>): Prisma__CancellationAuditLogClient<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CancellationAuditLogs.
     * @param {CancellationAuditLogCreateManyArgs} args - Arguments to create many CancellationAuditLogs.
     * @example
     * // Create many CancellationAuditLogs
     * const cancellationAuditLog = await prisma.cancellationAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CancellationAuditLogCreateManyArgs>(args?: SelectSubset<T, CancellationAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CancellationAuditLogs and returns the data saved in the database.
     * @param {CancellationAuditLogCreateManyAndReturnArgs} args - Arguments to create many CancellationAuditLogs.
     * @example
     * // Create many CancellationAuditLogs
     * const cancellationAuditLog = await prisma.cancellationAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CancellationAuditLogs and only return the `id`
     * const cancellationAuditLogWithIdOnly = await prisma.cancellationAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CancellationAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, CancellationAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CancellationAuditLog.
     * @param {CancellationAuditLogDeleteArgs} args - Arguments to delete one CancellationAuditLog.
     * @example
     * // Delete one CancellationAuditLog
     * const CancellationAuditLog = await prisma.cancellationAuditLog.delete({
     *   where: {
     *     // ... filter to delete one CancellationAuditLog
     *   }
     * })
     * 
     */
    delete<T extends CancellationAuditLogDeleteArgs>(args: SelectSubset<T, CancellationAuditLogDeleteArgs<ExtArgs>>): Prisma__CancellationAuditLogClient<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CancellationAuditLog.
     * @param {CancellationAuditLogUpdateArgs} args - Arguments to update one CancellationAuditLog.
     * @example
     * // Update one CancellationAuditLog
     * const cancellationAuditLog = await prisma.cancellationAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CancellationAuditLogUpdateArgs>(args: SelectSubset<T, CancellationAuditLogUpdateArgs<ExtArgs>>): Prisma__CancellationAuditLogClient<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CancellationAuditLogs.
     * @param {CancellationAuditLogDeleteManyArgs} args - Arguments to filter CancellationAuditLogs to delete.
     * @example
     * // Delete a few CancellationAuditLogs
     * const { count } = await prisma.cancellationAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CancellationAuditLogDeleteManyArgs>(args?: SelectSubset<T, CancellationAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CancellationAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancellationAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CancellationAuditLogs
     * const cancellationAuditLog = await prisma.cancellationAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CancellationAuditLogUpdateManyArgs>(args: SelectSubset<T, CancellationAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CancellationAuditLog.
     * @param {CancellationAuditLogUpsertArgs} args - Arguments to update or create a CancellationAuditLog.
     * @example
     * // Update or create a CancellationAuditLog
     * const cancellationAuditLog = await prisma.cancellationAuditLog.upsert({
     *   create: {
     *     // ... data to create a CancellationAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CancellationAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends CancellationAuditLogUpsertArgs>(args: SelectSubset<T, CancellationAuditLogUpsertArgs<ExtArgs>>): Prisma__CancellationAuditLogClient<$Result.GetResult<Prisma.$CancellationAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CancellationAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancellationAuditLogCountArgs} args - Arguments to filter CancellationAuditLogs to count.
     * @example
     * // Count the number of CancellationAuditLogs
     * const count = await prisma.cancellationAuditLog.count({
     *   where: {
     *     // ... the filter for the CancellationAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends CancellationAuditLogCountArgs>(
      args?: Subset<T, CancellationAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CancellationAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CancellationAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancellationAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CancellationAuditLogAggregateArgs>(args: Subset<T, CancellationAuditLogAggregateArgs>): Prisma.PrismaPromise<GetCancellationAuditLogAggregateType<T>>

    /**
     * Group by CancellationAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancellationAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CancellationAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CancellationAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: CancellationAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CancellationAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCancellationAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CancellationAuditLog model
   */
  readonly fields: CancellationAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CancellationAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CancellationAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    booking<T extends CancellationAuditLog$bookingArgs<ExtArgs> = {}>(args?: Subset<T, CancellationAuditLog$bookingArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CancellationAuditLog model
   */ 
  interface CancellationAuditLogFieldRefs {
    readonly id: FieldRef<"CancellationAuditLog", 'String'>
    readonly bookingId: FieldRef<"CancellationAuditLog", 'String'>
    readonly bookingRef: FieldRef<"CancellationAuditLog", 'String'>
    readonly action: FieldRef<"CancellationAuditLog", 'String'>
    readonly actorEmail: FieldRef<"CancellationAuditLog", 'String'>
    readonly previousStatus: FieldRef<"CancellationAuditLog", 'String'>
    readonly newStatus: FieldRef<"CancellationAuditLog", 'String'>
    readonly refundStatus: FieldRef<"CancellationAuditLog", 'String'>
    readonly refundAmount: FieldRef<"CancellationAuditLog", 'Decimal'>
    readonly cancellationFee: FieldRef<"CancellationAuditLog", 'Decimal'>
    readonly refundId: FieldRef<"CancellationAuditLog", 'String'>
    readonly failureReason: FieldRef<"CancellationAuditLog", 'String'>
    readonly notes: FieldRef<"CancellationAuditLog", 'String'>
    readonly createdAt: FieldRef<"CancellationAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CancellationAuditLog findUnique
   */
  export type CancellationAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which CancellationAuditLog to fetch.
     */
    where: CancellationAuditLogWhereUniqueInput
  }

  /**
   * CancellationAuditLog findUniqueOrThrow
   */
  export type CancellationAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which CancellationAuditLog to fetch.
     */
    where: CancellationAuditLogWhereUniqueInput
  }

  /**
   * CancellationAuditLog findFirst
   */
  export type CancellationAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which CancellationAuditLog to fetch.
     */
    where?: CancellationAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CancellationAuditLogs to fetch.
     */
    orderBy?: CancellationAuditLogOrderByWithRelationInput | CancellationAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CancellationAuditLogs.
     */
    cursor?: CancellationAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CancellationAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CancellationAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CancellationAuditLogs.
     */
    distinct?: CancellationAuditLogScalarFieldEnum | CancellationAuditLogScalarFieldEnum[]
  }

  /**
   * CancellationAuditLog findFirstOrThrow
   */
  export type CancellationAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which CancellationAuditLog to fetch.
     */
    where?: CancellationAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CancellationAuditLogs to fetch.
     */
    orderBy?: CancellationAuditLogOrderByWithRelationInput | CancellationAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CancellationAuditLogs.
     */
    cursor?: CancellationAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CancellationAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CancellationAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CancellationAuditLogs.
     */
    distinct?: CancellationAuditLogScalarFieldEnum | CancellationAuditLogScalarFieldEnum[]
  }

  /**
   * CancellationAuditLog findMany
   */
  export type CancellationAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which CancellationAuditLogs to fetch.
     */
    where?: CancellationAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CancellationAuditLogs to fetch.
     */
    orderBy?: CancellationAuditLogOrderByWithRelationInput | CancellationAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CancellationAuditLogs.
     */
    cursor?: CancellationAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CancellationAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CancellationAuditLogs.
     */
    skip?: number
    distinct?: CancellationAuditLogScalarFieldEnum | CancellationAuditLogScalarFieldEnum[]
  }

  /**
   * CancellationAuditLog create
   */
  export type CancellationAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a CancellationAuditLog.
     */
    data: XOR<CancellationAuditLogCreateInput, CancellationAuditLogUncheckedCreateInput>
  }

  /**
   * CancellationAuditLog createMany
   */
  export type CancellationAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CancellationAuditLogs.
     */
    data: CancellationAuditLogCreateManyInput | CancellationAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CancellationAuditLog createManyAndReturn
   */
  export type CancellationAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CancellationAuditLogs.
     */
    data: CancellationAuditLogCreateManyInput | CancellationAuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CancellationAuditLog update
   */
  export type CancellationAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a CancellationAuditLog.
     */
    data: XOR<CancellationAuditLogUpdateInput, CancellationAuditLogUncheckedUpdateInput>
    /**
     * Choose, which CancellationAuditLog to update.
     */
    where: CancellationAuditLogWhereUniqueInput
  }

  /**
   * CancellationAuditLog updateMany
   */
  export type CancellationAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CancellationAuditLogs.
     */
    data: XOR<CancellationAuditLogUpdateManyMutationInput, CancellationAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which CancellationAuditLogs to update
     */
    where?: CancellationAuditLogWhereInput
  }

  /**
   * CancellationAuditLog upsert
   */
  export type CancellationAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the CancellationAuditLog to update in case it exists.
     */
    where: CancellationAuditLogWhereUniqueInput
    /**
     * In case the CancellationAuditLog found by the `where` argument doesn't exist, create a new CancellationAuditLog with this data.
     */
    create: XOR<CancellationAuditLogCreateInput, CancellationAuditLogUncheckedCreateInput>
    /**
     * In case the CancellationAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CancellationAuditLogUpdateInput, CancellationAuditLogUncheckedUpdateInput>
  }

  /**
   * CancellationAuditLog delete
   */
  export type CancellationAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
    /**
     * Filter which CancellationAuditLog to delete.
     */
    where: CancellationAuditLogWhereUniqueInput
  }

  /**
   * CancellationAuditLog deleteMany
   */
  export type CancellationAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CancellationAuditLogs to delete
     */
    where?: CancellationAuditLogWhereInput
  }

  /**
   * CancellationAuditLog.booking
   */
  export type CancellationAuditLog$bookingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
  }

  /**
   * CancellationAuditLog without action
   */
  export type CancellationAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancellationAuditLog
     */
    select?: CancellationAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancellationAuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    passwordHash: 'passwordHash',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MovieScalarFieldEnum: {
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

  export type MovieScalarFieldEnum = (typeof MovieScalarFieldEnum)[keyof typeof MovieScalarFieldEnum]


  export const TheatreScalarFieldEnum: {
    id: 'id',
    name: 'name',
    city: 'city',
    address: 'address',
    facilities: 'facilities',
    distance: 'distance',
    timezone: 'timezone'
  };

  export type TheatreScalarFieldEnum = (typeof TheatreScalarFieldEnum)[keyof typeof TheatreScalarFieldEnum]


  export const ScreenScalarFieldEnum: {
    id: 'id',
    theatreId: 'theatreId',
    name: 'name',
    screenType: 'screenType'
  };

  export type ScreenScalarFieldEnum = (typeof ScreenScalarFieldEnum)[keyof typeof ScreenScalarFieldEnum]


  export const SeatScalarFieldEnum: {
    id: 'id',
    screenId: 'screenId',
    row: 'row',
    number: 'number',
    seatNumber: 'seatNumber',
    tier: 'tier',
    basePrice: 'basePrice'
  };

  export type SeatScalarFieldEnum = (typeof SeatScalarFieldEnum)[keyof typeof SeatScalarFieldEnum]


  export const ShowtimeScalarFieldEnum: {
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

  export type ShowtimeScalarFieldEnum = (typeof ShowtimeScalarFieldEnum)[keyof typeof ShowtimeScalarFieldEnum]


  export const SeatReservationScalarFieldEnum: {
    id: 'id',
    showtimeId: 'showtimeId',
    seatId: 'seatId',
    status: 'status',
    heldBy: 'heldBy',
    heldExpiresAt: 'heldExpiresAt',
    bookingId: 'bookingId',
    createdAt: 'createdAt'
  };

  export type SeatReservationScalarFieldEnum = (typeof SeatReservationScalarFieldEnum)[keyof typeof SeatReservationScalarFieldEnum]


  export const BookingScalarFieldEnum: {
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

  export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum]


  export const BookingSeatScalarFieldEnum: {
    id: 'id',
    bookingId: 'bookingId',
    showtimeId: 'showtimeId',
    seatId: 'seatId',
    seatRow: 'seatRow',
    seatNumber: 'seatNumber',
    tier: 'tier',
    price: 'price'
  };

  export type BookingSeatScalarFieldEnum = (typeof BookingSeatScalarFieldEnum)[keyof typeof BookingSeatScalarFieldEnum]


  export const BookingAddonScalarFieldEnum: {
    id: 'id',
    bookingId: 'bookingId',
    addonId: 'addonId',
    name: 'name',
    price: 'price',
    quantity: 'quantity'
  };

  export type BookingAddonScalarFieldEnum = (typeof BookingAddonScalarFieldEnum)[keyof typeof BookingAddonScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
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

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const ReviewScalarFieldEnum: {
    id: 'id',
    movieId: 'movieId',
    userName: 'userName',
    userEmail: 'userEmail',
    rating: 'rating',
    comment: 'comment',
    createdAt: 'createdAt'
  };

  export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum]


  export const MovieCastScalarFieldEnum: {
    id: 'id',
    movieId: 'movieId',
    name: 'name',
    role: 'role',
    avatar: 'avatar'
  };

  export type MovieCastScalarFieldEnum = (typeof MovieCastScalarFieldEnum)[keyof typeof MovieCastScalarFieldEnum]


  export const CancellationAuditLogScalarFieldEnum: {
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

  export type CancellationAuditLogScalarFieldEnum = (typeof CancellationAuditLogScalarFieldEnum)[keyof typeof CancellationAuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    bookings?: BookingListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bookings?: BookingOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    bookings?: BookingListRelationFilter
  }, "id" | "email" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type MovieWhereInput = {
    AND?: MovieWhereInput | MovieWhereInput[]
    OR?: MovieWhereInput[]
    NOT?: MovieWhereInput | MovieWhereInput[]
    id?: StringFilter<"Movie"> | string
    title?: StringFilter<"Movie"> | string
    tagline?: StringNullableFilter<"Movie"> | string | null
    synopsis?: StringFilter<"Movie"> | string
    posterUrl?: StringFilter<"Movie"> | string
    backdropUrl?: StringFilter<"Movie"> | string
    originalLanguage?: StringFilter<"Movie"> | string
    durationMinutes?: IntFilter<"Movie"> | number
    rating?: DecimalFilter<"Movie"> | Decimal | DecimalJsLike | number | string
    votesCount?: StringFilter<"Movie"> | string
    ageRating?: StringFilter<"Movie"> | string
    releaseDate?: StringFilter<"Movie"> | string
    status?: StringFilter<"Movie"> | string
    director?: StringFilter<"Movie"> | string
    formats?: StringNullableListFilter<"Movie">
    featured?: BoolFilter<"Movie"> | boolean
    createdAt?: DateTimeFilter<"Movie"> | Date | string
    genre?: StringNullableListFilter<"Movie">
    languages?: StringNullableListFilter<"Movie">
    showtimes?: ShowtimeListRelationFilter
    reviews?: ReviewListRelationFilter
    cast?: MovieCastListRelationFilter
  }

  export type MovieOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    tagline?: SortOrderInput | SortOrder
    synopsis?: SortOrder
    posterUrl?: SortOrder
    backdropUrl?: SortOrder
    originalLanguage?: SortOrder
    durationMinutes?: SortOrder
    rating?: SortOrder
    votesCount?: SortOrder
    ageRating?: SortOrder
    releaseDate?: SortOrder
    status?: SortOrder
    director?: SortOrder
    formats?: SortOrder
    featured?: SortOrder
    createdAt?: SortOrder
    genre?: SortOrder
    languages?: SortOrder
    showtimes?: ShowtimeOrderByRelationAggregateInput
    reviews?: ReviewOrderByRelationAggregateInput
    cast?: MovieCastOrderByRelationAggregateInput
  }

  export type MovieWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MovieWhereInput | MovieWhereInput[]
    OR?: MovieWhereInput[]
    NOT?: MovieWhereInput | MovieWhereInput[]
    title?: StringFilter<"Movie"> | string
    tagline?: StringNullableFilter<"Movie"> | string | null
    synopsis?: StringFilter<"Movie"> | string
    posterUrl?: StringFilter<"Movie"> | string
    backdropUrl?: StringFilter<"Movie"> | string
    originalLanguage?: StringFilter<"Movie"> | string
    durationMinutes?: IntFilter<"Movie"> | number
    rating?: DecimalFilter<"Movie"> | Decimal | DecimalJsLike | number | string
    votesCount?: StringFilter<"Movie"> | string
    ageRating?: StringFilter<"Movie"> | string
    releaseDate?: StringFilter<"Movie"> | string
    status?: StringFilter<"Movie"> | string
    director?: StringFilter<"Movie"> | string
    formats?: StringNullableListFilter<"Movie">
    featured?: BoolFilter<"Movie"> | boolean
    createdAt?: DateTimeFilter<"Movie"> | Date | string
    genre?: StringNullableListFilter<"Movie">
    languages?: StringNullableListFilter<"Movie">
    showtimes?: ShowtimeListRelationFilter
    reviews?: ReviewListRelationFilter
    cast?: MovieCastListRelationFilter
  }, "id">

  export type MovieOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    tagline?: SortOrderInput | SortOrder
    synopsis?: SortOrder
    posterUrl?: SortOrder
    backdropUrl?: SortOrder
    originalLanguage?: SortOrder
    durationMinutes?: SortOrder
    rating?: SortOrder
    votesCount?: SortOrder
    ageRating?: SortOrder
    releaseDate?: SortOrder
    status?: SortOrder
    director?: SortOrder
    formats?: SortOrder
    featured?: SortOrder
    createdAt?: SortOrder
    genre?: SortOrder
    languages?: SortOrder
    _count?: MovieCountOrderByAggregateInput
    _avg?: MovieAvgOrderByAggregateInput
    _max?: MovieMaxOrderByAggregateInput
    _min?: MovieMinOrderByAggregateInput
    _sum?: MovieSumOrderByAggregateInput
  }

  export type MovieScalarWhereWithAggregatesInput = {
    AND?: MovieScalarWhereWithAggregatesInput | MovieScalarWhereWithAggregatesInput[]
    OR?: MovieScalarWhereWithAggregatesInput[]
    NOT?: MovieScalarWhereWithAggregatesInput | MovieScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Movie"> | string
    title?: StringWithAggregatesFilter<"Movie"> | string
    tagline?: StringNullableWithAggregatesFilter<"Movie"> | string | null
    synopsis?: StringWithAggregatesFilter<"Movie"> | string
    posterUrl?: StringWithAggregatesFilter<"Movie"> | string
    backdropUrl?: StringWithAggregatesFilter<"Movie"> | string
    originalLanguage?: StringWithAggregatesFilter<"Movie"> | string
    durationMinutes?: IntWithAggregatesFilter<"Movie"> | number
    rating?: DecimalWithAggregatesFilter<"Movie"> | Decimal | DecimalJsLike | number | string
    votesCount?: StringWithAggregatesFilter<"Movie"> | string
    ageRating?: StringWithAggregatesFilter<"Movie"> | string
    releaseDate?: StringWithAggregatesFilter<"Movie"> | string
    status?: StringWithAggregatesFilter<"Movie"> | string
    director?: StringWithAggregatesFilter<"Movie"> | string
    formats?: StringNullableListFilter<"Movie">
    featured?: BoolWithAggregatesFilter<"Movie"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Movie"> | Date | string
    genre?: StringNullableListFilter<"Movie">
    languages?: StringNullableListFilter<"Movie">
  }

  export type TheatreWhereInput = {
    AND?: TheatreWhereInput | TheatreWhereInput[]
    OR?: TheatreWhereInput[]
    NOT?: TheatreWhereInput | TheatreWhereInput[]
    id?: StringFilter<"Theatre"> | string
    name?: StringFilter<"Theatre"> | string
    city?: StringFilter<"Theatre"> | string
    address?: StringFilter<"Theatre"> | string
    facilities?: StringNullableListFilter<"Theatre">
    distance?: StringFilter<"Theatre"> | string
    timezone?: StringFilter<"Theatre"> | string
    screens?: ScreenListRelationFilter
    showtimes?: ShowtimeListRelationFilter
  }

  export type TheatreOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    address?: SortOrder
    facilities?: SortOrder
    distance?: SortOrder
    timezone?: SortOrder
    screens?: ScreenOrderByRelationAggregateInput
    showtimes?: ShowtimeOrderByRelationAggregateInput
  }

  export type TheatreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TheatreWhereInput | TheatreWhereInput[]
    OR?: TheatreWhereInput[]
    NOT?: TheatreWhereInput | TheatreWhereInput[]
    name?: StringFilter<"Theatre"> | string
    city?: StringFilter<"Theatre"> | string
    address?: StringFilter<"Theatre"> | string
    facilities?: StringNullableListFilter<"Theatre">
    distance?: StringFilter<"Theatre"> | string
    timezone?: StringFilter<"Theatre"> | string
    screens?: ScreenListRelationFilter
    showtimes?: ShowtimeListRelationFilter
  }, "id">

  export type TheatreOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    address?: SortOrder
    facilities?: SortOrder
    distance?: SortOrder
    timezone?: SortOrder
    _count?: TheatreCountOrderByAggregateInput
    _max?: TheatreMaxOrderByAggregateInput
    _min?: TheatreMinOrderByAggregateInput
  }

  export type TheatreScalarWhereWithAggregatesInput = {
    AND?: TheatreScalarWhereWithAggregatesInput | TheatreScalarWhereWithAggregatesInput[]
    OR?: TheatreScalarWhereWithAggregatesInput[]
    NOT?: TheatreScalarWhereWithAggregatesInput | TheatreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Theatre"> | string
    name?: StringWithAggregatesFilter<"Theatre"> | string
    city?: StringWithAggregatesFilter<"Theatre"> | string
    address?: StringWithAggregatesFilter<"Theatre"> | string
    facilities?: StringNullableListFilter<"Theatre">
    distance?: StringWithAggregatesFilter<"Theatre"> | string
    timezone?: StringWithAggregatesFilter<"Theatre"> | string
  }

  export type ScreenWhereInput = {
    AND?: ScreenWhereInput | ScreenWhereInput[]
    OR?: ScreenWhereInput[]
    NOT?: ScreenWhereInput | ScreenWhereInput[]
    id?: StringFilter<"Screen"> | string
    theatreId?: StringNullableFilter<"Screen"> | string | null
    name?: StringFilter<"Screen"> | string
    screenType?: StringFilter<"Screen"> | string
    theatre?: XOR<TheatreNullableRelationFilter, TheatreWhereInput> | null
    seats?: SeatListRelationFilter
    showtimes?: ShowtimeListRelationFilter
  }

  export type ScreenOrderByWithRelationInput = {
    id?: SortOrder
    theatreId?: SortOrderInput | SortOrder
    name?: SortOrder
    screenType?: SortOrder
    theatre?: TheatreOrderByWithRelationInput
    seats?: SeatOrderByRelationAggregateInput
    showtimes?: ShowtimeOrderByRelationAggregateInput
  }

  export type ScreenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScreenWhereInput | ScreenWhereInput[]
    OR?: ScreenWhereInput[]
    NOT?: ScreenWhereInput | ScreenWhereInput[]
    theatreId?: StringNullableFilter<"Screen"> | string | null
    name?: StringFilter<"Screen"> | string
    screenType?: StringFilter<"Screen"> | string
    theatre?: XOR<TheatreNullableRelationFilter, TheatreWhereInput> | null
    seats?: SeatListRelationFilter
    showtimes?: ShowtimeListRelationFilter
  }, "id">

  export type ScreenOrderByWithAggregationInput = {
    id?: SortOrder
    theatreId?: SortOrderInput | SortOrder
    name?: SortOrder
    screenType?: SortOrder
    _count?: ScreenCountOrderByAggregateInput
    _max?: ScreenMaxOrderByAggregateInput
    _min?: ScreenMinOrderByAggregateInput
  }

  export type ScreenScalarWhereWithAggregatesInput = {
    AND?: ScreenScalarWhereWithAggregatesInput | ScreenScalarWhereWithAggregatesInput[]
    OR?: ScreenScalarWhereWithAggregatesInput[]
    NOT?: ScreenScalarWhereWithAggregatesInput | ScreenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Screen"> | string
    theatreId?: StringNullableWithAggregatesFilter<"Screen"> | string | null
    name?: StringWithAggregatesFilter<"Screen"> | string
    screenType?: StringWithAggregatesFilter<"Screen"> | string
  }

  export type SeatWhereInput = {
    AND?: SeatWhereInput | SeatWhereInput[]
    OR?: SeatWhereInput[]
    NOT?: SeatWhereInput | SeatWhereInput[]
    id?: StringFilter<"Seat"> | string
    screenId?: StringNullableFilter<"Seat"> | string | null
    row?: StringFilter<"Seat"> | string
    number?: IntFilter<"Seat"> | number
    seatNumber?: StringNullableFilter<"Seat"> | string | null
    tier?: StringFilter<"Seat"> | string
    basePrice?: DecimalFilter<"Seat"> | Decimal | DecimalJsLike | number | string
    screen?: XOR<ScreenNullableRelationFilter, ScreenWhereInput> | null
    reservations?: SeatReservationListRelationFilter
  }

  export type SeatOrderByWithRelationInput = {
    id?: SortOrder
    screenId?: SortOrderInput | SortOrder
    row?: SortOrder
    number?: SortOrder
    seatNumber?: SortOrderInput | SortOrder
    tier?: SortOrder
    basePrice?: SortOrder
    screen?: ScreenOrderByWithRelationInput
    reservations?: SeatReservationOrderByRelationAggregateInput
  }

  export type SeatWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SeatWhereInput | SeatWhereInput[]
    OR?: SeatWhereInput[]
    NOT?: SeatWhereInput | SeatWhereInput[]
    screenId?: StringNullableFilter<"Seat"> | string | null
    row?: StringFilter<"Seat"> | string
    number?: IntFilter<"Seat"> | number
    seatNumber?: StringNullableFilter<"Seat"> | string | null
    tier?: StringFilter<"Seat"> | string
    basePrice?: DecimalFilter<"Seat"> | Decimal | DecimalJsLike | number | string
    screen?: XOR<ScreenNullableRelationFilter, ScreenWhereInput> | null
    reservations?: SeatReservationListRelationFilter
  }, "id">

  export type SeatOrderByWithAggregationInput = {
    id?: SortOrder
    screenId?: SortOrderInput | SortOrder
    row?: SortOrder
    number?: SortOrder
    seatNumber?: SortOrderInput | SortOrder
    tier?: SortOrder
    basePrice?: SortOrder
    _count?: SeatCountOrderByAggregateInput
    _avg?: SeatAvgOrderByAggregateInput
    _max?: SeatMaxOrderByAggregateInput
    _min?: SeatMinOrderByAggregateInput
    _sum?: SeatSumOrderByAggregateInput
  }

  export type SeatScalarWhereWithAggregatesInput = {
    AND?: SeatScalarWhereWithAggregatesInput | SeatScalarWhereWithAggregatesInput[]
    OR?: SeatScalarWhereWithAggregatesInput[]
    NOT?: SeatScalarWhereWithAggregatesInput | SeatScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Seat"> | string
    screenId?: StringNullableWithAggregatesFilter<"Seat"> | string | null
    row?: StringWithAggregatesFilter<"Seat"> | string
    number?: IntWithAggregatesFilter<"Seat"> | number
    seatNumber?: StringNullableWithAggregatesFilter<"Seat"> | string | null
    tier?: StringWithAggregatesFilter<"Seat"> | string
    basePrice?: DecimalWithAggregatesFilter<"Seat"> | Decimal | DecimalJsLike | number | string
  }

  export type ShowtimeWhereInput = {
    AND?: ShowtimeWhereInput | ShowtimeWhereInput[]
    OR?: ShowtimeWhereInput[]
    NOT?: ShowtimeWhereInput | ShowtimeWhereInput[]
    id?: StringFilter<"Showtime"> | string
    cinemaId?: StringNullableFilter<"Showtime"> | string | null
    screenId?: StringNullableFilter<"Showtime"> | string | null
    movieId?: StringNullableFilter<"Showtime"> | string | null
    date?: StringFilter<"Showtime"> | string
    time?: StringFilter<"Showtime"> | string
    format?: StringFilter<"Showtime"> | string
    hallName?: StringFilter<"Showtime"> | string
    language?: StringFilter<"Showtime"> | string
    priceMultiplier?: DecimalFilter<"Showtime"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Showtime"> | Date | string
    hall?: StringNullableFilter<"Showtime"> | string | null
    cinema?: XOR<TheatreNullableRelationFilter, TheatreWhereInput> | null
    screen?: XOR<ScreenNullableRelationFilter, ScreenWhereInput> | null
    movie?: XOR<MovieNullableRelationFilter, MovieWhereInput> | null
    reservations?: SeatReservationListRelationFilter
    bookings?: BookingListRelationFilter
  }

  export type ShowtimeOrderByWithRelationInput = {
    id?: SortOrder
    cinemaId?: SortOrderInput | SortOrder
    screenId?: SortOrderInput | SortOrder
    movieId?: SortOrderInput | SortOrder
    date?: SortOrder
    time?: SortOrder
    format?: SortOrder
    hallName?: SortOrder
    language?: SortOrder
    priceMultiplier?: SortOrder
    createdAt?: SortOrder
    hall?: SortOrderInput | SortOrder
    cinema?: TheatreOrderByWithRelationInput
    screen?: ScreenOrderByWithRelationInput
    movie?: MovieOrderByWithRelationInput
    reservations?: SeatReservationOrderByRelationAggregateInput
    bookings?: BookingOrderByRelationAggregateInput
  }

  export type ShowtimeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ShowtimeWhereInput | ShowtimeWhereInput[]
    OR?: ShowtimeWhereInput[]
    NOT?: ShowtimeWhereInput | ShowtimeWhereInput[]
    cinemaId?: StringNullableFilter<"Showtime"> | string | null
    screenId?: StringNullableFilter<"Showtime"> | string | null
    movieId?: StringNullableFilter<"Showtime"> | string | null
    date?: StringFilter<"Showtime"> | string
    time?: StringFilter<"Showtime"> | string
    format?: StringFilter<"Showtime"> | string
    hallName?: StringFilter<"Showtime"> | string
    language?: StringFilter<"Showtime"> | string
    priceMultiplier?: DecimalFilter<"Showtime"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Showtime"> | Date | string
    hall?: StringNullableFilter<"Showtime"> | string | null
    cinema?: XOR<TheatreNullableRelationFilter, TheatreWhereInput> | null
    screen?: XOR<ScreenNullableRelationFilter, ScreenWhereInput> | null
    movie?: XOR<MovieNullableRelationFilter, MovieWhereInput> | null
    reservations?: SeatReservationListRelationFilter
    bookings?: BookingListRelationFilter
  }, "id">

  export type ShowtimeOrderByWithAggregationInput = {
    id?: SortOrder
    cinemaId?: SortOrderInput | SortOrder
    screenId?: SortOrderInput | SortOrder
    movieId?: SortOrderInput | SortOrder
    date?: SortOrder
    time?: SortOrder
    format?: SortOrder
    hallName?: SortOrder
    language?: SortOrder
    priceMultiplier?: SortOrder
    createdAt?: SortOrder
    hall?: SortOrderInput | SortOrder
    _count?: ShowtimeCountOrderByAggregateInput
    _avg?: ShowtimeAvgOrderByAggregateInput
    _max?: ShowtimeMaxOrderByAggregateInput
    _min?: ShowtimeMinOrderByAggregateInput
    _sum?: ShowtimeSumOrderByAggregateInput
  }

  export type ShowtimeScalarWhereWithAggregatesInput = {
    AND?: ShowtimeScalarWhereWithAggregatesInput | ShowtimeScalarWhereWithAggregatesInput[]
    OR?: ShowtimeScalarWhereWithAggregatesInput[]
    NOT?: ShowtimeScalarWhereWithAggregatesInput | ShowtimeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Showtime"> | string
    cinemaId?: StringNullableWithAggregatesFilter<"Showtime"> | string | null
    screenId?: StringNullableWithAggregatesFilter<"Showtime"> | string | null
    movieId?: StringNullableWithAggregatesFilter<"Showtime"> | string | null
    date?: StringWithAggregatesFilter<"Showtime"> | string
    time?: StringWithAggregatesFilter<"Showtime"> | string
    format?: StringWithAggregatesFilter<"Showtime"> | string
    hallName?: StringWithAggregatesFilter<"Showtime"> | string
    language?: StringWithAggregatesFilter<"Showtime"> | string
    priceMultiplier?: DecimalWithAggregatesFilter<"Showtime"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Showtime"> | Date | string
    hall?: StringNullableWithAggregatesFilter<"Showtime"> | string | null
  }

  export type SeatReservationWhereInput = {
    AND?: SeatReservationWhereInput | SeatReservationWhereInput[]
    OR?: SeatReservationWhereInput[]
    NOT?: SeatReservationWhereInput | SeatReservationWhereInput[]
    id?: StringFilter<"SeatReservation"> | string
    showtimeId?: StringFilter<"SeatReservation"> | string
    seatId?: StringFilter<"SeatReservation"> | string
    status?: StringFilter<"SeatReservation"> | string
    heldBy?: StringNullableFilter<"SeatReservation"> | string | null
    heldExpiresAt?: DateTimeNullableFilter<"SeatReservation"> | Date | string | null
    bookingId?: StringNullableFilter<"SeatReservation"> | string | null
    createdAt?: DateTimeFilter<"SeatReservation"> | Date | string
    showtime?: XOR<ShowtimeRelationFilter, ShowtimeWhereInput>
    seat?: XOR<SeatRelationFilter, SeatWhereInput>
  }

  export type SeatReservationOrderByWithRelationInput = {
    id?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    status?: SortOrder
    heldBy?: SortOrderInput | SortOrder
    heldExpiresAt?: SortOrderInput | SortOrder
    bookingId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    showtime?: ShowtimeOrderByWithRelationInput
    seat?: SeatOrderByWithRelationInput
  }

  export type SeatReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    showtimeId_seatId?: SeatReservationShowtimeIdSeatIdCompoundUniqueInput
    AND?: SeatReservationWhereInput | SeatReservationWhereInput[]
    OR?: SeatReservationWhereInput[]
    NOT?: SeatReservationWhereInput | SeatReservationWhereInput[]
    showtimeId?: StringFilter<"SeatReservation"> | string
    seatId?: StringFilter<"SeatReservation"> | string
    status?: StringFilter<"SeatReservation"> | string
    heldBy?: StringNullableFilter<"SeatReservation"> | string | null
    heldExpiresAt?: DateTimeNullableFilter<"SeatReservation"> | Date | string | null
    bookingId?: StringNullableFilter<"SeatReservation"> | string | null
    createdAt?: DateTimeFilter<"SeatReservation"> | Date | string
    showtime?: XOR<ShowtimeRelationFilter, ShowtimeWhereInput>
    seat?: XOR<SeatRelationFilter, SeatWhereInput>
  }, "id" | "showtimeId_seatId">

  export type SeatReservationOrderByWithAggregationInput = {
    id?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    status?: SortOrder
    heldBy?: SortOrderInput | SortOrder
    heldExpiresAt?: SortOrderInput | SortOrder
    bookingId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SeatReservationCountOrderByAggregateInput
    _max?: SeatReservationMaxOrderByAggregateInput
    _min?: SeatReservationMinOrderByAggregateInput
  }

  export type SeatReservationScalarWhereWithAggregatesInput = {
    AND?: SeatReservationScalarWhereWithAggregatesInput | SeatReservationScalarWhereWithAggregatesInput[]
    OR?: SeatReservationScalarWhereWithAggregatesInput[]
    NOT?: SeatReservationScalarWhereWithAggregatesInput | SeatReservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SeatReservation"> | string
    showtimeId?: StringWithAggregatesFilter<"SeatReservation"> | string
    seatId?: StringWithAggregatesFilter<"SeatReservation"> | string
    status?: StringWithAggregatesFilter<"SeatReservation"> | string
    heldBy?: StringNullableWithAggregatesFilter<"SeatReservation"> | string | null
    heldExpiresAt?: DateTimeNullableWithAggregatesFilter<"SeatReservation"> | Date | string | null
    bookingId?: StringNullableWithAggregatesFilter<"SeatReservation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SeatReservation"> | Date | string
  }

  export type BookingWhereInput = {
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    id?: StringFilter<"Booking"> | string
    userId?: StringNullableFilter<"Booking"> | string | null
    showtimeId?: StringFilter<"Booking"> | string
    customerName?: StringFilter<"Booking"> | string
    customerEmail?: StringFilter<"Booking"> | string
    customerPhone?: StringFilter<"Booking"> | string
    subtotal?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFilter<"Booking"> | string
    status?: StringFilter<"Booking"> | string
    refundStatus?: StringFilter<"Booking"> | string
    bookedAt?: DateTimeFilter<"Booking"> | Date | string
    cancelledAt?: DateTimeNullableFilter<"Booking"> | Date | string | null
    refundAmount?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    refundId?: StringNullableFilter<"Booking"> | string | null
    bookingRef?: StringNullableFilter<"Booking"> | string | null
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    showtime?: XOR<ShowtimeRelationFilter, ShowtimeWhereInput>
    payment?: XOR<PaymentNullableRelationFilter, PaymentWhereInput> | null
    seats?: BookingSeatListRelationFilter
    addons?: BookingAddonListRelationFilter
    auditLogs?: CancellationAuditLogListRelationFilter
  }

  export type BookingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    showtimeId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    subtotal?: SortOrder
    convenienceFee?: SortOrder
    tax?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    refundStatus?: SortOrder
    bookedAt?: SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrderInput | SortOrder
    bookingRef?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    showtime?: ShowtimeOrderByWithRelationInput
    payment?: PaymentOrderByWithRelationInput
    seats?: BookingSeatOrderByRelationAggregateInput
    addons?: BookingAddonOrderByRelationAggregateInput
    auditLogs?: CancellationAuditLogOrderByRelationAggregateInput
  }

  export type BookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    userId?: StringNullableFilter<"Booking"> | string | null
    showtimeId?: StringFilter<"Booking"> | string
    customerName?: StringFilter<"Booking"> | string
    customerEmail?: StringFilter<"Booking"> | string
    customerPhone?: StringFilter<"Booking"> | string
    subtotal?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFilter<"Booking"> | string
    status?: StringFilter<"Booking"> | string
    refundStatus?: StringFilter<"Booking"> | string
    bookedAt?: DateTimeFilter<"Booking"> | Date | string
    cancelledAt?: DateTimeNullableFilter<"Booking"> | Date | string | null
    refundAmount?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    refundId?: StringNullableFilter<"Booking"> | string | null
    bookingRef?: StringNullableFilter<"Booking"> | string | null
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    showtime?: XOR<ShowtimeRelationFilter, ShowtimeWhereInput>
    payment?: XOR<PaymentNullableRelationFilter, PaymentWhereInput> | null
    seats?: BookingSeatListRelationFilter
    addons?: BookingAddonListRelationFilter
    auditLogs?: CancellationAuditLogListRelationFilter
  }, "id">

  export type BookingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    showtimeId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    subtotal?: SortOrder
    convenienceFee?: SortOrder
    tax?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    refundStatus?: SortOrder
    bookedAt?: SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrderInput | SortOrder
    bookingRef?: SortOrderInput | SortOrder
    _count?: BookingCountOrderByAggregateInput
    _avg?: BookingAvgOrderByAggregateInput
    _max?: BookingMaxOrderByAggregateInput
    _min?: BookingMinOrderByAggregateInput
    _sum?: BookingSumOrderByAggregateInput
  }

  export type BookingScalarWhereWithAggregatesInput = {
    AND?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    OR?: BookingScalarWhereWithAggregatesInput[]
    NOT?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Booking"> | string
    userId?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    showtimeId?: StringWithAggregatesFilter<"Booking"> | string
    customerName?: StringWithAggregatesFilter<"Booking"> | string
    customerEmail?: StringWithAggregatesFilter<"Booking"> | string
    customerPhone?: StringWithAggregatesFilter<"Booking"> | string
    subtotal?: DecimalWithAggregatesFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalWithAggregatesFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalWithAggregatesFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalWithAggregatesFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringWithAggregatesFilter<"Booking"> | string
    status?: StringWithAggregatesFilter<"Booking"> | string
    refundStatus?: StringWithAggregatesFilter<"Booking"> | string
    bookedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    cancelledAt?: DateTimeNullableWithAggregatesFilter<"Booking"> | Date | string | null
    refundAmount?: DecimalWithAggregatesFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalWithAggregatesFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    refundId?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    bookingRef?: StringNullableWithAggregatesFilter<"Booking"> | string | null
  }

  export type BookingSeatWhereInput = {
    AND?: BookingSeatWhereInput | BookingSeatWhereInput[]
    OR?: BookingSeatWhereInput[]
    NOT?: BookingSeatWhereInput | BookingSeatWhereInput[]
    id?: IntFilter<"BookingSeat"> | number
    bookingId?: StringFilter<"BookingSeat"> | string
    showtimeId?: StringFilter<"BookingSeat"> | string
    seatId?: StringFilter<"BookingSeat"> | string
    seatRow?: StringFilter<"BookingSeat"> | string
    seatNumber?: IntFilter<"BookingSeat"> | number
    tier?: StringFilter<"BookingSeat"> | string
    price?: DecimalFilter<"BookingSeat"> | Decimal | DecimalJsLike | number | string
    booking?: XOR<BookingRelationFilter, BookingWhereInput>
  }

  export type BookingSeatOrderByWithRelationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    seatRow?: SortOrder
    seatNumber?: SortOrder
    tier?: SortOrder
    price?: SortOrder
    booking?: BookingOrderByWithRelationInput
  }

  export type BookingSeatWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    unique_seat_per_show?: BookingSeatUnique_seat_per_showCompoundUniqueInput
    AND?: BookingSeatWhereInput | BookingSeatWhereInput[]
    OR?: BookingSeatWhereInput[]
    NOT?: BookingSeatWhereInput | BookingSeatWhereInput[]
    bookingId?: StringFilter<"BookingSeat"> | string
    showtimeId?: StringFilter<"BookingSeat"> | string
    seatId?: StringFilter<"BookingSeat"> | string
    seatRow?: StringFilter<"BookingSeat"> | string
    seatNumber?: IntFilter<"BookingSeat"> | number
    tier?: StringFilter<"BookingSeat"> | string
    price?: DecimalFilter<"BookingSeat"> | Decimal | DecimalJsLike | number | string
    booking?: XOR<BookingRelationFilter, BookingWhereInput>
  }, "id" | "unique_seat_per_show">

  export type BookingSeatOrderByWithAggregationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    seatRow?: SortOrder
    seatNumber?: SortOrder
    tier?: SortOrder
    price?: SortOrder
    _count?: BookingSeatCountOrderByAggregateInput
    _avg?: BookingSeatAvgOrderByAggregateInput
    _max?: BookingSeatMaxOrderByAggregateInput
    _min?: BookingSeatMinOrderByAggregateInput
    _sum?: BookingSeatSumOrderByAggregateInput
  }

  export type BookingSeatScalarWhereWithAggregatesInput = {
    AND?: BookingSeatScalarWhereWithAggregatesInput | BookingSeatScalarWhereWithAggregatesInput[]
    OR?: BookingSeatScalarWhereWithAggregatesInput[]
    NOT?: BookingSeatScalarWhereWithAggregatesInput | BookingSeatScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BookingSeat"> | number
    bookingId?: StringWithAggregatesFilter<"BookingSeat"> | string
    showtimeId?: StringWithAggregatesFilter<"BookingSeat"> | string
    seatId?: StringWithAggregatesFilter<"BookingSeat"> | string
    seatRow?: StringWithAggregatesFilter<"BookingSeat"> | string
    seatNumber?: IntWithAggregatesFilter<"BookingSeat"> | number
    tier?: StringWithAggregatesFilter<"BookingSeat"> | string
    price?: DecimalWithAggregatesFilter<"BookingSeat"> | Decimal | DecimalJsLike | number | string
  }

  export type BookingAddonWhereInput = {
    AND?: BookingAddonWhereInput | BookingAddonWhereInput[]
    OR?: BookingAddonWhereInput[]
    NOT?: BookingAddonWhereInput | BookingAddonWhereInput[]
    id?: IntFilter<"BookingAddon"> | number
    bookingId?: StringFilter<"BookingAddon"> | string
    addonId?: StringFilter<"BookingAddon"> | string
    name?: StringFilter<"BookingAddon"> | string
    price?: DecimalFilter<"BookingAddon"> | Decimal | DecimalJsLike | number | string
    quantity?: IntFilter<"BookingAddon"> | number
    booking?: XOR<BookingRelationFilter, BookingWhereInput>
  }

  export type BookingAddonOrderByWithRelationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    addonId?: SortOrder
    name?: SortOrder
    price?: SortOrder
    quantity?: SortOrder
    booking?: BookingOrderByWithRelationInput
  }

  export type BookingAddonWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BookingAddonWhereInput | BookingAddonWhereInput[]
    OR?: BookingAddonWhereInput[]
    NOT?: BookingAddonWhereInput | BookingAddonWhereInput[]
    bookingId?: StringFilter<"BookingAddon"> | string
    addonId?: StringFilter<"BookingAddon"> | string
    name?: StringFilter<"BookingAddon"> | string
    price?: DecimalFilter<"BookingAddon"> | Decimal | DecimalJsLike | number | string
    quantity?: IntFilter<"BookingAddon"> | number
    booking?: XOR<BookingRelationFilter, BookingWhereInput>
  }, "id">

  export type BookingAddonOrderByWithAggregationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    addonId?: SortOrder
    name?: SortOrder
    price?: SortOrder
    quantity?: SortOrder
    _count?: BookingAddonCountOrderByAggregateInput
    _avg?: BookingAddonAvgOrderByAggregateInput
    _max?: BookingAddonMaxOrderByAggregateInput
    _min?: BookingAddonMinOrderByAggregateInput
    _sum?: BookingAddonSumOrderByAggregateInput
  }

  export type BookingAddonScalarWhereWithAggregatesInput = {
    AND?: BookingAddonScalarWhereWithAggregatesInput | BookingAddonScalarWhereWithAggregatesInput[]
    OR?: BookingAddonScalarWhereWithAggregatesInput[]
    NOT?: BookingAddonScalarWhereWithAggregatesInput | BookingAddonScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BookingAddon"> | number
    bookingId?: StringWithAggregatesFilter<"BookingAddon"> | string
    addonId?: StringWithAggregatesFilter<"BookingAddon"> | string
    name?: StringWithAggregatesFilter<"BookingAddon"> | string
    price?: DecimalWithAggregatesFilter<"BookingAddon"> | Decimal | DecimalJsLike | number | string
    quantity?: IntWithAggregatesFilter<"BookingAddon"> | number
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    bookingId?: StringNullableFilter<"Payment"> | string | null
    provider?: StringFilter<"Payment"> | string
    orderId?: StringFilter<"Payment"> | string
    paymentId?: StringNullableFilter<"Payment"> | string | null
    signature?: StringNullableFilter<"Payment"> | string | null
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    refundId?: StringNullableFilter<"Payment"> | string | null
    refundAmount?: DecimalNullableFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    booking?: XOR<BookingNullableRelationFilter, BookingWhereInput> | null
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    bookingId?: SortOrderInput | SortOrder
    provider?: SortOrder
    orderId?: SortOrder
    paymentId?: SortOrderInput | SortOrder
    signature?: SortOrderInput | SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    refundId?: SortOrderInput | SortOrder
    refundAmount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    booking?: BookingOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bookingId?: string
    orderId?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    provider?: StringFilter<"Payment"> | string
    paymentId?: StringNullableFilter<"Payment"> | string | null
    signature?: StringNullableFilter<"Payment"> | string | null
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    refundId?: StringNullableFilter<"Payment"> | string | null
    refundAmount?: DecimalNullableFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    booking?: XOR<BookingNullableRelationFilter, BookingWhereInput> | null
  }, "id" | "bookingId" | "orderId">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    bookingId?: SortOrderInput | SortOrder
    provider?: SortOrder
    orderId?: SortOrder
    paymentId?: SortOrderInput | SortOrder
    signature?: SortOrderInput | SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    refundId?: SortOrderInput | SortOrder
    refundAmount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    bookingId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    provider?: StringWithAggregatesFilter<"Payment"> | string
    orderId?: StringWithAggregatesFilter<"Payment"> | string
    paymentId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    signature?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    amount?: DecimalWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Payment"> | string
    status?: StringWithAggregatesFilter<"Payment"> | string
    refundId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    refundAmount?: DecimalNullableWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
  }

  export type ReviewWhereInput = {
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    id?: StringFilter<"Review"> | string
    movieId?: StringFilter<"Review"> | string
    userName?: StringFilter<"Review"> | string
    userEmail?: StringNullableFilter<"Review"> | string | null
    rating?: DecimalFilter<"Review"> | Decimal | DecimalJsLike | number | string
    comment?: StringFilter<"Review"> | string
    createdAt?: DateTimeFilter<"Review"> | Date | string
    movie?: XOR<MovieRelationFilter, MovieWhereInput>
  }

  export type ReviewOrderByWithRelationInput = {
    id?: SortOrder
    movieId?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrderInput | SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
    movie?: MovieOrderByWithRelationInput
  }

  export type ReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    movieId?: StringFilter<"Review"> | string
    userName?: StringFilter<"Review"> | string
    userEmail?: StringNullableFilter<"Review"> | string | null
    rating?: DecimalFilter<"Review"> | Decimal | DecimalJsLike | number | string
    comment?: StringFilter<"Review"> | string
    createdAt?: DateTimeFilter<"Review"> | Date | string
    movie?: XOR<MovieRelationFilter, MovieWhereInput>
  }, "id">

  export type ReviewOrderByWithAggregationInput = {
    id?: SortOrder
    movieId?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrderInput | SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
    _count?: ReviewCountOrderByAggregateInput
    _avg?: ReviewAvgOrderByAggregateInput
    _max?: ReviewMaxOrderByAggregateInput
    _min?: ReviewMinOrderByAggregateInput
    _sum?: ReviewSumOrderByAggregateInput
  }

  export type ReviewScalarWhereWithAggregatesInput = {
    AND?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    OR?: ReviewScalarWhereWithAggregatesInput[]
    NOT?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Review"> | string
    movieId?: StringWithAggregatesFilter<"Review"> | string
    userName?: StringWithAggregatesFilter<"Review"> | string
    userEmail?: StringNullableWithAggregatesFilter<"Review"> | string | null
    rating?: DecimalWithAggregatesFilter<"Review"> | Decimal | DecimalJsLike | number | string
    comment?: StringWithAggregatesFilter<"Review"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
  }

  export type MovieCastWhereInput = {
    AND?: MovieCastWhereInput | MovieCastWhereInput[]
    OR?: MovieCastWhereInput[]
    NOT?: MovieCastWhereInput | MovieCastWhereInput[]
    id?: IntFilter<"MovieCast"> | number
    movieId?: StringFilter<"MovieCast"> | string
    name?: StringFilter<"MovieCast"> | string
    role?: StringFilter<"MovieCast"> | string
    avatar?: StringFilter<"MovieCast"> | string
    movie?: XOR<MovieRelationFilter, MovieWhereInput>
  }

  export type MovieCastOrderByWithRelationInput = {
    id?: SortOrder
    movieId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    movie?: MovieOrderByWithRelationInput
  }

  export type MovieCastWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MovieCastWhereInput | MovieCastWhereInput[]
    OR?: MovieCastWhereInput[]
    NOT?: MovieCastWhereInput | MovieCastWhereInput[]
    movieId?: StringFilter<"MovieCast"> | string
    name?: StringFilter<"MovieCast"> | string
    role?: StringFilter<"MovieCast"> | string
    avatar?: StringFilter<"MovieCast"> | string
    movie?: XOR<MovieRelationFilter, MovieWhereInput>
  }, "id">

  export type MovieCastOrderByWithAggregationInput = {
    id?: SortOrder
    movieId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    _count?: MovieCastCountOrderByAggregateInput
    _avg?: MovieCastAvgOrderByAggregateInput
    _max?: MovieCastMaxOrderByAggregateInput
    _min?: MovieCastMinOrderByAggregateInput
    _sum?: MovieCastSumOrderByAggregateInput
  }

  export type MovieCastScalarWhereWithAggregatesInput = {
    AND?: MovieCastScalarWhereWithAggregatesInput | MovieCastScalarWhereWithAggregatesInput[]
    OR?: MovieCastScalarWhereWithAggregatesInput[]
    NOT?: MovieCastScalarWhereWithAggregatesInput | MovieCastScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MovieCast"> | number
    movieId?: StringWithAggregatesFilter<"MovieCast"> | string
    name?: StringWithAggregatesFilter<"MovieCast"> | string
    role?: StringWithAggregatesFilter<"MovieCast"> | string
    avatar?: StringWithAggregatesFilter<"MovieCast"> | string
  }

  export type CancellationAuditLogWhereInput = {
    AND?: CancellationAuditLogWhereInput | CancellationAuditLogWhereInput[]
    OR?: CancellationAuditLogWhereInput[]
    NOT?: CancellationAuditLogWhereInput | CancellationAuditLogWhereInput[]
    id?: StringFilter<"CancellationAuditLog"> | string
    bookingId?: StringNullableFilter<"CancellationAuditLog"> | string | null
    bookingRef?: StringFilter<"CancellationAuditLog"> | string
    action?: StringFilter<"CancellationAuditLog"> | string
    actorEmail?: StringFilter<"CancellationAuditLog"> | string
    previousStatus?: StringFilter<"CancellationAuditLog"> | string
    newStatus?: StringFilter<"CancellationAuditLog"> | string
    refundStatus?: StringFilter<"CancellationAuditLog"> | string
    refundAmount?: DecimalFilter<"CancellationAuditLog"> | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFilter<"CancellationAuditLog"> | Decimal | DecimalJsLike | number | string
    refundId?: StringNullableFilter<"CancellationAuditLog"> | string | null
    failureReason?: StringNullableFilter<"CancellationAuditLog"> | string | null
    notes?: StringNullableFilter<"CancellationAuditLog"> | string | null
    createdAt?: DateTimeFilter<"CancellationAuditLog"> | Date | string
    booking?: XOR<BookingNullableRelationFilter, BookingWhereInput> | null
  }

  export type CancellationAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    bookingId?: SortOrderInput | SortOrder
    bookingRef?: SortOrder
    action?: SortOrder
    actorEmail?: SortOrder
    previousStatus?: SortOrder
    newStatus?: SortOrder
    refundStatus?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    booking?: BookingOrderByWithRelationInput
  }

  export type CancellationAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CancellationAuditLogWhereInput | CancellationAuditLogWhereInput[]
    OR?: CancellationAuditLogWhereInput[]
    NOT?: CancellationAuditLogWhereInput | CancellationAuditLogWhereInput[]
    bookingId?: StringNullableFilter<"CancellationAuditLog"> | string | null
    bookingRef?: StringFilter<"CancellationAuditLog"> | string
    action?: StringFilter<"CancellationAuditLog"> | string
    actorEmail?: StringFilter<"CancellationAuditLog"> | string
    previousStatus?: StringFilter<"CancellationAuditLog"> | string
    newStatus?: StringFilter<"CancellationAuditLog"> | string
    refundStatus?: StringFilter<"CancellationAuditLog"> | string
    refundAmount?: DecimalFilter<"CancellationAuditLog"> | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFilter<"CancellationAuditLog"> | Decimal | DecimalJsLike | number | string
    refundId?: StringNullableFilter<"CancellationAuditLog"> | string | null
    failureReason?: StringNullableFilter<"CancellationAuditLog"> | string | null
    notes?: StringNullableFilter<"CancellationAuditLog"> | string | null
    createdAt?: DateTimeFilter<"CancellationAuditLog"> | Date | string
    booking?: XOR<BookingNullableRelationFilter, BookingWhereInput> | null
  }, "id">

  export type CancellationAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    bookingId?: SortOrderInput | SortOrder
    bookingRef?: SortOrder
    action?: SortOrder
    actorEmail?: SortOrder
    previousStatus?: SortOrder
    newStatus?: SortOrder
    refundStatus?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CancellationAuditLogCountOrderByAggregateInput
    _avg?: CancellationAuditLogAvgOrderByAggregateInput
    _max?: CancellationAuditLogMaxOrderByAggregateInput
    _min?: CancellationAuditLogMinOrderByAggregateInput
    _sum?: CancellationAuditLogSumOrderByAggregateInput
  }

  export type CancellationAuditLogScalarWhereWithAggregatesInput = {
    AND?: CancellationAuditLogScalarWhereWithAggregatesInput | CancellationAuditLogScalarWhereWithAggregatesInput[]
    OR?: CancellationAuditLogScalarWhereWithAggregatesInput[]
    NOT?: CancellationAuditLogScalarWhereWithAggregatesInput | CancellationAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CancellationAuditLog"> | string
    bookingId?: StringNullableWithAggregatesFilter<"CancellationAuditLog"> | string | null
    bookingRef?: StringWithAggregatesFilter<"CancellationAuditLog"> | string
    action?: StringWithAggregatesFilter<"CancellationAuditLog"> | string
    actorEmail?: StringWithAggregatesFilter<"CancellationAuditLog"> | string
    previousStatus?: StringWithAggregatesFilter<"CancellationAuditLog"> | string
    newStatus?: StringWithAggregatesFilter<"CancellationAuditLog"> | string
    refundStatus?: StringWithAggregatesFilter<"CancellationAuditLog"> | string
    refundAmount?: DecimalWithAggregatesFilter<"CancellationAuditLog"> | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalWithAggregatesFilter<"CancellationAuditLog"> | Decimal | DecimalJsLike | number | string
    refundId?: StringNullableWithAggregatesFilter<"CancellationAuditLog"> | string | null
    failureReason?: StringNullableWithAggregatesFilter<"CancellationAuditLog"> | string | null
    notes?: StringNullableWithAggregatesFilter<"CancellationAuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CancellationAuditLog"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovieCreateInput = {
    id: string
    title: string
    tagline?: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage?: string
    durationMinutes: number
    rating?: Decimal | DecimalJsLike | number | string
    votesCount?: string
    ageRating?: string
    releaseDate?: string
    status?: string
    director?: string
    formats?: MovieCreateformatsInput | string[]
    featured?: boolean
    createdAt?: Date | string
    genre?: MovieCreategenreInput | string[]
    languages?: MovieCreatelanguagesInput | string[]
    showtimes?: ShowtimeCreateNestedManyWithoutMovieInput
    reviews?: ReviewCreateNestedManyWithoutMovieInput
    cast?: MovieCastCreateNestedManyWithoutMovieInput
  }

  export type MovieUncheckedCreateInput = {
    id: string
    title: string
    tagline?: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage?: string
    durationMinutes: number
    rating?: Decimal | DecimalJsLike | number | string
    votesCount?: string
    ageRating?: string
    releaseDate?: string
    status?: string
    director?: string
    formats?: MovieCreateformatsInput | string[]
    featured?: boolean
    createdAt?: Date | string
    genre?: MovieCreategenreInput | string[]
    languages?: MovieCreatelanguagesInput | string[]
    showtimes?: ShowtimeUncheckedCreateNestedManyWithoutMovieInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutMovieInput
    cast?: MovieCastUncheckedCreateNestedManyWithoutMovieInput
  }

  export type MovieUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
    showtimes?: ShowtimeUpdateManyWithoutMovieNestedInput
    reviews?: ReviewUpdateManyWithoutMovieNestedInput
    cast?: MovieCastUpdateManyWithoutMovieNestedInput
  }

  export type MovieUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
    showtimes?: ShowtimeUncheckedUpdateManyWithoutMovieNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutMovieNestedInput
    cast?: MovieCastUncheckedUpdateManyWithoutMovieNestedInput
  }

  export type MovieCreateManyInput = {
    id: string
    title: string
    tagline?: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage?: string
    durationMinutes: number
    rating?: Decimal | DecimalJsLike | number | string
    votesCount?: string
    ageRating?: string
    releaseDate?: string
    status?: string
    director?: string
    formats?: MovieCreateformatsInput | string[]
    featured?: boolean
    createdAt?: Date | string
    genre?: MovieCreategenreInput | string[]
    languages?: MovieCreatelanguagesInput | string[]
  }

  export type MovieUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
  }

  export type MovieUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
  }

  export type TheatreCreateInput = {
    id: string
    name: string
    city: string
    address: string
    facilities?: TheatreCreatefacilitiesInput | string[]
    distance?: string
    timezone?: string
    screens?: ScreenCreateNestedManyWithoutTheatreInput
    showtimes?: ShowtimeCreateNestedManyWithoutCinemaInput
  }

  export type TheatreUncheckedCreateInput = {
    id: string
    name: string
    city: string
    address: string
    facilities?: TheatreCreatefacilitiesInput | string[]
    distance?: string
    timezone?: string
    screens?: ScreenUncheckedCreateNestedManyWithoutTheatreInput
    showtimes?: ShowtimeUncheckedCreateNestedManyWithoutCinemaInput
  }

  export type TheatreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    facilities?: TheatreUpdatefacilitiesInput | string[]
    distance?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    screens?: ScreenUpdateManyWithoutTheatreNestedInput
    showtimes?: ShowtimeUpdateManyWithoutCinemaNestedInput
  }

  export type TheatreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    facilities?: TheatreUpdatefacilitiesInput | string[]
    distance?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    screens?: ScreenUncheckedUpdateManyWithoutTheatreNestedInput
    showtimes?: ShowtimeUncheckedUpdateManyWithoutCinemaNestedInput
  }

  export type TheatreCreateManyInput = {
    id: string
    name: string
    city: string
    address: string
    facilities?: TheatreCreatefacilitiesInput | string[]
    distance?: string
    timezone?: string
  }

  export type TheatreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    facilities?: TheatreUpdatefacilitiesInput | string[]
    distance?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
  }

  export type TheatreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    facilities?: TheatreUpdatefacilitiesInput | string[]
    distance?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
  }

  export type ScreenCreateInput = {
    id: string
    name: string
    screenType?: string
    theatre?: TheatreCreateNestedOneWithoutScreensInput
    seats?: SeatCreateNestedManyWithoutScreenInput
    showtimes?: ShowtimeCreateNestedManyWithoutScreenInput
  }

  export type ScreenUncheckedCreateInput = {
    id: string
    theatreId?: string | null
    name: string
    screenType?: string
    seats?: SeatUncheckedCreateNestedManyWithoutScreenInput
    showtimes?: ShowtimeUncheckedCreateNestedManyWithoutScreenInput
  }

  export type ScreenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
    theatre?: TheatreUpdateOneWithoutScreensNestedInput
    seats?: SeatUpdateManyWithoutScreenNestedInput
    showtimes?: ShowtimeUpdateManyWithoutScreenNestedInput
  }

  export type ScreenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    theatreId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
    seats?: SeatUncheckedUpdateManyWithoutScreenNestedInput
    showtimes?: ShowtimeUncheckedUpdateManyWithoutScreenNestedInput
  }

  export type ScreenCreateManyInput = {
    id: string
    theatreId?: string | null
    name: string
    screenType?: string
  }

  export type ScreenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
  }

  export type ScreenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    theatreId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
  }

  export type SeatCreateInput = {
    id: string
    row: string
    number: number
    seatNumber?: string | null
    tier?: string
    basePrice: Decimal | DecimalJsLike | number | string
    screen?: ScreenCreateNestedOneWithoutSeatsInput
    reservations?: SeatReservationCreateNestedManyWithoutSeatInput
  }

  export type SeatUncheckedCreateInput = {
    id: string
    screenId?: string | null
    row: string
    number: number
    seatNumber?: string | null
    tier?: string
    basePrice: Decimal | DecimalJsLike | number | string
    reservations?: SeatReservationUncheckedCreateNestedManyWithoutSeatInput
  }

  export type SeatUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    seatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: StringFieldUpdateOperationsInput | string
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    screen?: ScreenUpdateOneWithoutSeatsNestedInput
    reservations?: SeatReservationUpdateManyWithoutSeatNestedInput
  }

  export type SeatUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    row?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    seatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: StringFieldUpdateOperationsInput | string
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reservations?: SeatReservationUncheckedUpdateManyWithoutSeatNestedInput
  }

  export type SeatCreateManyInput = {
    id: string
    screenId?: string | null
    row: string
    number: number
    seatNumber?: string | null
    tier?: string
    basePrice: Decimal | DecimalJsLike | number | string
  }

  export type SeatUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    seatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: StringFieldUpdateOperationsInput | string
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SeatUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    row?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    seatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: StringFieldUpdateOperationsInput | string
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ShowtimeCreateInput = {
    id: string
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    cinema?: TheatreCreateNestedOneWithoutShowtimesInput
    screen?: ScreenCreateNestedOneWithoutShowtimesInput
    movie?: MovieCreateNestedOneWithoutShowtimesInput
    reservations?: SeatReservationCreateNestedManyWithoutShowtimeInput
    bookings?: BookingCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeUncheckedCreateInput = {
    id: string
    cinemaId?: string | null
    screenId?: string | null
    movieId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    reservations?: SeatReservationUncheckedCreateNestedManyWithoutShowtimeInput
    bookings?: BookingUncheckedCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    cinema?: TheatreUpdateOneWithoutShowtimesNestedInput
    screen?: ScreenUpdateOneWithoutShowtimesNestedInput
    movie?: MovieUpdateOneWithoutShowtimesNestedInput
    reservations?: SeatReservationUpdateManyWithoutShowtimeNestedInput
    bookings?: BookingUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cinemaId?: NullableStringFieldUpdateOperationsInput | string | null
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    movieId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    reservations?: SeatReservationUncheckedUpdateManyWithoutShowtimeNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeCreateManyInput = {
    id: string
    cinemaId?: string | null
    screenId?: string | null
    movieId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
  }

  export type ShowtimeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ShowtimeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cinemaId?: NullableStringFieldUpdateOperationsInput | string | null
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    movieId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SeatReservationCreateInput = {
    id?: string
    status?: string
    heldBy?: string | null
    heldExpiresAt?: Date | string | null
    bookingId?: string | null
    createdAt?: Date | string
    showtime: ShowtimeCreateNestedOneWithoutReservationsInput
    seat: SeatCreateNestedOneWithoutReservationsInput
  }

  export type SeatReservationUncheckedCreateInput = {
    id?: string
    showtimeId: string
    seatId: string
    status?: string
    heldBy?: string | null
    heldExpiresAt?: Date | string | null
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type SeatReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    showtime?: ShowtimeUpdateOneRequiredWithoutReservationsNestedInput
    seat?: SeatUpdateOneRequiredWithoutReservationsNestedInput
  }

  export type SeatReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    showtimeId?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeatReservationCreateManyInput = {
    id?: string
    showtimeId: string
    seatId: string
    status?: string
    heldBy?: string | null
    heldExpiresAt?: Date | string | null
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type SeatReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeatReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    showtimeId?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingCreateInput = {
    id?: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    user?: UserCreateNestedOneWithoutBookingsInput
    showtime: ShowtimeCreateNestedOneWithoutBookingsInput
    payment?: PaymentCreateNestedOneWithoutBookingInput
    seats?: BookingSeatCreateNestedManyWithoutBookingInput
    addons?: BookingAddonCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateInput = {
    id?: string
    userId?: string | null
    showtimeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    payment?: PaymentUncheckedCreateNestedOneWithoutBookingInput
    seats?: BookingSeatUncheckedCreateNestedManyWithoutBookingInput
    addons?: BookingAddonUncheckedCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutBookingsNestedInput
    showtime?: ShowtimeUpdateOneRequiredWithoutBookingsNestedInput
    payment?: PaymentUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    showtimeId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    payment?: PaymentUncheckedUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUncheckedUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUncheckedUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingCreateManyInput = {
    id?: string
    userId?: string | null
    showtimeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
  }

  export type BookingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    showtimeId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookingSeatCreateInput = {
    showtimeId: string
    seatId: string
    seatRow: string
    seatNumber: number
    tier: string
    price: Decimal | DecimalJsLike | number | string
    booking: BookingCreateNestedOneWithoutSeatsInput
  }

  export type BookingSeatUncheckedCreateInput = {
    id?: number
    bookingId: string
    showtimeId: string
    seatId: string
    seatRow: string
    seatNumber: number
    tier: string
    price: Decimal | DecimalJsLike | number | string
  }

  export type BookingSeatUpdateInput = {
    showtimeId?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    seatRow?: StringFieldUpdateOperationsInput | string
    seatNumber?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    booking?: BookingUpdateOneRequiredWithoutSeatsNestedInput
  }

  export type BookingSeatUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookingId?: StringFieldUpdateOperationsInput | string
    showtimeId?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    seatRow?: StringFieldUpdateOperationsInput | string
    seatNumber?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type BookingSeatCreateManyInput = {
    id?: number
    bookingId: string
    showtimeId: string
    seatId: string
    seatRow: string
    seatNumber: number
    tier: string
    price: Decimal | DecimalJsLike | number | string
  }

  export type BookingSeatUpdateManyMutationInput = {
    showtimeId?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    seatRow?: StringFieldUpdateOperationsInput | string
    seatNumber?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type BookingSeatUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookingId?: StringFieldUpdateOperationsInput | string
    showtimeId?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    seatRow?: StringFieldUpdateOperationsInput | string
    seatNumber?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type BookingAddonCreateInput = {
    addonId: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    quantity: number
    booking: BookingCreateNestedOneWithoutAddonsInput
  }

  export type BookingAddonUncheckedCreateInput = {
    id?: number
    bookingId: string
    addonId: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    quantity: number
  }

  export type BookingAddonUpdateInput = {
    addonId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    booking?: BookingUpdateOneRequiredWithoutAddonsNestedInput
  }

  export type BookingAddonUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookingId?: StringFieldUpdateOperationsInput | string
    addonId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type BookingAddonCreateManyInput = {
    id?: number
    bookingId: string
    addonId: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    quantity: number
  }

  export type BookingAddonUpdateManyMutationInput = {
    addonId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type BookingAddonUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookingId?: StringFieldUpdateOperationsInput | string
    addonId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type PaymentCreateInput = {
    id?: string
    provider?: string
    orderId: string
    paymentId?: string | null
    signature?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string
    refundId?: string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    booking?: BookingCreateNestedOneWithoutPaymentInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    bookingId?: string | null
    provider?: string
    orderId: string
    paymentId?: string | null
    signature?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string
    refundId?: string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    booking?: BookingUpdateOneWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyInput = {
    id?: string
    bookingId?: string | null
    provider?: string
    orderId: string
    paymentId?: string | null
    signature?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string
    refundId?: string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateInput = {
    id?: string
    userName: string
    userEmail?: string | null
    rating: Decimal | DecimalJsLike | number | string
    comment: string
    createdAt?: Date | string
    movie: MovieCreateNestedOneWithoutReviewsInput
  }

  export type ReviewUncheckedCreateInput = {
    id?: string
    movieId: string
    userName: string
    userEmail?: string | null
    rating: Decimal | DecimalJsLike | number | string
    comment: string
    createdAt?: Date | string
  }

  export type ReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    movie?: MovieUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    movieId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateManyInput = {
    id?: string
    movieId: string
    userName: string
    userEmail?: string | null
    rating: Decimal | DecimalJsLike | number | string
    comment: string
    createdAt?: Date | string
  }

  export type ReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    movieId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovieCastCreateInput = {
    name: string
    role: string
    avatar: string
    movie: MovieCreateNestedOneWithoutCastInput
  }

  export type MovieCastUncheckedCreateInput = {
    id?: number
    movieId: string
    name: string
    role: string
    avatar: string
  }

  export type MovieCastUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: StringFieldUpdateOperationsInput | string
    movie?: MovieUpdateOneRequiredWithoutCastNestedInput
  }

  export type MovieCastUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    movieId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: StringFieldUpdateOperationsInput | string
  }

  export type MovieCastCreateManyInput = {
    id?: number
    movieId: string
    name: string
    role: string
    avatar: string
  }

  export type MovieCastUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: StringFieldUpdateOperationsInput | string
  }

  export type MovieCastUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    movieId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: StringFieldUpdateOperationsInput | string
  }

  export type CancellationAuditLogCreateInput = {
    id?: string
    bookingRef: string
    action: string
    actorEmail: string
    previousStatus: string
    newStatus: string
    refundStatus: string
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    failureReason?: string | null
    notes?: string | null
    createdAt?: Date | string
    booking?: BookingCreateNestedOneWithoutAuditLogsInput
  }

  export type CancellationAuditLogUncheckedCreateInput = {
    id?: string
    bookingId?: string | null
    bookingRef: string
    action: string
    actorEmail: string
    previousStatus: string
    newStatus: string
    refundStatus: string
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    failureReason?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type CancellationAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingRef?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    previousStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    booking?: BookingUpdateOneWithoutAuditLogsNestedInput
  }

  export type CancellationAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    previousStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CancellationAuditLogCreateManyInput = {
    id?: string
    bookingId?: string | null
    bookingRef: string
    action: string
    actorEmail: string
    previousStatus: string
    newStatus: string
    refundStatus: string
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    failureReason?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type CancellationAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingRef?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    previousStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CancellationAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    previousStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BookingListRelationFilter = {
    every?: BookingWhereInput
    some?: BookingWhereInput
    none?: BookingWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BookingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ShowtimeListRelationFilter = {
    every?: ShowtimeWhereInput
    some?: ShowtimeWhereInput
    none?: ShowtimeWhereInput
  }

  export type ReviewListRelationFilter = {
    every?: ReviewWhereInput
    some?: ReviewWhereInput
    none?: ReviewWhereInput
  }

  export type MovieCastListRelationFilter = {
    every?: MovieCastWhereInput
    some?: MovieCastWhereInput
    none?: MovieCastWhereInput
  }

  export type ShowtimeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MovieCastOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MovieCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    tagline?: SortOrder
    synopsis?: SortOrder
    posterUrl?: SortOrder
    backdropUrl?: SortOrder
    originalLanguage?: SortOrder
    durationMinutes?: SortOrder
    rating?: SortOrder
    votesCount?: SortOrder
    ageRating?: SortOrder
    releaseDate?: SortOrder
    status?: SortOrder
    director?: SortOrder
    formats?: SortOrder
    featured?: SortOrder
    createdAt?: SortOrder
    genre?: SortOrder
    languages?: SortOrder
  }

  export type MovieAvgOrderByAggregateInput = {
    durationMinutes?: SortOrder
    rating?: SortOrder
  }

  export type MovieMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    tagline?: SortOrder
    synopsis?: SortOrder
    posterUrl?: SortOrder
    backdropUrl?: SortOrder
    originalLanguage?: SortOrder
    durationMinutes?: SortOrder
    rating?: SortOrder
    votesCount?: SortOrder
    ageRating?: SortOrder
    releaseDate?: SortOrder
    status?: SortOrder
    director?: SortOrder
    featured?: SortOrder
    createdAt?: SortOrder
  }

  export type MovieMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    tagline?: SortOrder
    synopsis?: SortOrder
    posterUrl?: SortOrder
    backdropUrl?: SortOrder
    originalLanguage?: SortOrder
    durationMinutes?: SortOrder
    rating?: SortOrder
    votesCount?: SortOrder
    ageRating?: SortOrder
    releaseDate?: SortOrder
    status?: SortOrder
    director?: SortOrder
    featured?: SortOrder
    createdAt?: SortOrder
  }

  export type MovieSumOrderByAggregateInput = {
    durationMinutes?: SortOrder
    rating?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ScreenListRelationFilter = {
    every?: ScreenWhereInput
    some?: ScreenWhereInput
    none?: ScreenWhereInput
  }

  export type ScreenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TheatreCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    address?: SortOrder
    facilities?: SortOrder
    distance?: SortOrder
    timezone?: SortOrder
  }

  export type TheatreMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    address?: SortOrder
    distance?: SortOrder
    timezone?: SortOrder
  }

  export type TheatreMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    address?: SortOrder
    distance?: SortOrder
    timezone?: SortOrder
  }

  export type TheatreNullableRelationFilter = {
    is?: TheatreWhereInput | null
    isNot?: TheatreWhereInput | null
  }

  export type SeatListRelationFilter = {
    every?: SeatWhereInput
    some?: SeatWhereInput
    none?: SeatWhereInput
  }

  export type SeatOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScreenCountOrderByAggregateInput = {
    id?: SortOrder
    theatreId?: SortOrder
    name?: SortOrder
    screenType?: SortOrder
  }

  export type ScreenMaxOrderByAggregateInput = {
    id?: SortOrder
    theatreId?: SortOrder
    name?: SortOrder
    screenType?: SortOrder
  }

  export type ScreenMinOrderByAggregateInput = {
    id?: SortOrder
    theatreId?: SortOrder
    name?: SortOrder
    screenType?: SortOrder
  }

  export type ScreenNullableRelationFilter = {
    is?: ScreenWhereInput | null
    isNot?: ScreenWhereInput | null
  }

  export type SeatReservationListRelationFilter = {
    every?: SeatReservationWhereInput
    some?: SeatReservationWhereInput
    none?: SeatReservationWhereInput
  }

  export type SeatReservationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SeatCountOrderByAggregateInput = {
    id?: SortOrder
    screenId?: SortOrder
    row?: SortOrder
    number?: SortOrder
    seatNumber?: SortOrder
    tier?: SortOrder
    basePrice?: SortOrder
  }

  export type SeatAvgOrderByAggregateInput = {
    number?: SortOrder
    basePrice?: SortOrder
  }

  export type SeatMaxOrderByAggregateInput = {
    id?: SortOrder
    screenId?: SortOrder
    row?: SortOrder
    number?: SortOrder
    seatNumber?: SortOrder
    tier?: SortOrder
    basePrice?: SortOrder
  }

  export type SeatMinOrderByAggregateInput = {
    id?: SortOrder
    screenId?: SortOrder
    row?: SortOrder
    number?: SortOrder
    seatNumber?: SortOrder
    tier?: SortOrder
    basePrice?: SortOrder
  }

  export type SeatSumOrderByAggregateInput = {
    number?: SortOrder
    basePrice?: SortOrder
  }

  export type MovieNullableRelationFilter = {
    is?: MovieWhereInput | null
    isNot?: MovieWhereInput | null
  }

  export type ShowtimeCountOrderByAggregateInput = {
    id?: SortOrder
    cinemaId?: SortOrder
    screenId?: SortOrder
    movieId?: SortOrder
    date?: SortOrder
    time?: SortOrder
    format?: SortOrder
    hallName?: SortOrder
    language?: SortOrder
    priceMultiplier?: SortOrder
    createdAt?: SortOrder
    hall?: SortOrder
  }

  export type ShowtimeAvgOrderByAggregateInput = {
    priceMultiplier?: SortOrder
  }

  export type ShowtimeMaxOrderByAggregateInput = {
    id?: SortOrder
    cinemaId?: SortOrder
    screenId?: SortOrder
    movieId?: SortOrder
    date?: SortOrder
    time?: SortOrder
    format?: SortOrder
    hallName?: SortOrder
    language?: SortOrder
    priceMultiplier?: SortOrder
    createdAt?: SortOrder
    hall?: SortOrder
  }

  export type ShowtimeMinOrderByAggregateInput = {
    id?: SortOrder
    cinemaId?: SortOrder
    screenId?: SortOrder
    movieId?: SortOrder
    date?: SortOrder
    time?: SortOrder
    format?: SortOrder
    hallName?: SortOrder
    language?: SortOrder
    priceMultiplier?: SortOrder
    createdAt?: SortOrder
    hall?: SortOrder
  }

  export type ShowtimeSumOrderByAggregateInput = {
    priceMultiplier?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ShowtimeRelationFilter = {
    is?: ShowtimeWhereInput
    isNot?: ShowtimeWhereInput
  }

  export type SeatRelationFilter = {
    is?: SeatWhereInput
    isNot?: SeatWhereInput
  }

  export type SeatReservationShowtimeIdSeatIdCompoundUniqueInput = {
    showtimeId: string
    seatId: string
  }

  export type SeatReservationCountOrderByAggregateInput = {
    id?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    status?: SortOrder
    heldBy?: SortOrder
    heldExpiresAt?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type SeatReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    status?: SortOrder
    heldBy?: SortOrder
    heldExpiresAt?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type SeatReservationMinOrderByAggregateInput = {
    id?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    status?: SortOrder
    heldBy?: SortOrder
    heldExpiresAt?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type PaymentNullableRelationFilter = {
    is?: PaymentWhereInput | null
    isNot?: PaymentWhereInput | null
  }

  export type BookingSeatListRelationFilter = {
    every?: BookingSeatWhereInput
    some?: BookingSeatWhereInput
    none?: BookingSeatWhereInput
  }

  export type BookingAddonListRelationFilter = {
    every?: BookingAddonWhereInput
    some?: BookingAddonWhereInput
    none?: BookingAddonWhereInput
  }

  export type CancellationAuditLogListRelationFilter = {
    every?: CancellationAuditLogWhereInput
    some?: CancellationAuditLogWhereInput
    none?: CancellationAuditLogWhereInput
  }

  export type BookingSeatOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookingAddonOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CancellationAuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    showtimeId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    subtotal?: SortOrder
    convenienceFee?: SortOrder
    tax?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    refundStatus?: SortOrder
    bookedAt?: SortOrder
    cancelledAt?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrder
    bookingRef?: SortOrder
  }

  export type BookingAvgOrderByAggregateInput = {
    subtotal?: SortOrder
    convenienceFee?: SortOrder
    tax?: SortOrder
    totalAmount?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
  }

  export type BookingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    showtimeId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    subtotal?: SortOrder
    convenienceFee?: SortOrder
    tax?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    refundStatus?: SortOrder
    bookedAt?: SortOrder
    cancelledAt?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrder
    bookingRef?: SortOrder
  }

  export type BookingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    showtimeId?: SortOrder
    customerName?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    subtotal?: SortOrder
    convenienceFee?: SortOrder
    tax?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    refundStatus?: SortOrder
    bookedAt?: SortOrder
    cancelledAt?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrder
    bookingRef?: SortOrder
  }

  export type BookingSumOrderByAggregateInput = {
    subtotal?: SortOrder
    convenienceFee?: SortOrder
    tax?: SortOrder
    totalAmount?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
  }

  export type BookingRelationFilter = {
    is?: BookingWhereInput
    isNot?: BookingWhereInput
  }

  export type BookingSeatUnique_seat_per_showCompoundUniqueInput = {
    showtimeId: string
    seatId: string
  }

  export type BookingSeatCountOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    seatRow?: SortOrder
    seatNumber?: SortOrder
    tier?: SortOrder
    price?: SortOrder
  }

  export type BookingSeatAvgOrderByAggregateInput = {
    id?: SortOrder
    seatNumber?: SortOrder
    price?: SortOrder
  }

  export type BookingSeatMaxOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    seatRow?: SortOrder
    seatNumber?: SortOrder
    tier?: SortOrder
    price?: SortOrder
  }

  export type BookingSeatMinOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    showtimeId?: SortOrder
    seatId?: SortOrder
    seatRow?: SortOrder
    seatNumber?: SortOrder
    tier?: SortOrder
    price?: SortOrder
  }

  export type BookingSeatSumOrderByAggregateInput = {
    id?: SortOrder
    seatNumber?: SortOrder
    price?: SortOrder
  }

  export type BookingAddonCountOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    addonId?: SortOrder
    name?: SortOrder
    price?: SortOrder
    quantity?: SortOrder
  }

  export type BookingAddonAvgOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    quantity?: SortOrder
  }

  export type BookingAddonMaxOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    addonId?: SortOrder
    name?: SortOrder
    price?: SortOrder
    quantity?: SortOrder
  }

  export type BookingAddonMinOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    addonId?: SortOrder
    name?: SortOrder
    price?: SortOrder
    quantity?: SortOrder
  }

  export type BookingAddonSumOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    quantity?: SortOrder
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type BookingNullableRelationFilter = {
    is?: BookingWhereInput | null
    isNot?: BookingWhereInput | null
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    provider?: SortOrder
    orderId?: SortOrder
    paymentId?: SortOrder
    signature?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    refundId?: SortOrder
    refundAmount?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
    refundAmount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    provider?: SortOrder
    orderId?: SortOrder
    paymentId?: SortOrder
    signature?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    refundId?: SortOrder
    refundAmount?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    provider?: SortOrder
    orderId?: SortOrder
    paymentId?: SortOrder
    signature?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    refundId?: SortOrder
    refundAmount?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
    refundAmount?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type MovieRelationFilter = {
    is?: MovieWhereInput
    isNot?: MovieWhereInput
  }

  export type ReviewCountOrderByAggregateInput = {
    id?: SortOrder
    movieId?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type ReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    movieId?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewMinOrderByAggregateInput = {
    id?: SortOrder
    movieId?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type MovieCastCountOrderByAggregateInput = {
    id?: SortOrder
    movieId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
  }

  export type MovieCastAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MovieCastMaxOrderByAggregateInput = {
    id?: SortOrder
    movieId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
  }

  export type MovieCastMinOrderByAggregateInput = {
    id?: SortOrder
    movieId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
  }

  export type MovieCastSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CancellationAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    bookingRef?: SortOrder
    action?: SortOrder
    actorEmail?: SortOrder
    previousStatus?: SortOrder
    newStatus?: SortOrder
    refundStatus?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrder
    failureReason?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type CancellationAuditLogAvgOrderByAggregateInput = {
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
  }

  export type CancellationAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    bookingRef?: SortOrder
    action?: SortOrder
    actorEmail?: SortOrder
    previousStatus?: SortOrder
    newStatus?: SortOrder
    refundStatus?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrder
    failureReason?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type CancellationAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    bookingRef?: SortOrder
    action?: SortOrder
    actorEmail?: SortOrder
    previousStatus?: SortOrder
    newStatus?: SortOrder
    refundStatus?: SortOrder
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
    refundId?: SortOrder
    failureReason?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type CancellationAuditLogSumOrderByAggregateInput = {
    refundAmount?: SortOrder
    cancellationFee?: SortOrder
  }

  export type BookingCreateNestedManyWithoutUserInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BookingUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutUserInput | BookingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutUserInput | BookingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutUserInput | BookingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutUserInput | BookingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutUserInput | BookingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutUserInput | BookingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type MovieCreateformatsInput = {
    set: string[]
  }

  export type MovieCreategenreInput = {
    set: string[]
  }

  export type MovieCreatelanguagesInput = {
    set: string[]
  }

  export type ShowtimeCreateNestedManyWithoutMovieInput = {
    create?: XOR<ShowtimeCreateWithoutMovieInput, ShowtimeUncheckedCreateWithoutMovieInput> | ShowtimeCreateWithoutMovieInput[] | ShowtimeUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutMovieInput | ShowtimeCreateOrConnectWithoutMovieInput[]
    createMany?: ShowtimeCreateManyMovieInputEnvelope
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
  }

  export type ReviewCreateNestedManyWithoutMovieInput = {
    create?: XOR<ReviewCreateWithoutMovieInput, ReviewUncheckedCreateWithoutMovieInput> | ReviewCreateWithoutMovieInput[] | ReviewUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutMovieInput | ReviewCreateOrConnectWithoutMovieInput[]
    createMany?: ReviewCreateManyMovieInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type MovieCastCreateNestedManyWithoutMovieInput = {
    create?: XOR<MovieCastCreateWithoutMovieInput, MovieCastUncheckedCreateWithoutMovieInput> | MovieCastCreateWithoutMovieInput[] | MovieCastUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: MovieCastCreateOrConnectWithoutMovieInput | MovieCastCreateOrConnectWithoutMovieInput[]
    createMany?: MovieCastCreateManyMovieInputEnvelope
    connect?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
  }

  export type ShowtimeUncheckedCreateNestedManyWithoutMovieInput = {
    create?: XOR<ShowtimeCreateWithoutMovieInput, ShowtimeUncheckedCreateWithoutMovieInput> | ShowtimeCreateWithoutMovieInput[] | ShowtimeUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutMovieInput | ShowtimeCreateOrConnectWithoutMovieInput[]
    createMany?: ShowtimeCreateManyMovieInputEnvelope
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
  }

  export type ReviewUncheckedCreateNestedManyWithoutMovieInput = {
    create?: XOR<ReviewCreateWithoutMovieInput, ReviewUncheckedCreateWithoutMovieInput> | ReviewCreateWithoutMovieInput[] | ReviewUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutMovieInput | ReviewCreateOrConnectWithoutMovieInput[]
    createMany?: ReviewCreateManyMovieInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type MovieCastUncheckedCreateNestedManyWithoutMovieInput = {
    create?: XOR<MovieCastCreateWithoutMovieInput, MovieCastUncheckedCreateWithoutMovieInput> | MovieCastCreateWithoutMovieInput[] | MovieCastUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: MovieCastCreateOrConnectWithoutMovieInput | MovieCastCreateOrConnectWithoutMovieInput[]
    createMany?: MovieCastCreateManyMovieInputEnvelope
    connect?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type MovieUpdateformatsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type MovieUpdategenreInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MovieUpdatelanguagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ShowtimeUpdateManyWithoutMovieNestedInput = {
    create?: XOR<ShowtimeCreateWithoutMovieInput, ShowtimeUncheckedCreateWithoutMovieInput> | ShowtimeCreateWithoutMovieInput[] | ShowtimeUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutMovieInput | ShowtimeCreateOrConnectWithoutMovieInput[]
    upsert?: ShowtimeUpsertWithWhereUniqueWithoutMovieInput | ShowtimeUpsertWithWhereUniqueWithoutMovieInput[]
    createMany?: ShowtimeCreateManyMovieInputEnvelope
    set?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    disconnect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    delete?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    update?: ShowtimeUpdateWithWhereUniqueWithoutMovieInput | ShowtimeUpdateWithWhereUniqueWithoutMovieInput[]
    updateMany?: ShowtimeUpdateManyWithWhereWithoutMovieInput | ShowtimeUpdateManyWithWhereWithoutMovieInput[]
    deleteMany?: ShowtimeScalarWhereInput | ShowtimeScalarWhereInput[]
  }

  export type ReviewUpdateManyWithoutMovieNestedInput = {
    create?: XOR<ReviewCreateWithoutMovieInput, ReviewUncheckedCreateWithoutMovieInput> | ReviewCreateWithoutMovieInput[] | ReviewUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutMovieInput | ReviewCreateOrConnectWithoutMovieInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutMovieInput | ReviewUpsertWithWhereUniqueWithoutMovieInput[]
    createMany?: ReviewCreateManyMovieInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutMovieInput | ReviewUpdateWithWhereUniqueWithoutMovieInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutMovieInput | ReviewUpdateManyWithWhereWithoutMovieInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type MovieCastUpdateManyWithoutMovieNestedInput = {
    create?: XOR<MovieCastCreateWithoutMovieInput, MovieCastUncheckedCreateWithoutMovieInput> | MovieCastCreateWithoutMovieInput[] | MovieCastUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: MovieCastCreateOrConnectWithoutMovieInput | MovieCastCreateOrConnectWithoutMovieInput[]
    upsert?: MovieCastUpsertWithWhereUniqueWithoutMovieInput | MovieCastUpsertWithWhereUniqueWithoutMovieInput[]
    createMany?: MovieCastCreateManyMovieInputEnvelope
    set?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
    disconnect?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
    delete?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
    connect?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
    update?: MovieCastUpdateWithWhereUniqueWithoutMovieInput | MovieCastUpdateWithWhereUniqueWithoutMovieInput[]
    updateMany?: MovieCastUpdateManyWithWhereWithoutMovieInput | MovieCastUpdateManyWithWhereWithoutMovieInput[]
    deleteMany?: MovieCastScalarWhereInput | MovieCastScalarWhereInput[]
  }

  export type ShowtimeUncheckedUpdateManyWithoutMovieNestedInput = {
    create?: XOR<ShowtimeCreateWithoutMovieInput, ShowtimeUncheckedCreateWithoutMovieInput> | ShowtimeCreateWithoutMovieInput[] | ShowtimeUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutMovieInput | ShowtimeCreateOrConnectWithoutMovieInput[]
    upsert?: ShowtimeUpsertWithWhereUniqueWithoutMovieInput | ShowtimeUpsertWithWhereUniqueWithoutMovieInput[]
    createMany?: ShowtimeCreateManyMovieInputEnvelope
    set?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    disconnect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    delete?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    update?: ShowtimeUpdateWithWhereUniqueWithoutMovieInput | ShowtimeUpdateWithWhereUniqueWithoutMovieInput[]
    updateMany?: ShowtimeUpdateManyWithWhereWithoutMovieInput | ShowtimeUpdateManyWithWhereWithoutMovieInput[]
    deleteMany?: ShowtimeScalarWhereInput | ShowtimeScalarWhereInput[]
  }

  export type ReviewUncheckedUpdateManyWithoutMovieNestedInput = {
    create?: XOR<ReviewCreateWithoutMovieInput, ReviewUncheckedCreateWithoutMovieInput> | ReviewCreateWithoutMovieInput[] | ReviewUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutMovieInput | ReviewCreateOrConnectWithoutMovieInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutMovieInput | ReviewUpsertWithWhereUniqueWithoutMovieInput[]
    createMany?: ReviewCreateManyMovieInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutMovieInput | ReviewUpdateWithWhereUniqueWithoutMovieInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutMovieInput | ReviewUpdateManyWithWhereWithoutMovieInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type MovieCastUncheckedUpdateManyWithoutMovieNestedInput = {
    create?: XOR<MovieCastCreateWithoutMovieInput, MovieCastUncheckedCreateWithoutMovieInput> | MovieCastCreateWithoutMovieInput[] | MovieCastUncheckedCreateWithoutMovieInput[]
    connectOrCreate?: MovieCastCreateOrConnectWithoutMovieInput | MovieCastCreateOrConnectWithoutMovieInput[]
    upsert?: MovieCastUpsertWithWhereUniqueWithoutMovieInput | MovieCastUpsertWithWhereUniqueWithoutMovieInput[]
    createMany?: MovieCastCreateManyMovieInputEnvelope
    set?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
    disconnect?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
    delete?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
    connect?: MovieCastWhereUniqueInput | MovieCastWhereUniqueInput[]
    update?: MovieCastUpdateWithWhereUniqueWithoutMovieInput | MovieCastUpdateWithWhereUniqueWithoutMovieInput[]
    updateMany?: MovieCastUpdateManyWithWhereWithoutMovieInput | MovieCastUpdateManyWithWhereWithoutMovieInput[]
    deleteMany?: MovieCastScalarWhereInput | MovieCastScalarWhereInput[]
  }

  export type TheatreCreatefacilitiesInput = {
    set: string[]
  }

  export type ScreenCreateNestedManyWithoutTheatreInput = {
    create?: XOR<ScreenCreateWithoutTheatreInput, ScreenUncheckedCreateWithoutTheatreInput> | ScreenCreateWithoutTheatreInput[] | ScreenUncheckedCreateWithoutTheatreInput[]
    connectOrCreate?: ScreenCreateOrConnectWithoutTheatreInput | ScreenCreateOrConnectWithoutTheatreInput[]
    createMany?: ScreenCreateManyTheatreInputEnvelope
    connect?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
  }

  export type ShowtimeCreateNestedManyWithoutCinemaInput = {
    create?: XOR<ShowtimeCreateWithoutCinemaInput, ShowtimeUncheckedCreateWithoutCinemaInput> | ShowtimeCreateWithoutCinemaInput[] | ShowtimeUncheckedCreateWithoutCinemaInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutCinemaInput | ShowtimeCreateOrConnectWithoutCinemaInput[]
    createMany?: ShowtimeCreateManyCinemaInputEnvelope
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
  }

  export type ScreenUncheckedCreateNestedManyWithoutTheatreInput = {
    create?: XOR<ScreenCreateWithoutTheatreInput, ScreenUncheckedCreateWithoutTheatreInput> | ScreenCreateWithoutTheatreInput[] | ScreenUncheckedCreateWithoutTheatreInput[]
    connectOrCreate?: ScreenCreateOrConnectWithoutTheatreInput | ScreenCreateOrConnectWithoutTheatreInput[]
    createMany?: ScreenCreateManyTheatreInputEnvelope
    connect?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
  }

  export type ShowtimeUncheckedCreateNestedManyWithoutCinemaInput = {
    create?: XOR<ShowtimeCreateWithoutCinemaInput, ShowtimeUncheckedCreateWithoutCinemaInput> | ShowtimeCreateWithoutCinemaInput[] | ShowtimeUncheckedCreateWithoutCinemaInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutCinemaInput | ShowtimeCreateOrConnectWithoutCinemaInput[]
    createMany?: ShowtimeCreateManyCinemaInputEnvelope
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
  }

  export type TheatreUpdatefacilitiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ScreenUpdateManyWithoutTheatreNestedInput = {
    create?: XOR<ScreenCreateWithoutTheatreInput, ScreenUncheckedCreateWithoutTheatreInput> | ScreenCreateWithoutTheatreInput[] | ScreenUncheckedCreateWithoutTheatreInput[]
    connectOrCreate?: ScreenCreateOrConnectWithoutTheatreInput | ScreenCreateOrConnectWithoutTheatreInput[]
    upsert?: ScreenUpsertWithWhereUniqueWithoutTheatreInput | ScreenUpsertWithWhereUniqueWithoutTheatreInput[]
    createMany?: ScreenCreateManyTheatreInputEnvelope
    set?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
    disconnect?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
    delete?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
    connect?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
    update?: ScreenUpdateWithWhereUniqueWithoutTheatreInput | ScreenUpdateWithWhereUniqueWithoutTheatreInput[]
    updateMany?: ScreenUpdateManyWithWhereWithoutTheatreInput | ScreenUpdateManyWithWhereWithoutTheatreInput[]
    deleteMany?: ScreenScalarWhereInput | ScreenScalarWhereInput[]
  }

  export type ShowtimeUpdateManyWithoutCinemaNestedInput = {
    create?: XOR<ShowtimeCreateWithoutCinemaInput, ShowtimeUncheckedCreateWithoutCinemaInput> | ShowtimeCreateWithoutCinemaInput[] | ShowtimeUncheckedCreateWithoutCinemaInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutCinemaInput | ShowtimeCreateOrConnectWithoutCinemaInput[]
    upsert?: ShowtimeUpsertWithWhereUniqueWithoutCinemaInput | ShowtimeUpsertWithWhereUniqueWithoutCinemaInput[]
    createMany?: ShowtimeCreateManyCinemaInputEnvelope
    set?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    disconnect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    delete?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    update?: ShowtimeUpdateWithWhereUniqueWithoutCinemaInput | ShowtimeUpdateWithWhereUniqueWithoutCinemaInput[]
    updateMany?: ShowtimeUpdateManyWithWhereWithoutCinemaInput | ShowtimeUpdateManyWithWhereWithoutCinemaInput[]
    deleteMany?: ShowtimeScalarWhereInput | ShowtimeScalarWhereInput[]
  }

  export type ScreenUncheckedUpdateManyWithoutTheatreNestedInput = {
    create?: XOR<ScreenCreateWithoutTheatreInput, ScreenUncheckedCreateWithoutTheatreInput> | ScreenCreateWithoutTheatreInput[] | ScreenUncheckedCreateWithoutTheatreInput[]
    connectOrCreate?: ScreenCreateOrConnectWithoutTheatreInput | ScreenCreateOrConnectWithoutTheatreInput[]
    upsert?: ScreenUpsertWithWhereUniqueWithoutTheatreInput | ScreenUpsertWithWhereUniqueWithoutTheatreInput[]
    createMany?: ScreenCreateManyTheatreInputEnvelope
    set?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
    disconnect?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
    delete?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
    connect?: ScreenWhereUniqueInput | ScreenWhereUniqueInput[]
    update?: ScreenUpdateWithWhereUniqueWithoutTheatreInput | ScreenUpdateWithWhereUniqueWithoutTheatreInput[]
    updateMany?: ScreenUpdateManyWithWhereWithoutTheatreInput | ScreenUpdateManyWithWhereWithoutTheatreInput[]
    deleteMany?: ScreenScalarWhereInput | ScreenScalarWhereInput[]
  }

  export type ShowtimeUncheckedUpdateManyWithoutCinemaNestedInput = {
    create?: XOR<ShowtimeCreateWithoutCinemaInput, ShowtimeUncheckedCreateWithoutCinemaInput> | ShowtimeCreateWithoutCinemaInput[] | ShowtimeUncheckedCreateWithoutCinemaInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutCinemaInput | ShowtimeCreateOrConnectWithoutCinemaInput[]
    upsert?: ShowtimeUpsertWithWhereUniqueWithoutCinemaInput | ShowtimeUpsertWithWhereUniqueWithoutCinemaInput[]
    createMany?: ShowtimeCreateManyCinemaInputEnvelope
    set?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    disconnect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    delete?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    update?: ShowtimeUpdateWithWhereUniqueWithoutCinemaInput | ShowtimeUpdateWithWhereUniqueWithoutCinemaInput[]
    updateMany?: ShowtimeUpdateManyWithWhereWithoutCinemaInput | ShowtimeUpdateManyWithWhereWithoutCinemaInput[]
    deleteMany?: ShowtimeScalarWhereInput | ShowtimeScalarWhereInput[]
  }

  export type TheatreCreateNestedOneWithoutScreensInput = {
    create?: XOR<TheatreCreateWithoutScreensInput, TheatreUncheckedCreateWithoutScreensInput>
    connectOrCreate?: TheatreCreateOrConnectWithoutScreensInput
    connect?: TheatreWhereUniqueInput
  }

  export type SeatCreateNestedManyWithoutScreenInput = {
    create?: XOR<SeatCreateWithoutScreenInput, SeatUncheckedCreateWithoutScreenInput> | SeatCreateWithoutScreenInput[] | SeatUncheckedCreateWithoutScreenInput[]
    connectOrCreate?: SeatCreateOrConnectWithoutScreenInput | SeatCreateOrConnectWithoutScreenInput[]
    createMany?: SeatCreateManyScreenInputEnvelope
    connect?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
  }

  export type ShowtimeCreateNestedManyWithoutScreenInput = {
    create?: XOR<ShowtimeCreateWithoutScreenInput, ShowtimeUncheckedCreateWithoutScreenInput> | ShowtimeCreateWithoutScreenInput[] | ShowtimeUncheckedCreateWithoutScreenInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutScreenInput | ShowtimeCreateOrConnectWithoutScreenInput[]
    createMany?: ShowtimeCreateManyScreenInputEnvelope
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
  }

  export type SeatUncheckedCreateNestedManyWithoutScreenInput = {
    create?: XOR<SeatCreateWithoutScreenInput, SeatUncheckedCreateWithoutScreenInput> | SeatCreateWithoutScreenInput[] | SeatUncheckedCreateWithoutScreenInput[]
    connectOrCreate?: SeatCreateOrConnectWithoutScreenInput | SeatCreateOrConnectWithoutScreenInput[]
    createMany?: SeatCreateManyScreenInputEnvelope
    connect?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
  }

  export type ShowtimeUncheckedCreateNestedManyWithoutScreenInput = {
    create?: XOR<ShowtimeCreateWithoutScreenInput, ShowtimeUncheckedCreateWithoutScreenInput> | ShowtimeCreateWithoutScreenInput[] | ShowtimeUncheckedCreateWithoutScreenInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutScreenInput | ShowtimeCreateOrConnectWithoutScreenInput[]
    createMany?: ShowtimeCreateManyScreenInputEnvelope
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
  }

  export type TheatreUpdateOneWithoutScreensNestedInput = {
    create?: XOR<TheatreCreateWithoutScreensInput, TheatreUncheckedCreateWithoutScreensInput>
    connectOrCreate?: TheatreCreateOrConnectWithoutScreensInput
    upsert?: TheatreUpsertWithoutScreensInput
    disconnect?: TheatreWhereInput | boolean
    delete?: TheatreWhereInput | boolean
    connect?: TheatreWhereUniqueInput
    update?: XOR<XOR<TheatreUpdateToOneWithWhereWithoutScreensInput, TheatreUpdateWithoutScreensInput>, TheatreUncheckedUpdateWithoutScreensInput>
  }

  export type SeatUpdateManyWithoutScreenNestedInput = {
    create?: XOR<SeatCreateWithoutScreenInput, SeatUncheckedCreateWithoutScreenInput> | SeatCreateWithoutScreenInput[] | SeatUncheckedCreateWithoutScreenInput[]
    connectOrCreate?: SeatCreateOrConnectWithoutScreenInput | SeatCreateOrConnectWithoutScreenInput[]
    upsert?: SeatUpsertWithWhereUniqueWithoutScreenInput | SeatUpsertWithWhereUniqueWithoutScreenInput[]
    createMany?: SeatCreateManyScreenInputEnvelope
    set?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
    disconnect?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
    delete?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
    connect?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
    update?: SeatUpdateWithWhereUniqueWithoutScreenInput | SeatUpdateWithWhereUniqueWithoutScreenInput[]
    updateMany?: SeatUpdateManyWithWhereWithoutScreenInput | SeatUpdateManyWithWhereWithoutScreenInput[]
    deleteMany?: SeatScalarWhereInput | SeatScalarWhereInput[]
  }

  export type ShowtimeUpdateManyWithoutScreenNestedInput = {
    create?: XOR<ShowtimeCreateWithoutScreenInput, ShowtimeUncheckedCreateWithoutScreenInput> | ShowtimeCreateWithoutScreenInput[] | ShowtimeUncheckedCreateWithoutScreenInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutScreenInput | ShowtimeCreateOrConnectWithoutScreenInput[]
    upsert?: ShowtimeUpsertWithWhereUniqueWithoutScreenInput | ShowtimeUpsertWithWhereUniqueWithoutScreenInput[]
    createMany?: ShowtimeCreateManyScreenInputEnvelope
    set?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    disconnect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    delete?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    update?: ShowtimeUpdateWithWhereUniqueWithoutScreenInput | ShowtimeUpdateWithWhereUniqueWithoutScreenInput[]
    updateMany?: ShowtimeUpdateManyWithWhereWithoutScreenInput | ShowtimeUpdateManyWithWhereWithoutScreenInput[]
    deleteMany?: ShowtimeScalarWhereInput | ShowtimeScalarWhereInput[]
  }

  export type SeatUncheckedUpdateManyWithoutScreenNestedInput = {
    create?: XOR<SeatCreateWithoutScreenInput, SeatUncheckedCreateWithoutScreenInput> | SeatCreateWithoutScreenInput[] | SeatUncheckedCreateWithoutScreenInput[]
    connectOrCreate?: SeatCreateOrConnectWithoutScreenInput | SeatCreateOrConnectWithoutScreenInput[]
    upsert?: SeatUpsertWithWhereUniqueWithoutScreenInput | SeatUpsertWithWhereUniqueWithoutScreenInput[]
    createMany?: SeatCreateManyScreenInputEnvelope
    set?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
    disconnect?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
    delete?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
    connect?: SeatWhereUniqueInput | SeatWhereUniqueInput[]
    update?: SeatUpdateWithWhereUniqueWithoutScreenInput | SeatUpdateWithWhereUniqueWithoutScreenInput[]
    updateMany?: SeatUpdateManyWithWhereWithoutScreenInput | SeatUpdateManyWithWhereWithoutScreenInput[]
    deleteMany?: SeatScalarWhereInput | SeatScalarWhereInput[]
  }

  export type ShowtimeUncheckedUpdateManyWithoutScreenNestedInput = {
    create?: XOR<ShowtimeCreateWithoutScreenInput, ShowtimeUncheckedCreateWithoutScreenInput> | ShowtimeCreateWithoutScreenInput[] | ShowtimeUncheckedCreateWithoutScreenInput[]
    connectOrCreate?: ShowtimeCreateOrConnectWithoutScreenInput | ShowtimeCreateOrConnectWithoutScreenInput[]
    upsert?: ShowtimeUpsertWithWhereUniqueWithoutScreenInput | ShowtimeUpsertWithWhereUniqueWithoutScreenInput[]
    createMany?: ShowtimeCreateManyScreenInputEnvelope
    set?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    disconnect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    delete?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    connect?: ShowtimeWhereUniqueInput | ShowtimeWhereUniqueInput[]
    update?: ShowtimeUpdateWithWhereUniqueWithoutScreenInput | ShowtimeUpdateWithWhereUniqueWithoutScreenInput[]
    updateMany?: ShowtimeUpdateManyWithWhereWithoutScreenInput | ShowtimeUpdateManyWithWhereWithoutScreenInput[]
    deleteMany?: ShowtimeScalarWhereInput | ShowtimeScalarWhereInput[]
  }

  export type ScreenCreateNestedOneWithoutSeatsInput = {
    create?: XOR<ScreenCreateWithoutSeatsInput, ScreenUncheckedCreateWithoutSeatsInput>
    connectOrCreate?: ScreenCreateOrConnectWithoutSeatsInput
    connect?: ScreenWhereUniqueInput
  }

  export type SeatReservationCreateNestedManyWithoutSeatInput = {
    create?: XOR<SeatReservationCreateWithoutSeatInput, SeatReservationUncheckedCreateWithoutSeatInput> | SeatReservationCreateWithoutSeatInput[] | SeatReservationUncheckedCreateWithoutSeatInput[]
    connectOrCreate?: SeatReservationCreateOrConnectWithoutSeatInput | SeatReservationCreateOrConnectWithoutSeatInput[]
    createMany?: SeatReservationCreateManySeatInputEnvelope
    connect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
  }

  export type SeatReservationUncheckedCreateNestedManyWithoutSeatInput = {
    create?: XOR<SeatReservationCreateWithoutSeatInput, SeatReservationUncheckedCreateWithoutSeatInput> | SeatReservationCreateWithoutSeatInput[] | SeatReservationUncheckedCreateWithoutSeatInput[]
    connectOrCreate?: SeatReservationCreateOrConnectWithoutSeatInput | SeatReservationCreateOrConnectWithoutSeatInput[]
    createMany?: SeatReservationCreateManySeatInputEnvelope
    connect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
  }

  export type ScreenUpdateOneWithoutSeatsNestedInput = {
    create?: XOR<ScreenCreateWithoutSeatsInput, ScreenUncheckedCreateWithoutSeatsInput>
    connectOrCreate?: ScreenCreateOrConnectWithoutSeatsInput
    upsert?: ScreenUpsertWithoutSeatsInput
    disconnect?: ScreenWhereInput | boolean
    delete?: ScreenWhereInput | boolean
    connect?: ScreenWhereUniqueInput
    update?: XOR<XOR<ScreenUpdateToOneWithWhereWithoutSeatsInput, ScreenUpdateWithoutSeatsInput>, ScreenUncheckedUpdateWithoutSeatsInput>
  }

  export type SeatReservationUpdateManyWithoutSeatNestedInput = {
    create?: XOR<SeatReservationCreateWithoutSeatInput, SeatReservationUncheckedCreateWithoutSeatInput> | SeatReservationCreateWithoutSeatInput[] | SeatReservationUncheckedCreateWithoutSeatInput[]
    connectOrCreate?: SeatReservationCreateOrConnectWithoutSeatInput | SeatReservationCreateOrConnectWithoutSeatInput[]
    upsert?: SeatReservationUpsertWithWhereUniqueWithoutSeatInput | SeatReservationUpsertWithWhereUniqueWithoutSeatInput[]
    createMany?: SeatReservationCreateManySeatInputEnvelope
    set?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    disconnect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    delete?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    connect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    update?: SeatReservationUpdateWithWhereUniqueWithoutSeatInput | SeatReservationUpdateWithWhereUniqueWithoutSeatInput[]
    updateMany?: SeatReservationUpdateManyWithWhereWithoutSeatInput | SeatReservationUpdateManyWithWhereWithoutSeatInput[]
    deleteMany?: SeatReservationScalarWhereInput | SeatReservationScalarWhereInput[]
  }

  export type SeatReservationUncheckedUpdateManyWithoutSeatNestedInput = {
    create?: XOR<SeatReservationCreateWithoutSeatInput, SeatReservationUncheckedCreateWithoutSeatInput> | SeatReservationCreateWithoutSeatInput[] | SeatReservationUncheckedCreateWithoutSeatInput[]
    connectOrCreate?: SeatReservationCreateOrConnectWithoutSeatInput | SeatReservationCreateOrConnectWithoutSeatInput[]
    upsert?: SeatReservationUpsertWithWhereUniqueWithoutSeatInput | SeatReservationUpsertWithWhereUniqueWithoutSeatInput[]
    createMany?: SeatReservationCreateManySeatInputEnvelope
    set?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    disconnect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    delete?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    connect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    update?: SeatReservationUpdateWithWhereUniqueWithoutSeatInput | SeatReservationUpdateWithWhereUniqueWithoutSeatInput[]
    updateMany?: SeatReservationUpdateManyWithWhereWithoutSeatInput | SeatReservationUpdateManyWithWhereWithoutSeatInput[]
    deleteMany?: SeatReservationScalarWhereInput | SeatReservationScalarWhereInput[]
  }

  export type TheatreCreateNestedOneWithoutShowtimesInput = {
    create?: XOR<TheatreCreateWithoutShowtimesInput, TheatreUncheckedCreateWithoutShowtimesInput>
    connectOrCreate?: TheatreCreateOrConnectWithoutShowtimesInput
    connect?: TheatreWhereUniqueInput
  }

  export type ScreenCreateNestedOneWithoutShowtimesInput = {
    create?: XOR<ScreenCreateWithoutShowtimesInput, ScreenUncheckedCreateWithoutShowtimesInput>
    connectOrCreate?: ScreenCreateOrConnectWithoutShowtimesInput
    connect?: ScreenWhereUniqueInput
  }

  export type MovieCreateNestedOneWithoutShowtimesInput = {
    create?: XOR<MovieCreateWithoutShowtimesInput, MovieUncheckedCreateWithoutShowtimesInput>
    connectOrCreate?: MovieCreateOrConnectWithoutShowtimesInput
    connect?: MovieWhereUniqueInput
  }

  export type SeatReservationCreateNestedManyWithoutShowtimeInput = {
    create?: XOR<SeatReservationCreateWithoutShowtimeInput, SeatReservationUncheckedCreateWithoutShowtimeInput> | SeatReservationCreateWithoutShowtimeInput[] | SeatReservationUncheckedCreateWithoutShowtimeInput[]
    connectOrCreate?: SeatReservationCreateOrConnectWithoutShowtimeInput | SeatReservationCreateOrConnectWithoutShowtimeInput[]
    createMany?: SeatReservationCreateManyShowtimeInputEnvelope
    connect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
  }

  export type BookingCreateNestedManyWithoutShowtimeInput = {
    create?: XOR<BookingCreateWithoutShowtimeInput, BookingUncheckedCreateWithoutShowtimeInput> | BookingCreateWithoutShowtimeInput[] | BookingUncheckedCreateWithoutShowtimeInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutShowtimeInput | BookingCreateOrConnectWithoutShowtimeInput[]
    createMany?: BookingCreateManyShowtimeInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type SeatReservationUncheckedCreateNestedManyWithoutShowtimeInput = {
    create?: XOR<SeatReservationCreateWithoutShowtimeInput, SeatReservationUncheckedCreateWithoutShowtimeInput> | SeatReservationCreateWithoutShowtimeInput[] | SeatReservationUncheckedCreateWithoutShowtimeInput[]
    connectOrCreate?: SeatReservationCreateOrConnectWithoutShowtimeInput | SeatReservationCreateOrConnectWithoutShowtimeInput[]
    createMany?: SeatReservationCreateManyShowtimeInputEnvelope
    connect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutShowtimeInput = {
    create?: XOR<BookingCreateWithoutShowtimeInput, BookingUncheckedCreateWithoutShowtimeInput> | BookingCreateWithoutShowtimeInput[] | BookingUncheckedCreateWithoutShowtimeInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutShowtimeInput | BookingCreateOrConnectWithoutShowtimeInput[]
    createMany?: BookingCreateManyShowtimeInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type TheatreUpdateOneWithoutShowtimesNestedInput = {
    create?: XOR<TheatreCreateWithoutShowtimesInput, TheatreUncheckedCreateWithoutShowtimesInput>
    connectOrCreate?: TheatreCreateOrConnectWithoutShowtimesInput
    upsert?: TheatreUpsertWithoutShowtimesInput
    disconnect?: TheatreWhereInput | boolean
    delete?: TheatreWhereInput | boolean
    connect?: TheatreWhereUniqueInput
    update?: XOR<XOR<TheatreUpdateToOneWithWhereWithoutShowtimesInput, TheatreUpdateWithoutShowtimesInput>, TheatreUncheckedUpdateWithoutShowtimesInput>
  }

  export type ScreenUpdateOneWithoutShowtimesNestedInput = {
    create?: XOR<ScreenCreateWithoutShowtimesInput, ScreenUncheckedCreateWithoutShowtimesInput>
    connectOrCreate?: ScreenCreateOrConnectWithoutShowtimesInput
    upsert?: ScreenUpsertWithoutShowtimesInput
    disconnect?: ScreenWhereInput | boolean
    delete?: ScreenWhereInput | boolean
    connect?: ScreenWhereUniqueInput
    update?: XOR<XOR<ScreenUpdateToOneWithWhereWithoutShowtimesInput, ScreenUpdateWithoutShowtimesInput>, ScreenUncheckedUpdateWithoutShowtimesInput>
  }

  export type MovieUpdateOneWithoutShowtimesNestedInput = {
    create?: XOR<MovieCreateWithoutShowtimesInput, MovieUncheckedCreateWithoutShowtimesInput>
    connectOrCreate?: MovieCreateOrConnectWithoutShowtimesInput
    upsert?: MovieUpsertWithoutShowtimesInput
    disconnect?: MovieWhereInput | boolean
    delete?: MovieWhereInput | boolean
    connect?: MovieWhereUniqueInput
    update?: XOR<XOR<MovieUpdateToOneWithWhereWithoutShowtimesInput, MovieUpdateWithoutShowtimesInput>, MovieUncheckedUpdateWithoutShowtimesInput>
  }

  export type SeatReservationUpdateManyWithoutShowtimeNestedInput = {
    create?: XOR<SeatReservationCreateWithoutShowtimeInput, SeatReservationUncheckedCreateWithoutShowtimeInput> | SeatReservationCreateWithoutShowtimeInput[] | SeatReservationUncheckedCreateWithoutShowtimeInput[]
    connectOrCreate?: SeatReservationCreateOrConnectWithoutShowtimeInput | SeatReservationCreateOrConnectWithoutShowtimeInput[]
    upsert?: SeatReservationUpsertWithWhereUniqueWithoutShowtimeInput | SeatReservationUpsertWithWhereUniqueWithoutShowtimeInput[]
    createMany?: SeatReservationCreateManyShowtimeInputEnvelope
    set?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    disconnect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    delete?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    connect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    update?: SeatReservationUpdateWithWhereUniqueWithoutShowtimeInput | SeatReservationUpdateWithWhereUniqueWithoutShowtimeInput[]
    updateMany?: SeatReservationUpdateManyWithWhereWithoutShowtimeInput | SeatReservationUpdateManyWithWhereWithoutShowtimeInput[]
    deleteMany?: SeatReservationScalarWhereInput | SeatReservationScalarWhereInput[]
  }

  export type BookingUpdateManyWithoutShowtimeNestedInput = {
    create?: XOR<BookingCreateWithoutShowtimeInput, BookingUncheckedCreateWithoutShowtimeInput> | BookingCreateWithoutShowtimeInput[] | BookingUncheckedCreateWithoutShowtimeInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutShowtimeInput | BookingCreateOrConnectWithoutShowtimeInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutShowtimeInput | BookingUpsertWithWhereUniqueWithoutShowtimeInput[]
    createMany?: BookingCreateManyShowtimeInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutShowtimeInput | BookingUpdateWithWhereUniqueWithoutShowtimeInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutShowtimeInput | BookingUpdateManyWithWhereWithoutShowtimeInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type SeatReservationUncheckedUpdateManyWithoutShowtimeNestedInput = {
    create?: XOR<SeatReservationCreateWithoutShowtimeInput, SeatReservationUncheckedCreateWithoutShowtimeInput> | SeatReservationCreateWithoutShowtimeInput[] | SeatReservationUncheckedCreateWithoutShowtimeInput[]
    connectOrCreate?: SeatReservationCreateOrConnectWithoutShowtimeInput | SeatReservationCreateOrConnectWithoutShowtimeInput[]
    upsert?: SeatReservationUpsertWithWhereUniqueWithoutShowtimeInput | SeatReservationUpsertWithWhereUniqueWithoutShowtimeInput[]
    createMany?: SeatReservationCreateManyShowtimeInputEnvelope
    set?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    disconnect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    delete?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    connect?: SeatReservationWhereUniqueInput | SeatReservationWhereUniqueInput[]
    update?: SeatReservationUpdateWithWhereUniqueWithoutShowtimeInput | SeatReservationUpdateWithWhereUniqueWithoutShowtimeInput[]
    updateMany?: SeatReservationUpdateManyWithWhereWithoutShowtimeInput | SeatReservationUpdateManyWithWhereWithoutShowtimeInput[]
    deleteMany?: SeatReservationScalarWhereInput | SeatReservationScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutShowtimeNestedInput = {
    create?: XOR<BookingCreateWithoutShowtimeInput, BookingUncheckedCreateWithoutShowtimeInput> | BookingCreateWithoutShowtimeInput[] | BookingUncheckedCreateWithoutShowtimeInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutShowtimeInput | BookingCreateOrConnectWithoutShowtimeInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutShowtimeInput | BookingUpsertWithWhereUniqueWithoutShowtimeInput[]
    createMany?: BookingCreateManyShowtimeInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutShowtimeInput | BookingUpdateWithWhereUniqueWithoutShowtimeInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutShowtimeInput | BookingUpdateManyWithWhereWithoutShowtimeInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type ShowtimeCreateNestedOneWithoutReservationsInput = {
    create?: XOR<ShowtimeCreateWithoutReservationsInput, ShowtimeUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: ShowtimeCreateOrConnectWithoutReservationsInput
    connect?: ShowtimeWhereUniqueInput
  }

  export type SeatCreateNestedOneWithoutReservationsInput = {
    create?: XOR<SeatCreateWithoutReservationsInput, SeatUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: SeatCreateOrConnectWithoutReservationsInput
    connect?: SeatWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ShowtimeUpdateOneRequiredWithoutReservationsNestedInput = {
    create?: XOR<ShowtimeCreateWithoutReservationsInput, ShowtimeUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: ShowtimeCreateOrConnectWithoutReservationsInput
    upsert?: ShowtimeUpsertWithoutReservationsInput
    connect?: ShowtimeWhereUniqueInput
    update?: XOR<XOR<ShowtimeUpdateToOneWithWhereWithoutReservationsInput, ShowtimeUpdateWithoutReservationsInput>, ShowtimeUncheckedUpdateWithoutReservationsInput>
  }

  export type SeatUpdateOneRequiredWithoutReservationsNestedInput = {
    create?: XOR<SeatCreateWithoutReservationsInput, SeatUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: SeatCreateOrConnectWithoutReservationsInput
    upsert?: SeatUpsertWithoutReservationsInput
    connect?: SeatWhereUniqueInput
    update?: XOR<XOR<SeatUpdateToOneWithWhereWithoutReservationsInput, SeatUpdateWithoutReservationsInput>, SeatUncheckedUpdateWithoutReservationsInput>
  }

  export type UserCreateNestedOneWithoutBookingsInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput
    connect?: UserWhereUniqueInput
  }

  export type ShowtimeCreateNestedOneWithoutBookingsInput = {
    create?: XOR<ShowtimeCreateWithoutBookingsInput, ShowtimeUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: ShowtimeCreateOrConnectWithoutBookingsInput
    connect?: ShowtimeWhereUniqueInput
  }

  export type PaymentCreateNestedOneWithoutBookingInput = {
    create?: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutBookingInput
    connect?: PaymentWhereUniqueInput
  }

  export type BookingSeatCreateNestedManyWithoutBookingInput = {
    create?: XOR<BookingSeatCreateWithoutBookingInput, BookingSeatUncheckedCreateWithoutBookingInput> | BookingSeatCreateWithoutBookingInput[] | BookingSeatUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingSeatCreateOrConnectWithoutBookingInput | BookingSeatCreateOrConnectWithoutBookingInput[]
    createMany?: BookingSeatCreateManyBookingInputEnvelope
    connect?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
  }

  export type BookingAddonCreateNestedManyWithoutBookingInput = {
    create?: XOR<BookingAddonCreateWithoutBookingInput, BookingAddonUncheckedCreateWithoutBookingInput> | BookingAddonCreateWithoutBookingInput[] | BookingAddonUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingAddonCreateOrConnectWithoutBookingInput | BookingAddonCreateOrConnectWithoutBookingInput[]
    createMany?: BookingAddonCreateManyBookingInputEnvelope
    connect?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
  }

  export type CancellationAuditLogCreateNestedManyWithoutBookingInput = {
    create?: XOR<CancellationAuditLogCreateWithoutBookingInput, CancellationAuditLogUncheckedCreateWithoutBookingInput> | CancellationAuditLogCreateWithoutBookingInput[] | CancellationAuditLogUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: CancellationAuditLogCreateOrConnectWithoutBookingInput | CancellationAuditLogCreateOrConnectWithoutBookingInput[]
    createMany?: CancellationAuditLogCreateManyBookingInputEnvelope
    connect?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedOneWithoutBookingInput = {
    create?: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutBookingInput
    connect?: PaymentWhereUniqueInput
  }

  export type BookingSeatUncheckedCreateNestedManyWithoutBookingInput = {
    create?: XOR<BookingSeatCreateWithoutBookingInput, BookingSeatUncheckedCreateWithoutBookingInput> | BookingSeatCreateWithoutBookingInput[] | BookingSeatUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingSeatCreateOrConnectWithoutBookingInput | BookingSeatCreateOrConnectWithoutBookingInput[]
    createMany?: BookingSeatCreateManyBookingInputEnvelope
    connect?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
  }

  export type BookingAddonUncheckedCreateNestedManyWithoutBookingInput = {
    create?: XOR<BookingAddonCreateWithoutBookingInput, BookingAddonUncheckedCreateWithoutBookingInput> | BookingAddonCreateWithoutBookingInput[] | BookingAddonUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingAddonCreateOrConnectWithoutBookingInput | BookingAddonCreateOrConnectWithoutBookingInput[]
    createMany?: BookingAddonCreateManyBookingInputEnvelope
    connect?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
  }

  export type CancellationAuditLogUncheckedCreateNestedManyWithoutBookingInput = {
    create?: XOR<CancellationAuditLogCreateWithoutBookingInput, CancellationAuditLogUncheckedCreateWithoutBookingInput> | CancellationAuditLogCreateWithoutBookingInput[] | CancellationAuditLogUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: CancellationAuditLogCreateOrConnectWithoutBookingInput | CancellationAuditLogCreateOrConnectWithoutBookingInput[]
    createMany?: CancellationAuditLogCreateManyBookingInputEnvelope
    connect?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
  }

  export type UserUpdateOneWithoutBookingsNestedInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput
    upsert?: UserUpsertWithoutBookingsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBookingsInput, UserUpdateWithoutBookingsInput>, UserUncheckedUpdateWithoutBookingsInput>
  }

  export type ShowtimeUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<ShowtimeCreateWithoutBookingsInput, ShowtimeUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: ShowtimeCreateOrConnectWithoutBookingsInput
    upsert?: ShowtimeUpsertWithoutBookingsInput
    connect?: ShowtimeWhereUniqueInput
    update?: XOR<XOR<ShowtimeUpdateToOneWithWhereWithoutBookingsInput, ShowtimeUpdateWithoutBookingsInput>, ShowtimeUncheckedUpdateWithoutBookingsInput>
  }

  export type PaymentUpdateOneWithoutBookingNestedInput = {
    create?: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutBookingInput
    upsert?: PaymentUpsertWithoutBookingInput
    disconnect?: PaymentWhereInput | boolean
    delete?: PaymentWhereInput | boolean
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutBookingInput, PaymentUpdateWithoutBookingInput>, PaymentUncheckedUpdateWithoutBookingInput>
  }

  export type BookingSeatUpdateManyWithoutBookingNestedInput = {
    create?: XOR<BookingSeatCreateWithoutBookingInput, BookingSeatUncheckedCreateWithoutBookingInput> | BookingSeatCreateWithoutBookingInput[] | BookingSeatUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingSeatCreateOrConnectWithoutBookingInput | BookingSeatCreateOrConnectWithoutBookingInput[]
    upsert?: BookingSeatUpsertWithWhereUniqueWithoutBookingInput | BookingSeatUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: BookingSeatCreateManyBookingInputEnvelope
    set?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
    disconnect?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
    delete?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
    connect?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
    update?: BookingSeatUpdateWithWhereUniqueWithoutBookingInput | BookingSeatUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: BookingSeatUpdateManyWithWhereWithoutBookingInput | BookingSeatUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: BookingSeatScalarWhereInput | BookingSeatScalarWhereInput[]
  }

  export type BookingAddonUpdateManyWithoutBookingNestedInput = {
    create?: XOR<BookingAddonCreateWithoutBookingInput, BookingAddonUncheckedCreateWithoutBookingInput> | BookingAddonCreateWithoutBookingInput[] | BookingAddonUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingAddonCreateOrConnectWithoutBookingInput | BookingAddonCreateOrConnectWithoutBookingInput[]
    upsert?: BookingAddonUpsertWithWhereUniqueWithoutBookingInput | BookingAddonUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: BookingAddonCreateManyBookingInputEnvelope
    set?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
    disconnect?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
    delete?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
    connect?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
    update?: BookingAddonUpdateWithWhereUniqueWithoutBookingInput | BookingAddonUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: BookingAddonUpdateManyWithWhereWithoutBookingInput | BookingAddonUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: BookingAddonScalarWhereInput | BookingAddonScalarWhereInput[]
  }

  export type CancellationAuditLogUpdateManyWithoutBookingNestedInput = {
    create?: XOR<CancellationAuditLogCreateWithoutBookingInput, CancellationAuditLogUncheckedCreateWithoutBookingInput> | CancellationAuditLogCreateWithoutBookingInput[] | CancellationAuditLogUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: CancellationAuditLogCreateOrConnectWithoutBookingInput | CancellationAuditLogCreateOrConnectWithoutBookingInput[]
    upsert?: CancellationAuditLogUpsertWithWhereUniqueWithoutBookingInput | CancellationAuditLogUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: CancellationAuditLogCreateManyBookingInputEnvelope
    set?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
    disconnect?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
    delete?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
    connect?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
    update?: CancellationAuditLogUpdateWithWhereUniqueWithoutBookingInput | CancellationAuditLogUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: CancellationAuditLogUpdateManyWithWhereWithoutBookingInput | CancellationAuditLogUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: CancellationAuditLogScalarWhereInput | CancellationAuditLogScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateOneWithoutBookingNestedInput = {
    create?: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutBookingInput
    upsert?: PaymentUpsertWithoutBookingInput
    disconnect?: PaymentWhereInput | boolean
    delete?: PaymentWhereInput | boolean
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutBookingInput, PaymentUpdateWithoutBookingInput>, PaymentUncheckedUpdateWithoutBookingInput>
  }

  export type BookingSeatUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: XOR<BookingSeatCreateWithoutBookingInput, BookingSeatUncheckedCreateWithoutBookingInput> | BookingSeatCreateWithoutBookingInput[] | BookingSeatUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingSeatCreateOrConnectWithoutBookingInput | BookingSeatCreateOrConnectWithoutBookingInput[]
    upsert?: BookingSeatUpsertWithWhereUniqueWithoutBookingInput | BookingSeatUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: BookingSeatCreateManyBookingInputEnvelope
    set?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
    disconnect?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
    delete?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
    connect?: BookingSeatWhereUniqueInput | BookingSeatWhereUniqueInput[]
    update?: BookingSeatUpdateWithWhereUniqueWithoutBookingInput | BookingSeatUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: BookingSeatUpdateManyWithWhereWithoutBookingInput | BookingSeatUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: BookingSeatScalarWhereInput | BookingSeatScalarWhereInput[]
  }

  export type BookingAddonUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: XOR<BookingAddonCreateWithoutBookingInput, BookingAddonUncheckedCreateWithoutBookingInput> | BookingAddonCreateWithoutBookingInput[] | BookingAddonUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingAddonCreateOrConnectWithoutBookingInput | BookingAddonCreateOrConnectWithoutBookingInput[]
    upsert?: BookingAddonUpsertWithWhereUniqueWithoutBookingInput | BookingAddonUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: BookingAddonCreateManyBookingInputEnvelope
    set?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
    disconnect?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
    delete?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
    connect?: BookingAddonWhereUniqueInput | BookingAddonWhereUniqueInput[]
    update?: BookingAddonUpdateWithWhereUniqueWithoutBookingInput | BookingAddonUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: BookingAddonUpdateManyWithWhereWithoutBookingInput | BookingAddonUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: BookingAddonScalarWhereInput | BookingAddonScalarWhereInput[]
  }

  export type CancellationAuditLogUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: XOR<CancellationAuditLogCreateWithoutBookingInput, CancellationAuditLogUncheckedCreateWithoutBookingInput> | CancellationAuditLogCreateWithoutBookingInput[] | CancellationAuditLogUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: CancellationAuditLogCreateOrConnectWithoutBookingInput | CancellationAuditLogCreateOrConnectWithoutBookingInput[]
    upsert?: CancellationAuditLogUpsertWithWhereUniqueWithoutBookingInput | CancellationAuditLogUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: CancellationAuditLogCreateManyBookingInputEnvelope
    set?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
    disconnect?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
    delete?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
    connect?: CancellationAuditLogWhereUniqueInput | CancellationAuditLogWhereUniqueInput[]
    update?: CancellationAuditLogUpdateWithWhereUniqueWithoutBookingInput | CancellationAuditLogUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: CancellationAuditLogUpdateManyWithWhereWithoutBookingInput | CancellationAuditLogUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: CancellationAuditLogScalarWhereInput | CancellationAuditLogScalarWhereInput[]
  }

  export type BookingCreateNestedOneWithoutSeatsInput = {
    create?: XOR<BookingCreateWithoutSeatsInput, BookingUncheckedCreateWithoutSeatsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutSeatsInput
    connect?: BookingWhereUniqueInput
  }

  export type BookingUpdateOneRequiredWithoutSeatsNestedInput = {
    create?: XOR<BookingCreateWithoutSeatsInput, BookingUncheckedCreateWithoutSeatsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutSeatsInput
    upsert?: BookingUpsertWithoutSeatsInput
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutSeatsInput, BookingUpdateWithoutSeatsInput>, BookingUncheckedUpdateWithoutSeatsInput>
  }

  export type BookingCreateNestedOneWithoutAddonsInput = {
    create?: XOR<BookingCreateWithoutAddonsInput, BookingUncheckedCreateWithoutAddonsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutAddonsInput
    connect?: BookingWhereUniqueInput
  }

  export type BookingUpdateOneRequiredWithoutAddonsNestedInput = {
    create?: XOR<BookingCreateWithoutAddonsInput, BookingUncheckedCreateWithoutAddonsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutAddonsInput
    upsert?: BookingUpsertWithoutAddonsInput
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutAddonsInput, BookingUpdateWithoutAddonsInput>, BookingUncheckedUpdateWithoutAddonsInput>
  }

  export type BookingCreateNestedOneWithoutPaymentInput = {
    create?: XOR<BookingCreateWithoutPaymentInput, BookingUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: BookingCreateOrConnectWithoutPaymentInput
    connect?: BookingWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BookingUpdateOneWithoutPaymentNestedInput = {
    create?: XOR<BookingCreateWithoutPaymentInput, BookingUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: BookingCreateOrConnectWithoutPaymentInput
    upsert?: BookingUpsertWithoutPaymentInput
    disconnect?: BookingWhereInput | boolean
    delete?: BookingWhereInput | boolean
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutPaymentInput, BookingUpdateWithoutPaymentInput>, BookingUncheckedUpdateWithoutPaymentInput>
  }

  export type MovieCreateNestedOneWithoutReviewsInput = {
    create?: XOR<MovieCreateWithoutReviewsInput, MovieUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: MovieCreateOrConnectWithoutReviewsInput
    connect?: MovieWhereUniqueInput
  }

  export type MovieUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<MovieCreateWithoutReviewsInput, MovieUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: MovieCreateOrConnectWithoutReviewsInput
    upsert?: MovieUpsertWithoutReviewsInput
    connect?: MovieWhereUniqueInput
    update?: XOR<XOR<MovieUpdateToOneWithWhereWithoutReviewsInput, MovieUpdateWithoutReviewsInput>, MovieUncheckedUpdateWithoutReviewsInput>
  }

  export type MovieCreateNestedOneWithoutCastInput = {
    create?: XOR<MovieCreateWithoutCastInput, MovieUncheckedCreateWithoutCastInput>
    connectOrCreate?: MovieCreateOrConnectWithoutCastInput
    connect?: MovieWhereUniqueInput
  }

  export type MovieUpdateOneRequiredWithoutCastNestedInput = {
    create?: XOR<MovieCreateWithoutCastInput, MovieUncheckedCreateWithoutCastInput>
    connectOrCreate?: MovieCreateOrConnectWithoutCastInput
    upsert?: MovieUpsertWithoutCastInput
    connect?: MovieWhereUniqueInput
    update?: XOR<XOR<MovieUpdateToOneWithWhereWithoutCastInput, MovieUpdateWithoutCastInput>, MovieUncheckedUpdateWithoutCastInput>
  }

  export type BookingCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<BookingCreateWithoutAuditLogsInput, BookingUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutAuditLogsInput
    connect?: BookingWhereUniqueInput
  }

  export type BookingUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<BookingCreateWithoutAuditLogsInput, BookingUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutAuditLogsInput
    upsert?: BookingUpsertWithoutAuditLogsInput
    disconnect?: BookingWhereInput | boolean
    delete?: BookingWhereInput | boolean
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutAuditLogsInput, BookingUpdateWithoutAuditLogsInput>, BookingUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type BookingCreateWithoutUserInput = {
    id?: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    showtime: ShowtimeCreateNestedOneWithoutBookingsInput
    payment?: PaymentCreateNestedOneWithoutBookingInput
    seats?: BookingSeatCreateNestedManyWithoutBookingInput
    addons?: BookingAddonCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutUserInput = {
    id?: string
    showtimeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    payment?: PaymentUncheckedCreateNestedOneWithoutBookingInput
    seats?: BookingSeatUncheckedCreateNestedManyWithoutBookingInput
    addons?: BookingAddonUncheckedCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutUserInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
  }

  export type BookingCreateManyUserInputEnvelope = {
    data: BookingCreateManyUserInput | BookingCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BookingUpsertWithWhereUniqueWithoutUserInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutUserInput, BookingUncheckedUpdateWithoutUserInput>
    create: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutUserInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutUserInput, BookingUncheckedUpdateWithoutUserInput>
  }

  export type BookingUpdateManyWithWhereWithoutUserInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutUserInput>
  }

  export type BookingScalarWhereInput = {
    AND?: BookingScalarWhereInput | BookingScalarWhereInput[]
    OR?: BookingScalarWhereInput[]
    NOT?: BookingScalarWhereInput | BookingScalarWhereInput[]
    id?: StringFilter<"Booking"> | string
    userId?: StringNullableFilter<"Booking"> | string | null
    showtimeId?: StringFilter<"Booking"> | string
    customerName?: StringFilter<"Booking"> | string
    customerEmail?: StringFilter<"Booking"> | string
    customerPhone?: StringFilter<"Booking"> | string
    subtotal?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFilter<"Booking"> | string
    status?: StringFilter<"Booking"> | string
    refundStatus?: StringFilter<"Booking"> | string
    bookedAt?: DateTimeFilter<"Booking"> | Date | string
    cancelledAt?: DateTimeNullableFilter<"Booking"> | Date | string | null
    refundAmount?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    refundId?: StringNullableFilter<"Booking"> | string | null
    bookingRef?: StringNullableFilter<"Booking"> | string | null
  }

  export type ShowtimeCreateWithoutMovieInput = {
    id: string
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    cinema?: TheatreCreateNestedOneWithoutShowtimesInput
    screen?: ScreenCreateNestedOneWithoutShowtimesInput
    reservations?: SeatReservationCreateNestedManyWithoutShowtimeInput
    bookings?: BookingCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeUncheckedCreateWithoutMovieInput = {
    id: string
    cinemaId?: string | null
    screenId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    reservations?: SeatReservationUncheckedCreateNestedManyWithoutShowtimeInput
    bookings?: BookingUncheckedCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeCreateOrConnectWithoutMovieInput = {
    where: ShowtimeWhereUniqueInput
    create: XOR<ShowtimeCreateWithoutMovieInput, ShowtimeUncheckedCreateWithoutMovieInput>
  }

  export type ShowtimeCreateManyMovieInputEnvelope = {
    data: ShowtimeCreateManyMovieInput | ShowtimeCreateManyMovieInput[]
    skipDuplicates?: boolean
  }

  export type ReviewCreateWithoutMovieInput = {
    id?: string
    userName: string
    userEmail?: string | null
    rating: Decimal | DecimalJsLike | number | string
    comment: string
    createdAt?: Date | string
  }

  export type ReviewUncheckedCreateWithoutMovieInput = {
    id?: string
    userName: string
    userEmail?: string | null
    rating: Decimal | DecimalJsLike | number | string
    comment: string
    createdAt?: Date | string
  }

  export type ReviewCreateOrConnectWithoutMovieInput = {
    where: ReviewWhereUniqueInput
    create: XOR<ReviewCreateWithoutMovieInput, ReviewUncheckedCreateWithoutMovieInput>
  }

  export type ReviewCreateManyMovieInputEnvelope = {
    data: ReviewCreateManyMovieInput | ReviewCreateManyMovieInput[]
    skipDuplicates?: boolean
  }

  export type MovieCastCreateWithoutMovieInput = {
    name: string
    role: string
    avatar: string
  }

  export type MovieCastUncheckedCreateWithoutMovieInput = {
    id?: number
    name: string
    role: string
    avatar: string
  }

  export type MovieCastCreateOrConnectWithoutMovieInput = {
    where: MovieCastWhereUniqueInput
    create: XOR<MovieCastCreateWithoutMovieInput, MovieCastUncheckedCreateWithoutMovieInput>
  }

  export type MovieCastCreateManyMovieInputEnvelope = {
    data: MovieCastCreateManyMovieInput | MovieCastCreateManyMovieInput[]
    skipDuplicates?: boolean
  }

  export type ShowtimeUpsertWithWhereUniqueWithoutMovieInput = {
    where: ShowtimeWhereUniqueInput
    update: XOR<ShowtimeUpdateWithoutMovieInput, ShowtimeUncheckedUpdateWithoutMovieInput>
    create: XOR<ShowtimeCreateWithoutMovieInput, ShowtimeUncheckedCreateWithoutMovieInput>
  }

  export type ShowtimeUpdateWithWhereUniqueWithoutMovieInput = {
    where: ShowtimeWhereUniqueInput
    data: XOR<ShowtimeUpdateWithoutMovieInput, ShowtimeUncheckedUpdateWithoutMovieInput>
  }

  export type ShowtimeUpdateManyWithWhereWithoutMovieInput = {
    where: ShowtimeScalarWhereInput
    data: XOR<ShowtimeUpdateManyMutationInput, ShowtimeUncheckedUpdateManyWithoutMovieInput>
  }

  export type ShowtimeScalarWhereInput = {
    AND?: ShowtimeScalarWhereInput | ShowtimeScalarWhereInput[]
    OR?: ShowtimeScalarWhereInput[]
    NOT?: ShowtimeScalarWhereInput | ShowtimeScalarWhereInput[]
    id?: StringFilter<"Showtime"> | string
    cinemaId?: StringNullableFilter<"Showtime"> | string | null
    screenId?: StringNullableFilter<"Showtime"> | string | null
    movieId?: StringNullableFilter<"Showtime"> | string | null
    date?: StringFilter<"Showtime"> | string
    time?: StringFilter<"Showtime"> | string
    format?: StringFilter<"Showtime"> | string
    hallName?: StringFilter<"Showtime"> | string
    language?: StringFilter<"Showtime"> | string
    priceMultiplier?: DecimalFilter<"Showtime"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Showtime"> | Date | string
    hall?: StringNullableFilter<"Showtime"> | string | null
  }

  export type ReviewUpsertWithWhereUniqueWithoutMovieInput = {
    where: ReviewWhereUniqueInput
    update: XOR<ReviewUpdateWithoutMovieInput, ReviewUncheckedUpdateWithoutMovieInput>
    create: XOR<ReviewCreateWithoutMovieInput, ReviewUncheckedCreateWithoutMovieInput>
  }

  export type ReviewUpdateWithWhereUniqueWithoutMovieInput = {
    where: ReviewWhereUniqueInput
    data: XOR<ReviewUpdateWithoutMovieInput, ReviewUncheckedUpdateWithoutMovieInput>
  }

  export type ReviewUpdateManyWithWhereWithoutMovieInput = {
    where: ReviewScalarWhereInput
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyWithoutMovieInput>
  }

  export type ReviewScalarWhereInput = {
    AND?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    OR?: ReviewScalarWhereInput[]
    NOT?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    id?: StringFilter<"Review"> | string
    movieId?: StringFilter<"Review"> | string
    userName?: StringFilter<"Review"> | string
    userEmail?: StringNullableFilter<"Review"> | string | null
    rating?: DecimalFilter<"Review"> | Decimal | DecimalJsLike | number | string
    comment?: StringFilter<"Review"> | string
    createdAt?: DateTimeFilter<"Review"> | Date | string
  }

  export type MovieCastUpsertWithWhereUniqueWithoutMovieInput = {
    where: MovieCastWhereUniqueInput
    update: XOR<MovieCastUpdateWithoutMovieInput, MovieCastUncheckedUpdateWithoutMovieInput>
    create: XOR<MovieCastCreateWithoutMovieInput, MovieCastUncheckedCreateWithoutMovieInput>
  }

  export type MovieCastUpdateWithWhereUniqueWithoutMovieInput = {
    where: MovieCastWhereUniqueInput
    data: XOR<MovieCastUpdateWithoutMovieInput, MovieCastUncheckedUpdateWithoutMovieInput>
  }

  export type MovieCastUpdateManyWithWhereWithoutMovieInput = {
    where: MovieCastScalarWhereInput
    data: XOR<MovieCastUpdateManyMutationInput, MovieCastUncheckedUpdateManyWithoutMovieInput>
  }

  export type MovieCastScalarWhereInput = {
    AND?: MovieCastScalarWhereInput | MovieCastScalarWhereInput[]
    OR?: MovieCastScalarWhereInput[]
    NOT?: MovieCastScalarWhereInput | MovieCastScalarWhereInput[]
    id?: IntFilter<"MovieCast"> | number
    movieId?: StringFilter<"MovieCast"> | string
    name?: StringFilter<"MovieCast"> | string
    role?: StringFilter<"MovieCast"> | string
    avatar?: StringFilter<"MovieCast"> | string
  }

  export type ScreenCreateWithoutTheatreInput = {
    id: string
    name: string
    screenType?: string
    seats?: SeatCreateNestedManyWithoutScreenInput
    showtimes?: ShowtimeCreateNestedManyWithoutScreenInput
  }

  export type ScreenUncheckedCreateWithoutTheatreInput = {
    id: string
    name: string
    screenType?: string
    seats?: SeatUncheckedCreateNestedManyWithoutScreenInput
    showtimes?: ShowtimeUncheckedCreateNestedManyWithoutScreenInput
  }

  export type ScreenCreateOrConnectWithoutTheatreInput = {
    where: ScreenWhereUniqueInput
    create: XOR<ScreenCreateWithoutTheatreInput, ScreenUncheckedCreateWithoutTheatreInput>
  }

  export type ScreenCreateManyTheatreInputEnvelope = {
    data: ScreenCreateManyTheatreInput | ScreenCreateManyTheatreInput[]
    skipDuplicates?: boolean
  }

  export type ShowtimeCreateWithoutCinemaInput = {
    id: string
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    screen?: ScreenCreateNestedOneWithoutShowtimesInput
    movie?: MovieCreateNestedOneWithoutShowtimesInput
    reservations?: SeatReservationCreateNestedManyWithoutShowtimeInput
    bookings?: BookingCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeUncheckedCreateWithoutCinemaInput = {
    id: string
    screenId?: string | null
    movieId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    reservations?: SeatReservationUncheckedCreateNestedManyWithoutShowtimeInput
    bookings?: BookingUncheckedCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeCreateOrConnectWithoutCinemaInput = {
    where: ShowtimeWhereUniqueInput
    create: XOR<ShowtimeCreateWithoutCinemaInput, ShowtimeUncheckedCreateWithoutCinemaInput>
  }

  export type ShowtimeCreateManyCinemaInputEnvelope = {
    data: ShowtimeCreateManyCinemaInput | ShowtimeCreateManyCinemaInput[]
    skipDuplicates?: boolean
  }

  export type ScreenUpsertWithWhereUniqueWithoutTheatreInput = {
    where: ScreenWhereUniqueInput
    update: XOR<ScreenUpdateWithoutTheatreInput, ScreenUncheckedUpdateWithoutTheatreInput>
    create: XOR<ScreenCreateWithoutTheatreInput, ScreenUncheckedCreateWithoutTheatreInput>
  }

  export type ScreenUpdateWithWhereUniqueWithoutTheatreInput = {
    where: ScreenWhereUniqueInput
    data: XOR<ScreenUpdateWithoutTheatreInput, ScreenUncheckedUpdateWithoutTheatreInput>
  }

  export type ScreenUpdateManyWithWhereWithoutTheatreInput = {
    where: ScreenScalarWhereInput
    data: XOR<ScreenUpdateManyMutationInput, ScreenUncheckedUpdateManyWithoutTheatreInput>
  }

  export type ScreenScalarWhereInput = {
    AND?: ScreenScalarWhereInput | ScreenScalarWhereInput[]
    OR?: ScreenScalarWhereInput[]
    NOT?: ScreenScalarWhereInput | ScreenScalarWhereInput[]
    id?: StringFilter<"Screen"> | string
    theatreId?: StringNullableFilter<"Screen"> | string | null
    name?: StringFilter<"Screen"> | string
    screenType?: StringFilter<"Screen"> | string
  }

  export type ShowtimeUpsertWithWhereUniqueWithoutCinemaInput = {
    where: ShowtimeWhereUniqueInput
    update: XOR<ShowtimeUpdateWithoutCinemaInput, ShowtimeUncheckedUpdateWithoutCinemaInput>
    create: XOR<ShowtimeCreateWithoutCinemaInput, ShowtimeUncheckedCreateWithoutCinemaInput>
  }

  export type ShowtimeUpdateWithWhereUniqueWithoutCinemaInput = {
    where: ShowtimeWhereUniqueInput
    data: XOR<ShowtimeUpdateWithoutCinemaInput, ShowtimeUncheckedUpdateWithoutCinemaInput>
  }

  export type ShowtimeUpdateManyWithWhereWithoutCinemaInput = {
    where: ShowtimeScalarWhereInput
    data: XOR<ShowtimeUpdateManyMutationInput, ShowtimeUncheckedUpdateManyWithoutCinemaInput>
  }

  export type TheatreCreateWithoutScreensInput = {
    id: string
    name: string
    city: string
    address: string
    facilities?: TheatreCreatefacilitiesInput | string[]
    distance?: string
    timezone?: string
    showtimes?: ShowtimeCreateNestedManyWithoutCinemaInput
  }

  export type TheatreUncheckedCreateWithoutScreensInput = {
    id: string
    name: string
    city: string
    address: string
    facilities?: TheatreCreatefacilitiesInput | string[]
    distance?: string
    timezone?: string
    showtimes?: ShowtimeUncheckedCreateNestedManyWithoutCinemaInput
  }

  export type TheatreCreateOrConnectWithoutScreensInput = {
    where: TheatreWhereUniqueInput
    create: XOR<TheatreCreateWithoutScreensInput, TheatreUncheckedCreateWithoutScreensInput>
  }

  export type SeatCreateWithoutScreenInput = {
    id: string
    row: string
    number: number
    seatNumber?: string | null
    tier?: string
    basePrice: Decimal | DecimalJsLike | number | string
    reservations?: SeatReservationCreateNestedManyWithoutSeatInput
  }

  export type SeatUncheckedCreateWithoutScreenInput = {
    id: string
    row: string
    number: number
    seatNumber?: string | null
    tier?: string
    basePrice: Decimal | DecimalJsLike | number | string
    reservations?: SeatReservationUncheckedCreateNestedManyWithoutSeatInput
  }

  export type SeatCreateOrConnectWithoutScreenInput = {
    where: SeatWhereUniqueInput
    create: XOR<SeatCreateWithoutScreenInput, SeatUncheckedCreateWithoutScreenInput>
  }

  export type SeatCreateManyScreenInputEnvelope = {
    data: SeatCreateManyScreenInput | SeatCreateManyScreenInput[]
    skipDuplicates?: boolean
  }

  export type ShowtimeCreateWithoutScreenInput = {
    id: string
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    cinema?: TheatreCreateNestedOneWithoutShowtimesInput
    movie?: MovieCreateNestedOneWithoutShowtimesInput
    reservations?: SeatReservationCreateNestedManyWithoutShowtimeInput
    bookings?: BookingCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeUncheckedCreateWithoutScreenInput = {
    id: string
    cinemaId?: string | null
    movieId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    reservations?: SeatReservationUncheckedCreateNestedManyWithoutShowtimeInput
    bookings?: BookingUncheckedCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeCreateOrConnectWithoutScreenInput = {
    where: ShowtimeWhereUniqueInput
    create: XOR<ShowtimeCreateWithoutScreenInput, ShowtimeUncheckedCreateWithoutScreenInput>
  }

  export type ShowtimeCreateManyScreenInputEnvelope = {
    data: ShowtimeCreateManyScreenInput | ShowtimeCreateManyScreenInput[]
    skipDuplicates?: boolean
  }

  export type TheatreUpsertWithoutScreensInput = {
    update: XOR<TheatreUpdateWithoutScreensInput, TheatreUncheckedUpdateWithoutScreensInput>
    create: XOR<TheatreCreateWithoutScreensInput, TheatreUncheckedCreateWithoutScreensInput>
    where?: TheatreWhereInput
  }

  export type TheatreUpdateToOneWithWhereWithoutScreensInput = {
    where?: TheatreWhereInput
    data: XOR<TheatreUpdateWithoutScreensInput, TheatreUncheckedUpdateWithoutScreensInput>
  }

  export type TheatreUpdateWithoutScreensInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    facilities?: TheatreUpdatefacilitiesInput | string[]
    distance?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    showtimes?: ShowtimeUpdateManyWithoutCinemaNestedInput
  }

  export type TheatreUncheckedUpdateWithoutScreensInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    facilities?: TheatreUpdatefacilitiesInput | string[]
    distance?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    showtimes?: ShowtimeUncheckedUpdateManyWithoutCinemaNestedInput
  }

  export type SeatUpsertWithWhereUniqueWithoutScreenInput = {
    where: SeatWhereUniqueInput
    update: XOR<SeatUpdateWithoutScreenInput, SeatUncheckedUpdateWithoutScreenInput>
    create: XOR<SeatCreateWithoutScreenInput, SeatUncheckedCreateWithoutScreenInput>
  }

  export type SeatUpdateWithWhereUniqueWithoutScreenInput = {
    where: SeatWhereUniqueInput
    data: XOR<SeatUpdateWithoutScreenInput, SeatUncheckedUpdateWithoutScreenInput>
  }

  export type SeatUpdateManyWithWhereWithoutScreenInput = {
    where: SeatScalarWhereInput
    data: XOR<SeatUpdateManyMutationInput, SeatUncheckedUpdateManyWithoutScreenInput>
  }

  export type SeatScalarWhereInput = {
    AND?: SeatScalarWhereInput | SeatScalarWhereInput[]
    OR?: SeatScalarWhereInput[]
    NOT?: SeatScalarWhereInput | SeatScalarWhereInput[]
    id?: StringFilter<"Seat"> | string
    screenId?: StringNullableFilter<"Seat"> | string | null
    row?: StringFilter<"Seat"> | string
    number?: IntFilter<"Seat"> | number
    seatNumber?: StringNullableFilter<"Seat"> | string | null
    tier?: StringFilter<"Seat"> | string
    basePrice?: DecimalFilter<"Seat"> | Decimal | DecimalJsLike | number | string
  }

  export type ShowtimeUpsertWithWhereUniqueWithoutScreenInput = {
    where: ShowtimeWhereUniqueInput
    update: XOR<ShowtimeUpdateWithoutScreenInput, ShowtimeUncheckedUpdateWithoutScreenInput>
    create: XOR<ShowtimeCreateWithoutScreenInput, ShowtimeUncheckedCreateWithoutScreenInput>
  }

  export type ShowtimeUpdateWithWhereUniqueWithoutScreenInput = {
    where: ShowtimeWhereUniqueInput
    data: XOR<ShowtimeUpdateWithoutScreenInput, ShowtimeUncheckedUpdateWithoutScreenInput>
  }

  export type ShowtimeUpdateManyWithWhereWithoutScreenInput = {
    where: ShowtimeScalarWhereInput
    data: XOR<ShowtimeUpdateManyMutationInput, ShowtimeUncheckedUpdateManyWithoutScreenInput>
  }

  export type ScreenCreateWithoutSeatsInput = {
    id: string
    name: string
    screenType?: string
    theatre?: TheatreCreateNestedOneWithoutScreensInput
    showtimes?: ShowtimeCreateNestedManyWithoutScreenInput
  }

  export type ScreenUncheckedCreateWithoutSeatsInput = {
    id: string
    theatreId?: string | null
    name: string
    screenType?: string
    showtimes?: ShowtimeUncheckedCreateNestedManyWithoutScreenInput
  }

  export type ScreenCreateOrConnectWithoutSeatsInput = {
    where: ScreenWhereUniqueInput
    create: XOR<ScreenCreateWithoutSeatsInput, ScreenUncheckedCreateWithoutSeatsInput>
  }

  export type SeatReservationCreateWithoutSeatInput = {
    id?: string
    status?: string
    heldBy?: string | null
    heldExpiresAt?: Date | string | null
    bookingId?: string | null
    createdAt?: Date | string
    showtime: ShowtimeCreateNestedOneWithoutReservationsInput
  }

  export type SeatReservationUncheckedCreateWithoutSeatInput = {
    id?: string
    showtimeId: string
    status?: string
    heldBy?: string | null
    heldExpiresAt?: Date | string | null
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type SeatReservationCreateOrConnectWithoutSeatInput = {
    where: SeatReservationWhereUniqueInput
    create: XOR<SeatReservationCreateWithoutSeatInput, SeatReservationUncheckedCreateWithoutSeatInput>
  }

  export type SeatReservationCreateManySeatInputEnvelope = {
    data: SeatReservationCreateManySeatInput | SeatReservationCreateManySeatInput[]
    skipDuplicates?: boolean
  }

  export type ScreenUpsertWithoutSeatsInput = {
    update: XOR<ScreenUpdateWithoutSeatsInput, ScreenUncheckedUpdateWithoutSeatsInput>
    create: XOR<ScreenCreateWithoutSeatsInput, ScreenUncheckedCreateWithoutSeatsInput>
    where?: ScreenWhereInput
  }

  export type ScreenUpdateToOneWithWhereWithoutSeatsInput = {
    where?: ScreenWhereInput
    data: XOR<ScreenUpdateWithoutSeatsInput, ScreenUncheckedUpdateWithoutSeatsInput>
  }

  export type ScreenUpdateWithoutSeatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
    theatre?: TheatreUpdateOneWithoutScreensNestedInput
    showtimes?: ShowtimeUpdateManyWithoutScreenNestedInput
  }

  export type ScreenUncheckedUpdateWithoutSeatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    theatreId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
    showtimes?: ShowtimeUncheckedUpdateManyWithoutScreenNestedInput
  }

  export type SeatReservationUpsertWithWhereUniqueWithoutSeatInput = {
    where: SeatReservationWhereUniqueInput
    update: XOR<SeatReservationUpdateWithoutSeatInput, SeatReservationUncheckedUpdateWithoutSeatInput>
    create: XOR<SeatReservationCreateWithoutSeatInput, SeatReservationUncheckedCreateWithoutSeatInput>
  }

  export type SeatReservationUpdateWithWhereUniqueWithoutSeatInput = {
    where: SeatReservationWhereUniqueInput
    data: XOR<SeatReservationUpdateWithoutSeatInput, SeatReservationUncheckedUpdateWithoutSeatInput>
  }

  export type SeatReservationUpdateManyWithWhereWithoutSeatInput = {
    where: SeatReservationScalarWhereInput
    data: XOR<SeatReservationUpdateManyMutationInput, SeatReservationUncheckedUpdateManyWithoutSeatInput>
  }

  export type SeatReservationScalarWhereInput = {
    AND?: SeatReservationScalarWhereInput | SeatReservationScalarWhereInput[]
    OR?: SeatReservationScalarWhereInput[]
    NOT?: SeatReservationScalarWhereInput | SeatReservationScalarWhereInput[]
    id?: StringFilter<"SeatReservation"> | string
    showtimeId?: StringFilter<"SeatReservation"> | string
    seatId?: StringFilter<"SeatReservation"> | string
    status?: StringFilter<"SeatReservation"> | string
    heldBy?: StringNullableFilter<"SeatReservation"> | string | null
    heldExpiresAt?: DateTimeNullableFilter<"SeatReservation"> | Date | string | null
    bookingId?: StringNullableFilter<"SeatReservation"> | string | null
    createdAt?: DateTimeFilter<"SeatReservation"> | Date | string
  }

  export type TheatreCreateWithoutShowtimesInput = {
    id: string
    name: string
    city: string
    address: string
    facilities?: TheatreCreatefacilitiesInput | string[]
    distance?: string
    timezone?: string
    screens?: ScreenCreateNestedManyWithoutTheatreInput
  }

  export type TheatreUncheckedCreateWithoutShowtimesInput = {
    id: string
    name: string
    city: string
    address: string
    facilities?: TheatreCreatefacilitiesInput | string[]
    distance?: string
    timezone?: string
    screens?: ScreenUncheckedCreateNestedManyWithoutTheatreInput
  }

  export type TheatreCreateOrConnectWithoutShowtimesInput = {
    where: TheatreWhereUniqueInput
    create: XOR<TheatreCreateWithoutShowtimesInput, TheatreUncheckedCreateWithoutShowtimesInput>
  }

  export type ScreenCreateWithoutShowtimesInput = {
    id: string
    name: string
    screenType?: string
    theatre?: TheatreCreateNestedOneWithoutScreensInput
    seats?: SeatCreateNestedManyWithoutScreenInput
  }

  export type ScreenUncheckedCreateWithoutShowtimesInput = {
    id: string
    theatreId?: string | null
    name: string
    screenType?: string
    seats?: SeatUncheckedCreateNestedManyWithoutScreenInput
  }

  export type ScreenCreateOrConnectWithoutShowtimesInput = {
    where: ScreenWhereUniqueInput
    create: XOR<ScreenCreateWithoutShowtimesInput, ScreenUncheckedCreateWithoutShowtimesInput>
  }

  export type MovieCreateWithoutShowtimesInput = {
    id: string
    title: string
    tagline?: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage?: string
    durationMinutes: number
    rating?: Decimal | DecimalJsLike | number | string
    votesCount?: string
    ageRating?: string
    releaseDate?: string
    status?: string
    director?: string
    formats?: MovieCreateformatsInput | string[]
    featured?: boolean
    createdAt?: Date | string
    genre?: MovieCreategenreInput | string[]
    languages?: MovieCreatelanguagesInput | string[]
    reviews?: ReviewCreateNestedManyWithoutMovieInput
    cast?: MovieCastCreateNestedManyWithoutMovieInput
  }

  export type MovieUncheckedCreateWithoutShowtimesInput = {
    id: string
    title: string
    tagline?: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage?: string
    durationMinutes: number
    rating?: Decimal | DecimalJsLike | number | string
    votesCount?: string
    ageRating?: string
    releaseDate?: string
    status?: string
    director?: string
    formats?: MovieCreateformatsInput | string[]
    featured?: boolean
    createdAt?: Date | string
    genre?: MovieCreategenreInput | string[]
    languages?: MovieCreatelanguagesInput | string[]
    reviews?: ReviewUncheckedCreateNestedManyWithoutMovieInput
    cast?: MovieCastUncheckedCreateNestedManyWithoutMovieInput
  }

  export type MovieCreateOrConnectWithoutShowtimesInput = {
    where: MovieWhereUniqueInput
    create: XOR<MovieCreateWithoutShowtimesInput, MovieUncheckedCreateWithoutShowtimesInput>
  }

  export type SeatReservationCreateWithoutShowtimeInput = {
    id?: string
    status?: string
    heldBy?: string | null
    heldExpiresAt?: Date | string | null
    bookingId?: string | null
    createdAt?: Date | string
    seat: SeatCreateNestedOneWithoutReservationsInput
  }

  export type SeatReservationUncheckedCreateWithoutShowtimeInput = {
    id?: string
    seatId: string
    status?: string
    heldBy?: string | null
    heldExpiresAt?: Date | string | null
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type SeatReservationCreateOrConnectWithoutShowtimeInput = {
    where: SeatReservationWhereUniqueInput
    create: XOR<SeatReservationCreateWithoutShowtimeInput, SeatReservationUncheckedCreateWithoutShowtimeInput>
  }

  export type SeatReservationCreateManyShowtimeInputEnvelope = {
    data: SeatReservationCreateManyShowtimeInput | SeatReservationCreateManyShowtimeInput[]
    skipDuplicates?: boolean
  }

  export type BookingCreateWithoutShowtimeInput = {
    id?: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    user?: UserCreateNestedOneWithoutBookingsInput
    payment?: PaymentCreateNestedOneWithoutBookingInput
    seats?: BookingSeatCreateNestedManyWithoutBookingInput
    addons?: BookingAddonCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutShowtimeInput = {
    id?: string
    userId?: string | null
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    payment?: PaymentUncheckedCreateNestedOneWithoutBookingInput
    seats?: BookingSeatUncheckedCreateNestedManyWithoutBookingInput
    addons?: BookingAddonUncheckedCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutShowtimeInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutShowtimeInput, BookingUncheckedCreateWithoutShowtimeInput>
  }

  export type BookingCreateManyShowtimeInputEnvelope = {
    data: BookingCreateManyShowtimeInput | BookingCreateManyShowtimeInput[]
    skipDuplicates?: boolean
  }

  export type TheatreUpsertWithoutShowtimesInput = {
    update: XOR<TheatreUpdateWithoutShowtimesInput, TheatreUncheckedUpdateWithoutShowtimesInput>
    create: XOR<TheatreCreateWithoutShowtimesInput, TheatreUncheckedCreateWithoutShowtimesInput>
    where?: TheatreWhereInput
  }

  export type TheatreUpdateToOneWithWhereWithoutShowtimesInput = {
    where?: TheatreWhereInput
    data: XOR<TheatreUpdateWithoutShowtimesInput, TheatreUncheckedUpdateWithoutShowtimesInput>
  }

  export type TheatreUpdateWithoutShowtimesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    facilities?: TheatreUpdatefacilitiesInput | string[]
    distance?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    screens?: ScreenUpdateManyWithoutTheatreNestedInput
  }

  export type TheatreUncheckedUpdateWithoutShowtimesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    facilities?: TheatreUpdatefacilitiesInput | string[]
    distance?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    screens?: ScreenUncheckedUpdateManyWithoutTheatreNestedInput
  }

  export type ScreenUpsertWithoutShowtimesInput = {
    update: XOR<ScreenUpdateWithoutShowtimesInput, ScreenUncheckedUpdateWithoutShowtimesInput>
    create: XOR<ScreenCreateWithoutShowtimesInput, ScreenUncheckedCreateWithoutShowtimesInput>
    where?: ScreenWhereInput
  }

  export type ScreenUpdateToOneWithWhereWithoutShowtimesInput = {
    where?: ScreenWhereInput
    data: XOR<ScreenUpdateWithoutShowtimesInput, ScreenUncheckedUpdateWithoutShowtimesInput>
  }

  export type ScreenUpdateWithoutShowtimesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
    theatre?: TheatreUpdateOneWithoutScreensNestedInput
    seats?: SeatUpdateManyWithoutScreenNestedInput
  }

  export type ScreenUncheckedUpdateWithoutShowtimesInput = {
    id?: StringFieldUpdateOperationsInput | string
    theatreId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
    seats?: SeatUncheckedUpdateManyWithoutScreenNestedInput
  }

  export type MovieUpsertWithoutShowtimesInput = {
    update: XOR<MovieUpdateWithoutShowtimesInput, MovieUncheckedUpdateWithoutShowtimesInput>
    create: XOR<MovieCreateWithoutShowtimesInput, MovieUncheckedCreateWithoutShowtimesInput>
    where?: MovieWhereInput
  }

  export type MovieUpdateToOneWithWhereWithoutShowtimesInput = {
    where?: MovieWhereInput
    data: XOR<MovieUpdateWithoutShowtimesInput, MovieUncheckedUpdateWithoutShowtimesInput>
  }

  export type MovieUpdateWithoutShowtimesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
    reviews?: ReviewUpdateManyWithoutMovieNestedInput
    cast?: MovieCastUpdateManyWithoutMovieNestedInput
  }

  export type MovieUncheckedUpdateWithoutShowtimesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
    reviews?: ReviewUncheckedUpdateManyWithoutMovieNestedInput
    cast?: MovieCastUncheckedUpdateManyWithoutMovieNestedInput
  }

  export type SeatReservationUpsertWithWhereUniqueWithoutShowtimeInput = {
    where: SeatReservationWhereUniqueInput
    update: XOR<SeatReservationUpdateWithoutShowtimeInput, SeatReservationUncheckedUpdateWithoutShowtimeInput>
    create: XOR<SeatReservationCreateWithoutShowtimeInput, SeatReservationUncheckedCreateWithoutShowtimeInput>
  }

  export type SeatReservationUpdateWithWhereUniqueWithoutShowtimeInput = {
    where: SeatReservationWhereUniqueInput
    data: XOR<SeatReservationUpdateWithoutShowtimeInput, SeatReservationUncheckedUpdateWithoutShowtimeInput>
  }

  export type SeatReservationUpdateManyWithWhereWithoutShowtimeInput = {
    where: SeatReservationScalarWhereInput
    data: XOR<SeatReservationUpdateManyMutationInput, SeatReservationUncheckedUpdateManyWithoutShowtimeInput>
  }

  export type BookingUpsertWithWhereUniqueWithoutShowtimeInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutShowtimeInput, BookingUncheckedUpdateWithoutShowtimeInput>
    create: XOR<BookingCreateWithoutShowtimeInput, BookingUncheckedCreateWithoutShowtimeInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutShowtimeInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutShowtimeInput, BookingUncheckedUpdateWithoutShowtimeInput>
  }

  export type BookingUpdateManyWithWhereWithoutShowtimeInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutShowtimeInput>
  }

  export type ShowtimeCreateWithoutReservationsInput = {
    id: string
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    cinema?: TheatreCreateNestedOneWithoutShowtimesInput
    screen?: ScreenCreateNestedOneWithoutShowtimesInput
    movie?: MovieCreateNestedOneWithoutShowtimesInput
    bookings?: BookingCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeUncheckedCreateWithoutReservationsInput = {
    id: string
    cinemaId?: string | null
    screenId?: string | null
    movieId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeCreateOrConnectWithoutReservationsInput = {
    where: ShowtimeWhereUniqueInput
    create: XOR<ShowtimeCreateWithoutReservationsInput, ShowtimeUncheckedCreateWithoutReservationsInput>
  }

  export type SeatCreateWithoutReservationsInput = {
    id: string
    row: string
    number: number
    seatNumber?: string | null
    tier?: string
    basePrice: Decimal | DecimalJsLike | number | string
    screen?: ScreenCreateNestedOneWithoutSeatsInput
  }

  export type SeatUncheckedCreateWithoutReservationsInput = {
    id: string
    screenId?: string | null
    row: string
    number: number
    seatNumber?: string | null
    tier?: string
    basePrice: Decimal | DecimalJsLike | number | string
  }

  export type SeatCreateOrConnectWithoutReservationsInput = {
    where: SeatWhereUniqueInput
    create: XOR<SeatCreateWithoutReservationsInput, SeatUncheckedCreateWithoutReservationsInput>
  }

  export type ShowtimeUpsertWithoutReservationsInput = {
    update: XOR<ShowtimeUpdateWithoutReservationsInput, ShowtimeUncheckedUpdateWithoutReservationsInput>
    create: XOR<ShowtimeCreateWithoutReservationsInput, ShowtimeUncheckedCreateWithoutReservationsInput>
    where?: ShowtimeWhereInput
  }

  export type ShowtimeUpdateToOneWithWhereWithoutReservationsInput = {
    where?: ShowtimeWhereInput
    data: XOR<ShowtimeUpdateWithoutReservationsInput, ShowtimeUncheckedUpdateWithoutReservationsInput>
  }

  export type ShowtimeUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    cinema?: TheatreUpdateOneWithoutShowtimesNestedInput
    screen?: ScreenUpdateOneWithoutShowtimesNestedInput
    movie?: MovieUpdateOneWithoutShowtimesNestedInput
    bookings?: BookingUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeUncheckedUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cinemaId?: NullableStringFieldUpdateOperationsInput | string | null
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    movieId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutShowtimeNestedInput
  }

  export type SeatUpsertWithoutReservationsInput = {
    update: XOR<SeatUpdateWithoutReservationsInput, SeatUncheckedUpdateWithoutReservationsInput>
    create: XOR<SeatCreateWithoutReservationsInput, SeatUncheckedCreateWithoutReservationsInput>
    where?: SeatWhereInput
  }

  export type SeatUpdateToOneWithWhereWithoutReservationsInput = {
    where?: SeatWhereInput
    data: XOR<SeatUpdateWithoutReservationsInput, SeatUncheckedUpdateWithoutReservationsInput>
  }

  export type SeatUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    seatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: StringFieldUpdateOperationsInput | string
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    screen?: ScreenUpdateOneWithoutSeatsNestedInput
  }

  export type SeatUncheckedUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    row?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    seatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: StringFieldUpdateOperationsInput | string
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type UserCreateWithoutBookingsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutBookingsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutBookingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
  }

  export type ShowtimeCreateWithoutBookingsInput = {
    id: string
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    cinema?: TheatreCreateNestedOneWithoutShowtimesInput
    screen?: ScreenCreateNestedOneWithoutShowtimesInput
    movie?: MovieCreateNestedOneWithoutShowtimesInput
    reservations?: SeatReservationCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeUncheckedCreateWithoutBookingsInput = {
    id: string
    cinemaId?: string | null
    screenId?: string | null
    movieId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
    reservations?: SeatReservationUncheckedCreateNestedManyWithoutShowtimeInput
  }

  export type ShowtimeCreateOrConnectWithoutBookingsInput = {
    where: ShowtimeWhereUniqueInput
    create: XOR<ShowtimeCreateWithoutBookingsInput, ShowtimeUncheckedCreateWithoutBookingsInput>
  }

  export type PaymentCreateWithoutBookingInput = {
    id?: string
    provider?: string
    orderId: string
    paymentId?: string | null
    signature?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string
    refundId?: string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
  }

  export type PaymentUncheckedCreateWithoutBookingInput = {
    id?: string
    provider?: string
    orderId: string
    paymentId?: string | null
    signature?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string
    refundId?: string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutBookingInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput>
  }

  export type BookingSeatCreateWithoutBookingInput = {
    showtimeId: string
    seatId: string
    seatRow: string
    seatNumber: number
    tier: string
    price: Decimal | DecimalJsLike | number | string
  }

  export type BookingSeatUncheckedCreateWithoutBookingInput = {
    id?: number
    showtimeId: string
    seatId: string
    seatRow: string
    seatNumber: number
    tier: string
    price: Decimal | DecimalJsLike | number | string
  }

  export type BookingSeatCreateOrConnectWithoutBookingInput = {
    where: BookingSeatWhereUniqueInput
    create: XOR<BookingSeatCreateWithoutBookingInput, BookingSeatUncheckedCreateWithoutBookingInput>
  }

  export type BookingSeatCreateManyBookingInputEnvelope = {
    data: BookingSeatCreateManyBookingInput | BookingSeatCreateManyBookingInput[]
    skipDuplicates?: boolean
  }

  export type BookingAddonCreateWithoutBookingInput = {
    addonId: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    quantity: number
  }

  export type BookingAddonUncheckedCreateWithoutBookingInput = {
    id?: number
    addonId: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    quantity: number
  }

  export type BookingAddonCreateOrConnectWithoutBookingInput = {
    where: BookingAddonWhereUniqueInput
    create: XOR<BookingAddonCreateWithoutBookingInput, BookingAddonUncheckedCreateWithoutBookingInput>
  }

  export type BookingAddonCreateManyBookingInputEnvelope = {
    data: BookingAddonCreateManyBookingInput | BookingAddonCreateManyBookingInput[]
    skipDuplicates?: boolean
  }

  export type CancellationAuditLogCreateWithoutBookingInput = {
    id?: string
    bookingRef: string
    action: string
    actorEmail: string
    previousStatus: string
    newStatus: string
    refundStatus: string
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    failureReason?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type CancellationAuditLogUncheckedCreateWithoutBookingInput = {
    id?: string
    bookingRef: string
    action: string
    actorEmail: string
    previousStatus: string
    newStatus: string
    refundStatus: string
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    failureReason?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type CancellationAuditLogCreateOrConnectWithoutBookingInput = {
    where: CancellationAuditLogWhereUniqueInput
    create: XOR<CancellationAuditLogCreateWithoutBookingInput, CancellationAuditLogUncheckedCreateWithoutBookingInput>
  }

  export type CancellationAuditLogCreateManyBookingInputEnvelope = {
    data: CancellationAuditLogCreateManyBookingInput | CancellationAuditLogCreateManyBookingInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutBookingsInput = {
    update: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBookingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>
  }

  export type UserUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShowtimeUpsertWithoutBookingsInput = {
    update: XOR<ShowtimeUpdateWithoutBookingsInput, ShowtimeUncheckedUpdateWithoutBookingsInput>
    create: XOR<ShowtimeCreateWithoutBookingsInput, ShowtimeUncheckedCreateWithoutBookingsInput>
    where?: ShowtimeWhereInput
  }

  export type ShowtimeUpdateToOneWithWhereWithoutBookingsInput = {
    where?: ShowtimeWhereInput
    data: XOR<ShowtimeUpdateWithoutBookingsInput, ShowtimeUncheckedUpdateWithoutBookingsInput>
  }

  export type ShowtimeUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    cinema?: TheatreUpdateOneWithoutShowtimesNestedInput
    screen?: ScreenUpdateOneWithoutShowtimesNestedInput
    movie?: MovieUpdateOneWithoutShowtimesNestedInput
    reservations?: SeatReservationUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cinemaId?: NullableStringFieldUpdateOperationsInput | string | null
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    movieId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    reservations?: SeatReservationUncheckedUpdateManyWithoutShowtimeNestedInput
  }

  export type PaymentUpsertWithoutBookingInput = {
    update: XOR<PaymentUpdateWithoutBookingInput, PaymentUncheckedUpdateWithoutBookingInput>
    create: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput>
    where?: PaymentWhereInput
  }

  export type PaymentUpdateToOneWithWhereWithoutBookingInput = {
    where?: PaymentWhereInput
    data: XOR<PaymentUpdateWithoutBookingInput, PaymentUncheckedUpdateWithoutBookingInput>
  }

  export type PaymentUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    signature?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingSeatUpsertWithWhereUniqueWithoutBookingInput = {
    where: BookingSeatWhereUniqueInput
    update: XOR<BookingSeatUpdateWithoutBookingInput, BookingSeatUncheckedUpdateWithoutBookingInput>
    create: XOR<BookingSeatCreateWithoutBookingInput, BookingSeatUncheckedCreateWithoutBookingInput>
  }

  export type BookingSeatUpdateWithWhereUniqueWithoutBookingInput = {
    where: BookingSeatWhereUniqueInput
    data: XOR<BookingSeatUpdateWithoutBookingInput, BookingSeatUncheckedUpdateWithoutBookingInput>
  }

  export type BookingSeatUpdateManyWithWhereWithoutBookingInput = {
    where: BookingSeatScalarWhereInput
    data: XOR<BookingSeatUpdateManyMutationInput, BookingSeatUncheckedUpdateManyWithoutBookingInput>
  }

  export type BookingSeatScalarWhereInput = {
    AND?: BookingSeatScalarWhereInput | BookingSeatScalarWhereInput[]
    OR?: BookingSeatScalarWhereInput[]
    NOT?: BookingSeatScalarWhereInput | BookingSeatScalarWhereInput[]
    id?: IntFilter<"BookingSeat"> | number
    bookingId?: StringFilter<"BookingSeat"> | string
    showtimeId?: StringFilter<"BookingSeat"> | string
    seatId?: StringFilter<"BookingSeat"> | string
    seatRow?: StringFilter<"BookingSeat"> | string
    seatNumber?: IntFilter<"BookingSeat"> | number
    tier?: StringFilter<"BookingSeat"> | string
    price?: DecimalFilter<"BookingSeat"> | Decimal | DecimalJsLike | number | string
  }

  export type BookingAddonUpsertWithWhereUniqueWithoutBookingInput = {
    where: BookingAddonWhereUniqueInput
    update: XOR<BookingAddonUpdateWithoutBookingInput, BookingAddonUncheckedUpdateWithoutBookingInput>
    create: XOR<BookingAddonCreateWithoutBookingInput, BookingAddonUncheckedCreateWithoutBookingInput>
  }

  export type BookingAddonUpdateWithWhereUniqueWithoutBookingInput = {
    where: BookingAddonWhereUniqueInput
    data: XOR<BookingAddonUpdateWithoutBookingInput, BookingAddonUncheckedUpdateWithoutBookingInput>
  }

  export type BookingAddonUpdateManyWithWhereWithoutBookingInput = {
    where: BookingAddonScalarWhereInput
    data: XOR<BookingAddonUpdateManyMutationInput, BookingAddonUncheckedUpdateManyWithoutBookingInput>
  }

  export type BookingAddonScalarWhereInput = {
    AND?: BookingAddonScalarWhereInput | BookingAddonScalarWhereInput[]
    OR?: BookingAddonScalarWhereInput[]
    NOT?: BookingAddonScalarWhereInput | BookingAddonScalarWhereInput[]
    id?: IntFilter<"BookingAddon"> | number
    bookingId?: StringFilter<"BookingAddon"> | string
    addonId?: StringFilter<"BookingAddon"> | string
    name?: StringFilter<"BookingAddon"> | string
    price?: DecimalFilter<"BookingAddon"> | Decimal | DecimalJsLike | number | string
    quantity?: IntFilter<"BookingAddon"> | number
  }

  export type CancellationAuditLogUpsertWithWhereUniqueWithoutBookingInput = {
    where: CancellationAuditLogWhereUniqueInput
    update: XOR<CancellationAuditLogUpdateWithoutBookingInput, CancellationAuditLogUncheckedUpdateWithoutBookingInput>
    create: XOR<CancellationAuditLogCreateWithoutBookingInput, CancellationAuditLogUncheckedCreateWithoutBookingInput>
  }

  export type CancellationAuditLogUpdateWithWhereUniqueWithoutBookingInput = {
    where: CancellationAuditLogWhereUniqueInput
    data: XOR<CancellationAuditLogUpdateWithoutBookingInput, CancellationAuditLogUncheckedUpdateWithoutBookingInput>
  }

  export type CancellationAuditLogUpdateManyWithWhereWithoutBookingInput = {
    where: CancellationAuditLogScalarWhereInput
    data: XOR<CancellationAuditLogUpdateManyMutationInput, CancellationAuditLogUncheckedUpdateManyWithoutBookingInput>
  }

  export type CancellationAuditLogScalarWhereInput = {
    AND?: CancellationAuditLogScalarWhereInput | CancellationAuditLogScalarWhereInput[]
    OR?: CancellationAuditLogScalarWhereInput[]
    NOT?: CancellationAuditLogScalarWhereInput | CancellationAuditLogScalarWhereInput[]
    id?: StringFilter<"CancellationAuditLog"> | string
    bookingId?: StringNullableFilter<"CancellationAuditLog"> | string | null
    bookingRef?: StringFilter<"CancellationAuditLog"> | string
    action?: StringFilter<"CancellationAuditLog"> | string
    actorEmail?: StringFilter<"CancellationAuditLog"> | string
    previousStatus?: StringFilter<"CancellationAuditLog"> | string
    newStatus?: StringFilter<"CancellationAuditLog"> | string
    refundStatus?: StringFilter<"CancellationAuditLog"> | string
    refundAmount?: DecimalFilter<"CancellationAuditLog"> | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFilter<"CancellationAuditLog"> | Decimal | DecimalJsLike | number | string
    refundId?: StringNullableFilter<"CancellationAuditLog"> | string | null
    failureReason?: StringNullableFilter<"CancellationAuditLog"> | string | null
    notes?: StringNullableFilter<"CancellationAuditLog"> | string | null
    createdAt?: DateTimeFilter<"CancellationAuditLog"> | Date | string
  }

  export type BookingCreateWithoutSeatsInput = {
    id?: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    user?: UserCreateNestedOneWithoutBookingsInput
    showtime: ShowtimeCreateNestedOneWithoutBookingsInput
    payment?: PaymentCreateNestedOneWithoutBookingInput
    addons?: BookingAddonCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutSeatsInput = {
    id?: string
    userId?: string | null
    showtimeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    payment?: PaymentUncheckedCreateNestedOneWithoutBookingInput
    addons?: BookingAddonUncheckedCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutSeatsInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutSeatsInput, BookingUncheckedCreateWithoutSeatsInput>
  }

  export type BookingUpsertWithoutSeatsInput = {
    update: XOR<BookingUpdateWithoutSeatsInput, BookingUncheckedUpdateWithoutSeatsInput>
    create: XOR<BookingCreateWithoutSeatsInput, BookingUncheckedCreateWithoutSeatsInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutSeatsInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutSeatsInput, BookingUncheckedUpdateWithoutSeatsInput>
  }

  export type BookingUpdateWithoutSeatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutBookingsNestedInput
    showtime?: ShowtimeUpdateOneRequiredWithoutBookingsNestedInput
    payment?: PaymentUpdateOneWithoutBookingNestedInput
    addons?: BookingAddonUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutSeatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    showtimeId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    payment?: PaymentUncheckedUpdateOneWithoutBookingNestedInput
    addons?: BookingAddonUncheckedUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingCreateWithoutAddonsInput = {
    id?: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    user?: UserCreateNestedOneWithoutBookingsInput
    showtime: ShowtimeCreateNestedOneWithoutBookingsInput
    payment?: PaymentCreateNestedOneWithoutBookingInput
    seats?: BookingSeatCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutAddonsInput = {
    id?: string
    userId?: string | null
    showtimeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    payment?: PaymentUncheckedCreateNestedOneWithoutBookingInput
    seats?: BookingSeatUncheckedCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutAddonsInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutAddonsInput, BookingUncheckedCreateWithoutAddonsInput>
  }

  export type BookingUpsertWithoutAddonsInput = {
    update: XOR<BookingUpdateWithoutAddonsInput, BookingUncheckedUpdateWithoutAddonsInput>
    create: XOR<BookingCreateWithoutAddonsInput, BookingUncheckedCreateWithoutAddonsInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutAddonsInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutAddonsInput, BookingUncheckedUpdateWithoutAddonsInput>
  }

  export type BookingUpdateWithoutAddonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutBookingsNestedInput
    showtime?: ShowtimeUpdateOneRequiredWithoutBookingsNestedInput
    payment?: PaymentUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutAddonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    showtimeId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    payment?: PaymentUncheckedUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUncheckedUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingCreateWithoutPaymentInput = {
    id?: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    user?: UserCreateNestedOneWithoutBookingsInput
    showtime: ShowtimeCreateNestedOneWithoutBookingsInput
    seats?: BookingSeatCreateNestedManyWithoutBookingInput
    addons?: BookingAddonCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutPaymentInput = {
    id?: string
    userId?: string | null
    showtimeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    seats?: BookingSeatUncheckedCreateNestedManyWithoutBookingInput
    addons?: BookingAddonUncheckedCreateNestedManyWithoutBookingInput
    auditLogs?: CancellationAuditLogUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutPaymentInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutPaymentInput, BookingUncheckedCreateWithoutPaymentInput>
  }

  export type BookingUpsertWithoutPaymentInput = {
    update: XOR<BookingUpdateWithoutPaymentInput, BookingUncheckedUpdateWithoutPaymentInput>
    create: XOR<BookingCreateWithoutPaymentInput, BookingUncheckedCreateWithoutPaymentInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutPaymentInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutPaymentInput, BookingUncheckedUpdateWithoutPaymentInput>
  }

  export type BookingUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutBookingsNestedInput
    showtime?: ShowtimeUpdateOneRequiredWithoutBookingsNestedInput
    seats?: BookingSeatUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    showtimeId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    seats?: BookingSeatUncheckedUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUncheckedUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type MovieCreateWithoutReviewsInput = {
    id: string
    title: string
    tagline?: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage?: string
    durationMinutes: number
    rating?: Decimal | DecimalJsLike | number | string
    votesCount?: string
    ageRating?: string
    releaseDate?: string
    status?: string
    director?: string
    formats?: MovieCreateformatsInput | string[]
    featured?: boolean
    createdAt?: Date | string
    genre?: MovieCreategenreInput | string[]
    languages?: MovieCreatelanguagesInput | string[]
    showtimes?: ShowtimeCreateNestedManyWithoutMovieInput
    cast?: MovieCastCreateNestedManyWithoutMovieInput
  }

  export type MovieUncheckedCreateWithoutReviewsInput = {
    id: string
    title: string
    tagline?: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage?: string
    durationMinutes: number
    rating?: Decimal | DecimalJsLike | number | string
    votesCount?: string
    ageRating?: string
    releaseDate?: string
    status?: string
    director?: string
    formats?: MovieCreateformatsInput | string[]
    featured?: boolean
    createdAt?: Date | string
    genre?: MovieCreategenreInput | string[]
    languages?: MovieCreatelanguagesInput | string[]
    showtimes?: ShowtimeUncheckedCreateNestedManyWithoutMovieInput
    cast?: MovieCastUncheckedCreateNestedManyWithoutMovieInput
  }

  export type MovieCreateOrConnectWithoutReviewsInput = {
    where: MovieWhereUniqueInput
    create: XOR<MovieCreateWithoutReviewsInput, MovieUncheckedCreateWithoutReviewsInput>
  }

  export type MovieUpsertWithoutReviewsInput = {
    update: XOR<MovieUpdateWithoutReviewsInput, MovieUncheckedUpdateWithoutReviewsInput>
    create: XOR<MovieCreateWithoutReviewsInput, MovieUncheckedCreateWithoutReviewsInput>
    where?: MovieWhereInput
  }

  export type MovieUpdateToOneWithWhereWithoutReviewsInput = {
    where?: MovieWhereInput
    data: XOR<MovieUpdateWithoutReviewsInput, MovieUncheckedUpdateWithoutReviewsInput>
  }

  export type MovieUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
    showtimes?: ShowtimeUpdateManyWithoutMovieNestedInput
    cast?: MovieCastUpdateManyWithoutMovieNestedInput
  }

  export type MovieUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
    showtimes?: ShowtimeUncheckedUpdateManyWithoutMovieNestedInput
    cast?: MovieCastUncheckedUpdateManyWithoutMovieNestedInput
  }

  export type MovieCreateWithoutCastInput = {
    id: string
    title: string
    tagline?: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage?: string
    durationMinutes: number
    rating?: Decimal | DecimalJsLike | number | string
    votesCount?: string
    ageRating?: string
    releaseDate?: string
    status?: string
    director?: string
    formats?: MovieCreateformatsInput | string[]
    featured?: boolean
    createdAt?: Date | string
    genre?: MovieCreategenreInput | string[]
    languages?: MovieCreatelanguagesInput | string[]
    showtimes?: ShowtimeCreateNestedManyWithoutMovieInput
    reviews?: ReviewCreateNestedManyWithoutMovieInput
  }

  export type MovieUncheckedCreateWithoutCastInput = {
    id: string
    title: string
    tagline?: string | null
    synopsis: string
    posterUrl: string
    backdropUrl: string
    originalLanguage?: string
    durationMinutes: number
    rating?: Decimal | DecimalJsLike | number | string
    votesCount?: string
    ageRating?: string
    releaseDate?: string
    status?: string
    director?: string
    formats?: MovieCreateformatsInput | string[]
    featured?: boolean
    createdAt?: Date | string
    genre?: MovieCreategenreInput | string[]
    languages?: MovieCreatelanguagesInput | string[]
    showtimes?: ShowtimeUncheckedCreateNestedManyWithoutMovieInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutMovieInput
  }

  export type MovieCreateOrConnectWithoutCastInput = {
    where: MovieWhereUniqueInput
    create: XOR<MovieCreateWithoutCastInput, MovieUncheckedCreateWithoutCastInput>
  }

  export type MovieUpsertWithoutCastInput = {
    update: XOR<MovieUpdateWithoutCastInput, MovieUncheckedUpdateWithoutCastInput>
    create: XOR<MovieCreateWithoutCastInput, MovieUncheckedCreateWithoutCastInput>
    where?: MovieWhereInput
  }

  export type MovieUpdateToOneWithWhereWithoutCastInput = {
    where?: MovieWhereInput
    data: XOR<MovieUpdateWithoutCastInput, MovieUncheckedUpdateWithoutCastInput>
  }

  export type MovieUpdateWithoutCastInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
    showtimes?: ShowtimeUpdateManyWithoutMovieNestedInput
    reviews?: ReviewUpdateManyWithoutMovieNestedInput
  }

  export type MovieUncheckedUpdateWithoutCastInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    tagline?: NullableStringFieldUpdateOperationsInput | string | null
    synopsis?: StringFieldUpdateOperationsInput | string
    posterUrl?: StringFieldUpdateOperationsInput | string
    backdropUrl?: StringFieldUpdateOperationsInput | string
    originalLanguage?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    votesCount?: StringFieldUpdateOperationsInput | string
    ageRating?: StringFieldUpdateOperationsInput | string
    releaseDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    director?: StringFieldUpdateOperationsInput | string
    formats?: MovieUpdateformatsInput | string[]
    featured?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    genre?: MovieUpdategenreInput | string[]
    languages?: MovieUpdatelanguagesInput | string[]
    showtimes?: ShowtimeUncheckedUpdateManyWithoutMovieNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutMovieNestedInput
  }

  export type BookingCreateWithoutAuditLogsInput = {
    id?: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    user?: UserCreateNestedOneWithoutBookingsInput
    showtime: ShowtimeCreateNestedOneWithoutBookingsInput
    payment?: PaymentCreateNestedOneWithoutBookingInput
    seats?: BookingSeatCreateNestedManyWithoutBookingInput
    addons?: BookingAddonCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    userId?: string | null
    showtimeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
    payment?: PaymentUncheckedCreateNestedOneWithoutBookingInput
    seats?: BookingSeatUncheckedCreateNestedManyWithoutBookingInput
    addons?: BookingAddonUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutAuditLogsInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutAuditLogsInput, BookingUncheckedCreateWithoutAuditLogsInput>
  }

  export type BookingUpsertWithoutAuditLogsInput = {
    update: XOR<BookingUpdateWithoutAuditLogsInput, BookingUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<BookingCreateWithoutAuditLogsInput, BookingUncheckedCreateWithoutAuditLogsInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutAuditLogsInput, BookingUncheckedUpdateWithoutAuditLogsInput>
  }

  export type BookingUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutBookingsNestedInput
    showtime?: ShowtimeUpdateOneRequiredWithoutBookingsNestedInput
    payment?: PaymentUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    showtimeId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    payment?: PaymentUncheckedUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUncheckedUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingCreateManyUserInput = {
    id?: string
    showtimeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
  }

  export type BookingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    showtime?: ShowtimeUpdateOneRequiredWithoutBookingsNestedInput
    payment?: PaymentUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    showtimeId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    payment?: PaymentUncheckedUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUncheckedUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUncheckedUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    showtimeId?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ShowtimeCreateManyMovieInput = {
    id: string
    cinemaId?: string | null
    screenId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
  }

  export type ReviewCreateManyMovieInput = {
    id?: string
    userName: string
    userEmail?: string | null
    rating: Decimal | DecimalJsLike | number | string
    comment: string
    createdAt?: Date | string
  }

  export type MovieCastCreateManyMovieInput = {
    id?: number
    name: string
    role: string
    avatar: string
  }

  export type ShowtimeUpdateWithoutMovieInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    cinema?: TheatreUpdateOneWithoutShowtimesNestedInput
    screen?: ScreenUpdateOneWithoutShowtimesNestedInput
    reservations?: SeatReservationUpdateManyWithoutShowtimeNestedInput
    bookings?: BookingUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeUncheckedUpdateWithoutMovieInput = {
    id?: StringFieldUpdateOperationsInput | string
    cinemaId?: NullableStringFieldUpdateOperationsInput | string | null
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    reservations?: SeatReservationUncheckedUpdateManyWithoutShowtimeNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeUncheckedUpdateManyWithoutMovieInput = {
    id?: StringFieldUpdateOperationsInput | string
    cinemaId?: NullableStringFieldUpdateOperationsInput | string | null
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReviewUpdateWithoutMovieInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateWithoutMovieInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyWithoutMovieInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovieCastUpdateWithoutMovieInput = {
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: StringFieldUpdateOperationsInput | string
  }

  export type MovieCastUncheckedUpdateWithoutMovieInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: StringFieldUpdateOperationsInput | string
  }

  export type MovieCastUncheckedUpdateManyWithoutMovieInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: StringFieldUpdateOperationsInput | string
  }

  export type ScreenCreateManyTheatreInput = {
    id: string
    name: string
    screenType?: string
  }

  export type ShowtimeCreateManyCinemaInput = {
    id: string
    screenId?: string | null
    movieId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
  }

  export type ScreenUpdateWithoutTheatreInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
    seats?: SeatUpdateManyWithoutScreenNestedInput
    showtimes?: ShowtimeUpdateManyWithoutScreenNestedInput
  }

  export type ScreenUncheckedUpdateWithoutTheatreInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
    seats?: SeatUncheckedUpdateManyWithoutScreenNestedInput
    showtimes?: ShowtimeUncheckedUpdateManyWithoutScreenNestedInput
  }

  export type ScreenUncheckedUpdateManyWithoutTheatreInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    screenType?: StringFieldUpdateOperationsInput | string
  }

  export type ShowtimeUpdateWithoutCinemaInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    screen?: ScreenUpdateOneWithoutShowtimesNestedInput
    movie?: MovieUpdateOneWithoutShowtimesNestedInput
    reservations?: SeatReservationUpdateManyWithoutShowtimeNestedInput
    bookings?: BookingUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeUncheckedUpdateWithoutCinemaInput = {
    id?: StringFieldUpdateOperationsInput | string
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    movieId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    reservations?: SeatReservationUncheckedUpdateManyWithoutShowtimeNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeUncheckedUpdateManyWithoutCinemaInput = {
    id?: StringFieldUpdateOperationsInput | string
    screenId?: NullableStringFieldUpdateOperationsInput | string | null
    movieId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SeatCreateManyScreenInput = {
    id: string
    row: string
    number: number
    seatNumber?: string | null
    tier?: string
    basePrice: Decimal | DecimalJsLike | number | string
  }

  export type ShowtimeCreateManyScreenInput = {
    id: string
    cinemaId?: string | null
    movieId?: string | null
    date: string
    time: string
    format: string
    hallName: string
    language?: string
    priceMultiplier?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    hall?: string | null
  }

  export type SeatUpdateWithoutScreenInput = {
    id?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    seatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: StringFieldUpdateOperationsInput | string
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reservations?: SeatReservationUpdateManyWithoutSeatNestedInput
  }

  export type SeatUncheckedUpdateWithoutScreenInput = {
    id?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    seatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: StringFieldUpdateOperationsInput | string
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reservations?: SeatReservationUncheckedUpdateManyWithoutSeatNestedInput
  }

  export type SeatUncheckedUpdateManyWithoutScreenInput = {
    id?: StringFieldUpdateOperationsInput | string
    row?: StringFieldUpdateOperationsInput | string
    number?: IntFieldUpdateOperationsInput | number
    seatNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: StringFieldUpdateOperationsInput | string
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ShowtimeUpdateWithoutScreenInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    cinema?: TheatreUpdateOneWithoutShowtimesNestedInput
    movie?: MovieUpdateOneWithoutShowtimesNestedInput
    reservations?: SeatReservationUpdateManyWithoutShowtimeNestedInput
    bookings?: BookingUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeUncheckedUpdateWithoutScreenInput = {
    id?: StringFieldUpdateOperationsInput | string
    cinemaId?: NullableStringFieldUpdateOperationsInput | string | null
    movieId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
    reservations?: SeatReservationUncheckedUpdateManyWithoutShowtimeNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutShowtimeNestedInput
  }

  export type ShowtimeUncheckedUpdateManyWithoutScreenInput = {
    id?: StringFieldUpdateOperationsInput | string
    cinemaId?: NullableStringFieldUpdateOperationsInput | string | null
    movieId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    format?: StringFieldUpdateOperationsInput | string
    hallName?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    priceMultiplier?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hall?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SeatReservationCreateManySeatInput = {
    id?: string
    showtimeId: string
    status?: string
    heldBy?: string | null
    heldExpiresAt?: Date | string | null
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type SeatReservationUpdateWithoutSeatInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    showtime?: ShowtimeUpdateOneRequiredWithoutReservationsNestedInput
  }

  export type SeatReservationUncheckedUpdateWithoutSeatInput = {
    id?: StringFieldUpdateOperationsInput | string
    showtimeId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeatReservationUncheckedUpdateManyWithoutSeatInput = {
    id?: StringFieldUpdateOperationsInput | string
    showtimeId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeatReservationCreateManyShowtimeInput = {
    id?: string
    seatId: string
    status?: string
    heldBy?: string | null
    heldExpiresAt?: Date | string | null
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type BookingCreateManyShowtimeInput = {
    id?: string
    userId?: string | null
    customerName: string
    customerEmail: string
    customerPhone: string
    subtotal: Decimal | DecimalJsLike | number | string
    convenienceFee: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    paymentMethod?: string
    status?: string
    refundStatus?: string
    bookedAt?: Date | string
    cancelledAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    bookingRef?: string | null
  }

  export type SeatReservationUpdateWithoutShowtimeInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seat?: SeatUpdateOneRequiredWithoutReservationsNestedInput
  }

  export type SeatReservationUncheckedUpdateWithoutShowtimeInput = {
    id?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeatReservationUncheckedUpdateManyWithoutShowtimeInput = {
    id?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    heldBy?: NullableStringFieldUpdateOperationsInput | string | null
    heldExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUpdateWithoutShowtimeInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutBookingsNestedInput
    payment?: PaymentUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutShowtimeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
    payment?: PaymentUncheckedUpdateOneWithoutBookingNestedInput
    seats?: BookingSeatUncheckedUpdateManyWithoutBookingNestedInput
    addons?: BookingAddonUncheckedUpdateManyWithoutBookingNestedInput
    auditLogs?: CancellationAuditLogUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateManyWithoutShowtimeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: StringFieldUpdateOperationsInput | string
    customerEmail?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    convenienceFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    bookingRef?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookingSeatCreateManyBookingInput = {
    id?: number
    showtimeId: string
    seatId: string
    seatRow: string
    seatNumber: number
    tier: string
    price: Decimal | DecimalJsLike | number | string
  }

  export type BookingAddonCreateManyBookingInput = {
    id?: number
    addonId: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    quantity: number
  }

  export type CancellationAuditLogCreateManyBookingInput = {
    id?: string
    bookingRef: string
    action: string
    actorEmail: string
    previousStatus: string
    newStatus: string
    refundStatus: string
    refundAmount?: Decimal | DecimalJsLike | number | string
    cancellationFee?: Decimal | DecimalJsLike | number | string
    refundId?: string | null
    failureReason?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type BookingSeatUpdateWithoutBookingInput = {
    showtimeId?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    seatRow?: StringFieldUpdateOperationsInput | string
    seatNumber?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type BookingSeatUncheckedUpdateWithoutBookingInput = {
    id?: IntFieldUpdateOperationsInput | number
    showtimeId?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    seatRow?: StringFieldUpdateOperationsInput | string
    seatNumber?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type BookingSeatUncheckedUpdateManyWithoutBookingInput = {
    id?: IntFieldUpdateOperationsInput | number
    showtimeId?: StringFieldUpdateOperationsInput | string
    seatId?: StringFieldUpdateOperationsInput | string
    seatRow?: StringFieldUpdateOperationsInput | string
    seatNumber?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type BookingAddonUpdateWithoutBookingInput = {
    addonId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type BookingAddonUncheckedUpdateWithoutBookingInput = {
    id?: IntFieldUpdateOperationsInput | number
    addonId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type BookingAddonUncheckedUpdateManyWithoutBookingInput = {
    id?: IntFieldUpdateOperationsInput | number
    addonId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type CancellationAuditLogUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingRef?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    previousStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CancellationAuditLogUncheckedUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingRef?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    previousStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CancellationAuditLogUncheckedUpdateManyWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingRef?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    previousStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    refundStatus?: StringFieldUpdateOperationsInput | string
    refundAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cancellationFee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    refundId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MovieCountOutputTypeDefaultArgs instead
     */
    export type MovieCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MovieCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TheatreCountOutputTypeDefaultArgs instead
     */
    export type TheatreCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TheatreCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ScreenCountOutputTypeDefaultArgs instead
     */
    export type ScreenCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ScreenCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SeatCountOutputTypeDefaultArgs instead
     */
    export type SeatCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SeatCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShowtimeCountOutputTypeDefaultArgs instead
     */
    export type ShowtimeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShowtimeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookingCountOutputTypeDefaultArgs instead
     */
    export type BookingCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookingCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MovieDefaultArgs instead
     */
    export type MovieArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MovieDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TheatreDefaultArgs instead
     */
    export type TheatreArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TheatreDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ScreenDefaultArgs instead
     */
    export type ScreenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ScreenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SeatDefaultArgs instead
     */
    export type SeatArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SeatDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShowtimeDefaultArgs instead
     */
    export type ShowtimeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShowtimeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SeatReservationDefaultArgs instead
     */
    export type SeatReservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SeatReservationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookingDefaultArgs instead
     */
    export type BookingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookingSeatDefaultArgs instead
     */
    export type BookingSeatArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookingSeatDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookingAddonDefaultArgs instead
     */
    export type BookingAddonArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookingAddonDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentDefaultArgs instead
     */
    export type PaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReviewDefaultArgs instead
     */
    export type ReviewArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReviewDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MovieCastDefaultArgs instead
     */
    export type MovieCastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MovieCastDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CancellationAuditLogDefaultArgs instead
     */
    export type CancellationAuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CancellationAuditLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}