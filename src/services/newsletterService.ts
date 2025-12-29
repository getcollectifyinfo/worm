
import { supabase } from '../lib/supabase';

export interface Subscriber {
  email: string;
  source?: string; // e.g., 'DLR', 'MOLLYMAWK', 'ALL_IN_ONE'
}

export const newsletterService = {
  /**
   * Adds a new email to the waitlist/newsletter table.
   */
  async subscribe(email: string, source: string = 'GENERAL'): Promise<{ success: boolean; error?: unknown }> {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, source, created_at: new Date().toISOString() }]);

      if (error) {
        // Handle unique violation (email already exists) gracefully
        if (error.code === '23505') {
            return { success: true }; // Treat as success to the user
        }
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return { success: false, error };
    }
  }
};
