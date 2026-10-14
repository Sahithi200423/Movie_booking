import { PrismaClient } from './generated/pgclient/index.js';

declare global {
  // Allow global `var` declarations in TypeScript
  var prismaGlobal: PrismaClient | undefined;
}

let dbUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
if (dbUrl && dbUrl.includes('pooler.supabase.com')) {
  // Supabase connection pooler requires port 6543 (transaction mode) with ?pgbouncer=true for Prisma client
  dbUrl = dbUrl.replace(':5432', ':6543');
  if (!dbUrl.includes('pgbouncer=true')) {
    dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
  }
}

export const prisma =
  globalThis.prismaGlobal ||
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
