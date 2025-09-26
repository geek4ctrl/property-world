'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserPreferences } from '@/types/user';

// User Profile Management Hook
export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          await createProfile();
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    const defaultProfile: Partial<UserProfile> = {
      id: user.id,
      email: user.email!,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      phone: user.user_metadata?.phone || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      role: 'buyer',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        priceAlerts: true,
        newListingAlerts: true,
        preferredCurrency: 'ZAR',
        preferredLanguage: 'en'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating profile:', err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating profile:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!profile) return;

    const updatedPreferences = {
      ...profile.preferences,
      ...preferences
    };

    return await updateProfile({ preferences: updatedPreferences });
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const result = await updateProfile({ avatar_url: publicUrl });
      return result;
    } catch (err: any) {
      setError(err.message);
      console.error('Error uploading avatar:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updatePreferences,
    uploadAvatar,
    refreshProfile: fetchProfile
  };
}

// Favorites Management Hook
export function useFavorites(user: User | null) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data.map(item => item.property_id));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (propertyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: user.id, property_id: propertyId }]);

      if (error) throw error;
      setFavorites(prev => [...prev, propertyId]);
      return { success: true };
    } catch (err: any) {
      console.error('Error adding favorite:', err);
      return { success: false, error: err.message };
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) throw error;
      setFavorites(prev => prev.filter(id => id !== propertyId));
      return { success: true };
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      return { success: false, error: err.message };
    }
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refreshFavorites: fetchFavorites
  };
}

// Saved Searches Hook
export function useSavedSearches(user: User | null) {
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSavedSearches();
    } else {
      setSavedSearches([]);
    }
  }, [user]);

  const fetchSavedSearches = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSearches(data || []);
    } catch (err) {
      console.error('Error fetching saved searches:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async (name: string, filters: any, alertsEnabled: boolean = false) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert([{
          user_id: user.id,
          name,
          filters,
          alerts_enabled: alertsEnabled,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      setSavedSearches(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err: any) {
      console.error('Error saving search:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteSearch = async (searchId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId)
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting search:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    savedSearches,
    loading,
    saveSearch,
    deleteSearch,
    refreshSavedSearches: fetchSavedSearches
  };
}