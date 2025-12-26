import { supabase } from '../lib/supabase';

export type GameType = 'WORM' | 'IPP' | 'VIGI' | 'CAPACITY' | 'VIGI1';

export interface GameSession {
  game_type: GameType;
  score: number;
  duration_seconds: number;
  metadata?: Record<string, any>; // For game-specific stats
  started_at?: string;
}

export const statsService = {
  /**
   * Saves a game session to the database.
   * If the user is not authenticated, this function does nothing (or could save to local storage).
   */
  async saveSession(session: GameSession) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('Guest user - stats not saved to DB:', session);
      // Optional: Save to local storage for guest persistence if needed
      return;
    }

    try {
      const { error } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user.id,
          game_type: session.game_type,
          score: session.score,
          duration_seconds: session.duration_seconds,
          metadata: session.metadata,
          started_at: session.started_at || new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving game session:', error);
      } else {
        console.log('Game session saved successfully');
      }
    } catch (err) {
      console.error('Unexpected error saving stats:', err);
    }
  },

  /**
   * Fetches user statistics for a specific game or all games.
   */
  async getUserStats(gameType?: GameType) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    let query = supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', user.id);

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }

    return data;
  }
};
