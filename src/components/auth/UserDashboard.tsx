'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useFavorites, useSavedSearches } from '@/hooks/useUserProfile';
import { Button, Input } from '@/components/ui/FormComponents';
import { useTranslation } from '@/i18n/translation';
import Image from 'next/image';
import Link from 'next/link';
import { sampleProperties } from '@/data/sampleProperties';

interface TabComponentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function ProfileTab({ profile, updateProfile, uploadAvatar, loading }: any) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const result = await updateProfile(formData);
    if (result?.success) {
      setIsEditing(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (avatarFile) {
      await uploadAvatar(avatarFile);
      setAvatarFile(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-6 mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                {profile?.first_name?.[0] || 'U'}
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700" title="Upload Avatar">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label="Upload avatar image"
            />
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </label>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {profile?.first_name} {profile?.last_name}
          </h2>
          <p className="text-gray-600">{profile?.email}</p>
          <p className="text-sm text-gray-500 capitalize">{profile?.role} Account</p>
        </div>
      </div>

      {avatarFile && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">{t('dashboard.ready_to_upload', { filename: avatarFile.name })}</p>
          <div className="mt-2 space-x-2">
            <Button size="sm" onClick={handleAvatarUpload} loading={loading}>
              {t('dashboard.upload_avatar')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAvatarFile(null)}>
              {t('dashboard.cancel')}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t('dashboard.personal_information')}</h3>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              {t('dashboard.edit_profile')}
            </Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={handleSave} loading={loading}>
                {t('dashboard.save_changes')}
              </Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                {t('dashboard.cancel')}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('dashboard.first_name')}
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label={t('dashboard.last_name')}
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label={t('dashboard.phone_number')}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
            placeholder={t('dashboard.phone_placeholder')}
          />
          <Input
            label="Email Address"
            value={profile?.email || ''}
            disabled
            className="bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}

function FavoritesTab({ favorites, removeFavorite }: any) {
  const { t } = useTranslation();
  const favoriteProperties = sampleProperties.filter(property => 
    favorites.includes(property.id)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{t('dashboard.your_favorite_properties')}</h3>
      
      {favoriteProperties.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-500">{t('dashboard.no_favorite_properties')}</p>
          <Link href="/properties">
            <Button className="mt-4">Browse Properties</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteProperties.map((property) => (
            <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3]">
                <Image
                  src={property.images[0]?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeFavorite(property.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-600 hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                <p className="text-blue-600 font-bold">R {property.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {property.bedrooms} bed • {property.bathrooms} bath • {property.squareMeters}m²
                </p>
                <Link href={`/properties/${property.id}`}>
                  <Button className="w-full mt-3" size="sm">
                    {t('common.view_details')}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SavedSearchesTab({ savedSearches, deleteSearch }: any) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{t('dashboard.your_saved_searches')}</h3>
      
      {savedSearches.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500">{t('dashboard.no_saved_searches')}</p>
          <Link href="/">
            <Button className="mt-4">{t('dashboard.start_searching')}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedSearches.map((search: any) => (
            <div key={search.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{search.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Created: {new Date(search.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {search.filters.location && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        📍 {search.filters.location}
                      </span>
                    )}
                    {search.filters.propertyType?.length > 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        🏠 {search.filters.propertyType.join(', ')}
                      </span>
                    )}
                    {search.alerts_enabled && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        🔔 Alerts On
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Run Search
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => deleteSearch(search.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useUserProfile(user);
  const { favorites, removeFavorite } = useFavorites(user);
  const { savedSearches, deleteSearch } = useSavedSearches(user);
  const [activeTab, setActiveTab] = useState('profile');
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.access_denied')}</h1>
          <p className="text-gray-600 mb-6">{t('auth.please_signin')}</p>
          <Link href="/auth/login">
            <Button>{t('auth.sign_in')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: t('dashboard.profile_tab'), icon: '👤' },
    { id: 'favorites', name: t('dashboard.favorites_tab'), icon: '❤️', count: favorites.length },
    { id: 'searches', name: t('dashboard.searches_tab'), icon: '🔍', count: savedSearches.length },
    { id: 'activity', name: t('dashboard.activity_tab'), icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('dashboard.welcome_back', { name: profile?.first_name || 'User' })}
              </h1>
              <p className="text-gray-600 mt-1">{t('dashboard.manage_profile_preferences')}</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              {t('dashboard.sign_out')}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-200 text-gray-800 py-1 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'profile' && (
            <ProfileTab
              profile={profile}
              updateProfile={updateProfile}
              uploadAvatar={uploadAvatar}
              loading={profileLoading}
            />
          )}
          
          {activeTab === 'favorites' && (
            <FavoritesTab
              favorites={favorites}
              removeFavorite={removeFavorite}
            />
          )}
          
          {activeTab === 'searches' && (
            <SavedSearchesTab
              savedSearches={savedSearches}
              deleteSearch={deleteSearch}
            />
          )}
          
          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.recent_activity')}</h3>
              <p className="text-gray-500">{t('dashboard.activity_tracking_coming_soon')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}