import { supabase } from '../lib/supabase';

export const NewsletterService = {
  async subscribe(email: string) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, subscribed: true }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return { message: 'Already subscribed' };
      }
      throw error;
    }
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
