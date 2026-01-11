import { supabase } from "../lib/supabase";

export const addToFavorites = async (userId, guideId) => {
    const { data, error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, guide_id: guideId }])
        .select()
        .maybeSingle()

    return { data, error }
}

export const removeFromFavorites = async (userId, guideId) => {
    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('guide_id', guideId)

    return { error }
}

export const isFavorite = async (userId, guideId) => {
    const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('guide_id', guideId)
        .maybeSingle()

    return { isFavorite: !!data, error }
}

export const getUserFavorites = async (userId) => {
    const { data, error } = await supabase
        .from('favorites')
        .select(`id, created_at, guides(*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    return { data, error }
}

