export const mockCatches = [
  {
    id: '1',
    user: { name: 'Leo Angler', avatar: 'https://i.pravatar.cc/100?img=12' },
    species: { name: 'Dorado', base_points: 120 },
    photo_url: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=1200&q=60',
    caption: 'Salida rápida al atardecer. Picó cerca de la orilla.',
    caught_at: '2026-03-10T18:30:00.000Z',
    created_at: '2026-03-10T19:00:00.000Z',
  },
  {
    id: '2',
    user: { name: 'Mati Pesca', avatar: 'https://i.pravatar.cc/100?img=32' },
    species: { name: 'Surubí', base_points: 200 },
    photo_url: 'https://images.unsplash.com/photo-1510137600163-2729bc6959a6?auto=format&fit=crop&w=1200&q=60',
    caption: 'Rompeolas, carnada viva.',
    caught_at: '2026-03-09T09:10:00.000Z',
    created_at: '2026-03-09T10:00:00.000Z',
  },
]

export const mockRankingGeneral = [
  { user_id: 'u1', display_name: 'Leo Angler', avatar_url: 'https://i.pravatar.cc/100?img=12', total_points: 980, catches_count: 14 },
  { user_id: 'u2', display_name: 'Mati Pesca', avatar_url: 'https://i.pravatar.cc/100?img=32', total_points: 860, catches_count: 11 },
  { user_id: 'u3', display_name: 'Sofi Río', avatar_url: 'https://i.pravatar.cc/100?img=48', total_points: 740, catches_count: 10 },
]

export const mockRankingBySpecies = [
  { species_name: 'Dorado', user_id: 'u1', display_name: 'Leo Angler', avatar_url: 'https://i.pravatar.cc/100?img=12', points_in_species: 360, catches_count: 3 },
  { species_name: 'Dorado', user_id: 'u2', display_name: 'Mati Pesca', avatar_url: 'https://i.pravatar.cc/100?img=32', points_in_species: 240, catches_count: 2 },
  { species_name: 'Surubí', user_id: 'u2', display_name: 'Mati Pesca', avatar_url: 'https://i.pravatar.cc/100?img=32', points_in_species: 400, catches_count: 2 },
]
