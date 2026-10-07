import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Theatre } from '../../types';

export const FALLBACK_THEATRES: Theatre[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'CineBook IMAX Grand',
    slug: 'cinebook-imax-grand',
    chain: 'CineBook Flagship',
    city: 'Hyderabad',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana',
    amenities: ['IMAX with Laser', 'Dolby Atmos', 'Plush Recliners', 'Gourmet Lounge'],
    latitude: 17.4325,
    longitude: 78.4073,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'CineBook Pallasium Luxe',
    slug: 'cinebook-pallasium-luxe',
    chain: 'CineBook Luxe',
    city: 'Mumbai',
    address: 'Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra',
    amenities: ['Dolby Atmos', '4K RGB Laser', 'VIP Butler Service', 'Valet Parking'],
    latitude: 18.9953,
    longitude: 72.8258,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'CineBook Nexus Orion',
    slug: 'cinebook-nexus-orion',
    chain: 'CineBook Prime',
    city: 'Bengaluru',
    address: 'Dr. Rajkumar Road, Malleshwaram, Bengaluru, Karnataka',
    amenities: ['4DX Immersion', 'Dolby 7.1', 'Food Court Delivery'],
    latitude: 13.0112,
    longitude: 77.555,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export async function fetchTheatres(city?: string): Promise<Theatre[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('theatres').select('*').order('name');
      if (city) {
        query = query.eq('city', city);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Theatre[];
      }
    } catch (err) {
      console.warn('Supabase theatres fetch warning:', err);
    }
  }

  return city ? FALLBACK_THEATRES.filter((t) => t.city.toLowerCase() === city.toLowerCase()) : FALLBACK_THEATRES;
}
