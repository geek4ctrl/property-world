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
        } else if (error.code === '42P01' || error.message?.includes('relation "user_profiles" does not exist')) {
          // Table doesn't exist - graceful handling during development
          console.info('📋 Development Mode: Database tables not yet created. This is expected during initial setup.\n' +
          '   → To enable full functionality, apply the migration: supabase/migrations/001_user_authentication.sql\n' +
          '   → See DATABASE_SETUP.md for detailed instructions');
          setProfile(null);
          setError(null); // Clear error to prevent UI error display
          return; // Exit early to prevent further processing
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      // Handle various database table errors
      if (err.code === '42P01' || err.message?.includes('relation "user_profiles" does not exist')) {
        console.warn('user_profiles table not found. Please apply database migration.');
        setProfile(null);
        setError(null); // Clear error since this is expected
      } else {
        setError(err.message);
        console.error('Error fetching profile:', err);
      }
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
      if (err.code === '42P01' || err.message?.includes('relation "user_profiles" does not exist')) {
        console.warn('user_profiles table not found. Please apply database migration.');
        setProfile(null);
        setError(null); // Clear error since this is expected
      } else {
        setError(err.message);
        console.error('Error creating profile:', err);
      }
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
      if (err.code === '42P01' || err.message?.includes('relation "user_profiles" does not exist')) {
        console.warn('user_profiles table not found. Please apply database migration.');
        setError(null); // Clear error since this is expected
        return { success: false, error: 'Database tables not found. Please apply migration.' };
      } else {
        setError(err.message);
        console.error('Error updating profile:', err);
        return { success: false, error: err.message };
      }
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
  const [error, setError] = useState<string | null>(null);
  const [isDatabaseAvailable, setIsDatabaseAvailable] = useState(true);

  // Local storage keys
  const LOCAL_STORAGE_KEY = 'tanoluxe-favorites';
  const GUEST_FAVORITES_KEY = 'tanoluxe-guest-favorites';

  // Load favorites from local storage (for guest users or fallback)
  const loadLocalFavorites = () => {
    try {
      const key = user ? LOCAL_STORAGE_KEY : GUEST_FAVORITES_KEY;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.warn('Error loading favorites from localStorage:', err);
      return [];
    }
  };

  // Save favorites to local storage
  const saveLocalFavorites = (favoritesList: string[]) => {
    try {
      const key = user ? LOCAL_STORAGE_KEY : GUEST_FAVORITES_KEY;
      localStorage.setItem(key, JSON.stringify(favoritesList));
    } catch (err) {
      console.warn('Error saving favorites to localStorage:', err);
    }
  };

  // Sync local favorites to database when user logs in
  const syncLocalToDatabase = async (localFavorites: string[]) => {
    if (!user || localFavorites.length === 0) return;

    try {
      // Get existing favorites from database
      const { data: existingFavorites, error: fetchError } = await supabase
        .from('user_favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const existingIds = existingFavorites?.map(f => f.property_id) || [];
      const newFavorites = localFavorites.filter(id => !existingIds.includes(id));

      // Insert new favorites
      if (newFavorites.length > 0) {
        const { error: insertError } = await supabase
          .from('user_favorites')
          .insert(newFavorites.map(property_id => ({ user_id: user.id, property_id })));

        if (insertError) throw insertError;
      }

      // Clear guest favorites from localStorage
      localStorage.removeItem(GUEST_FAVORITES_KEY);
    } catch (err) {
      console.error('Error syncing local favorites to database:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      // Load guest favorites from localStorage
      const localFavorites = loadLocalFavorites();
      setFavorites(localFavorites);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // First, try to sync any local favorites
      const localFavorites = loadLocalFavorites();
      if (localFavorites.length > 0) {
        await syncLocalToDatabase(localFavorites);
      }

      const { data, error: fetchError } = await supabase
        .from('user_favorites')
        .select('property_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        // Handle table not found gracefully
        if (fetchError.code === 'PGRST116' || fetchError.message.includes('does not exist')) {
          console.warn('⚠️ Database tables not yet created. Using local storage fallback.');
          setIsDatabaseAvailable(false);
          const localFavorites = loadLocalFavorites();
          setFavorites(localFavorites);
          return;
        }
        throw fetchError;
      }

      const favoriteIds = data.map(item => item.property_id);
      setFavorites(favoriteIds);
      setIsDatabaseAvailable(true);
      
      // Save to localStorage as backup
      saveLocalFavorites(favoriteIds);
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      setError(err.message);
      // Fallback to localStorage
      const localFavorites = loadLocalFavorites();
      setFavorites(localFavorites);
      setIsDatabaseAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (propertyId: string) => {
    // Optimistic update
    setFavorites(prev => {
      if (prev.includes(propertyId)) return prev;
      const updated = [propertyId, ...prev]; // Add to beginning
      saveLocalFavorites(updated);
      return updated;
    });

    if (!user || !isDatabaseAvailable) {
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: user.id, property_id: propertyId }]);

      if (error) {
        // Check for duplicate key error (property already favorited)
        if (error.code === '23505') {
          return { success: true }; // Already favorited, treat as success
        }
        throw error;
      }
      return { success: true };
    } catch (err: any) {
      console.error('Error adding favorite:', err);
      // Revert optimistic update
      setFavorites(prev => {
        const reverted = prev.filter(id => id !== propertyId);
        saveLocalFavorites(reverted);
        return reverted;
      });
      return { success: false, error: err.message };
    }
  };

  const removeFavorite = async (propertyId: string) => {
    // Optimistic update
    setFavorites(prev => {
      const updated = prev.filter(id => id !== propertyId);
      saveLocalFavorites(updated);
      return updated;
    });

    if (!user || !isDatabaseAvailable) {
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      // Revert optimistic update
      setFavorites(prev => {
        const reverted = [...prev, propertyId];
        saveLocalFavorites(reverted);
        return reverted;
      });
      return { success: false, error: err.message };
    }
  };

  const clearAllFavorites = async () => {
    // Optimistic update
    const previousFavorites = [...favorites];
    setFavorites([]);
    saveLocalFavorites([]);

    if (!user || !isDatabaseAvailable) {
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('Error clearing favorites:', err);
      // Revert optimistic update
      setFavorites(previousFavorites);
      saveLocalFavorites(previousFavorites);
      return { success: false, error: err.message };
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (isFavorite(propertyId)) {
      return await removeFavorite(propertyId);
    } else {
      return await addFavorite(propertyId);
    }
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  const getFavoritesByPropertyType = (propertyType?: string) => {
    if (!propertyType) return favorites;
    return favorites; // This would need property data to filter properly
  };

  return {
    favorites,
    loading,
    error,
    isDatabaseAvailable,
    addFavorite,
    removeFavorite,
    clearAllFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByPropertyType,
    refreshFavorites: fetchFavorites,

    favoriteCount: favorites.length
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

      if (error) {
        // Handle table not found gracefully
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.warn('⚠️ Database tables not yet created. Please run the migration script.');
          setSavedSearches([]);
          return;
        }
        throw error;
      }
      setSavedSearches(data || []);
    } catch (err) {
      console.error('Error fetching saved searches:', err);
      setSavedSearches([]); // Set empty array as fallback
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