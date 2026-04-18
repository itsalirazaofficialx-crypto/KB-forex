import { supabase } from '../lib/supabase';

export const PostService = {
  async getAll(options: { 
    status?: string | null, 
    featured?: boolean | null, 
    limit?: number | null, 
    categoryId?: string | null, 
    category_slug?: string | null,
    searchQuery?: string | null
  } = {}) {
    let query = supabase
      .from('posts')
      .select('*, categories!inner(*)')
      .order('publish_date', { ascending: false });

    if (options.status) {
      query = query.eq('status', options.status);
    }
    if (options.featured !== undefined && options.featured !== null) {
      query = query.eq('featured', options.featured);
    }
    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    if (options.category_slug) {
      query = query.eq('categories.slug', options.category_slug);
    }
    if (options.searchQuery) {
      query = query.or(`title.ilike.%${options.searchQuery}%,excerpt.ilike.%${options.searchQuery}%`);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getRelated(categoryId: string, currentPostId: string, limit = 3) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(*)')
      .eq('category_id', categoryId)
      .neq('id', currentPostId)
      .eq('status', 'published')
      .order('publish_date', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(*)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(post: any) {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, post: any) {
    const { data, error } = await supabase
      .from('posts')
      .update(post)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async incrementViews(id: string) {
    const { error } = await supabase.rpc('increment_post_views', { post_id: id });
    if (error) {
       // Fallback if RPC doesn't exist yet
       const { data } = await this.getById(id);
       await this.update(id, { views: (data.views || 0) + 1 });
    }
  }
};
