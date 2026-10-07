// ====================================================================
// CineBook Movies Feature Service (Supabase Database + Fallback Cache)
// ====================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Movie, MovieStatus } from '../../types';

// Fallback initial dataset (mirrors Supabase seed migration)
export const FALLBACK_MOVIES: Movie[] = [
  {
    id: '10101010-1010-1010-1010-101010101010',
    title: 'Kalki 2898 AD',
    slug: 'kalki-2898-ad',
    synopsis: 'In the year 2898 AD, a modern avatar of Vishnu descends to protect humanity from the forces of darkness and supreme leader Yaskin.',
    duration_minutes: 180,
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'English'],
    genres: ['Sci-Fi', 'Action', 'Mythology'],
    certification: 'UA',
    rating: 9.2,
    votes_count: 4520,
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    trailer_url: 'https://www.youtube.com',
    release_date: '2026-06-27',
    status: 'now_showing',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '20202020-2020-2020-2020-202020202020',
    title: 'Dune: Prophecy & Power',
    slug: 'dune-prophecy-and-power',
    synopsis: 'Two Harkonnen sisters combat forces that threaten the future of humankind and establish the fabled sect known as the Bene Gesserit.',
    duration_minutes: 165,
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    certification: 'UA',
    rating: 9.0,
    votes_count: 3890,
    poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailer_url: 'https://www.youtube.com',
    release_date: '2026-11-17',
    status: 'now_showing',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '30303030-3030-3030-3030-303030303030',
    title: 'Stree 2: Sarkate Ka Aatank',
    slug: 'stree-2',
    synopsis: 'The town of Chanderi faces a terrifying new headless monster called Sarkata. The beloved band of friends must team up with the mysterious protector spirit.',
    duration_minutes: 147,
    languages: ['Hindi', 'Telugu', 'Tamil'],
    genres: ['Comedy', 'Horror', 'Mystery'],
    certification: 'UA',
    rating: 8.6,
    votes_count: 2940,
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    trailer_url: 'https://www.youtube.com',
    release_date: '2026-08-15',
    status: 'now_showing',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '40404040-4040-4040-4040-404040404040',
    title: 'Interstellar: Beyond Event Horizon',
    slug: 'interstellar-re-release',
    synopsis: 'Christopher Nolan epic returns to IMAX. A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
    duration_minutes: 169,
    languages: ['English', 'Hindi'],
    genres: ['Sci-Fi', 'Drama'],
    certification: 'U',
    rating: 9.5,
    votes_count: 6200,
    poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    trailer_url: 'https://www.youtube.com',
    release_date: '2026-10-10',
    status: 'now_showing',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '50505050-5050-5050-5050-505050505050',
    title: 'Avatar: Fire and Ash',
    slug: 'avatar-fire-and-ash',
    synopsis: 'Jake Sully and Neytiri face the Ash People, a volcanic clan of Na vi that reveals a darker side of Pandora previously unseen.',
    duration_minutes: 192,
    languages: ['English', 'Telugu', 'Hindi', 'Tamil'],
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    certification: 'UA',
    rating: 9.4,
    votes_count: 1820,
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    trailer_url: 'https://www.youtube.com',
    release_date: '2026-12-19',
    status: 'coming_soon',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export async function fetchMovies(status?: MovieStatus): Promise<Movie[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('movies').select('*').order('rating', { ascending: false });
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Movie[];
      }
    } catch (err) {
      console.warn('Supabase movies query fallback:', err);
    }
  }

  // Fallback to local data
  return status ? FALLBACK_MOVIES.filter((m) => m.status === status) : FALLBACK_MOVIES;
}

export async function fetchMovieBySlug(slug: string): Promise<Movie | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('movies').select('*').eq('slug', slug).single();
      if (!error && data) {
        return data as Movie;
      }
    } catch (err) {
      console.warn('Supabase movie fetch error:', err);
    }
  }

  return FALLBACK_MOVIES.find((m) => m.slug === slug || m.id === slug) || null;
}
