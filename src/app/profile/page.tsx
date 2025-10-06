'use client';

import { useAuth, useRequireAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updatePassword, isSupabaseAvailable } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';
import { ConfirmModal } from '@/components/ui/Modal';
import { useTranslation } from '@/i18n/translation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function ProfilePage() {
  const { user, signOut, loading, updateUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingCommunications, setMarketingCommunications] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // This will redirect to login if user is not authenticated
  useRequireAuth();
  
  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmailNotifications(user.user_metadata?.email_notifications ?? true);
      setMarketingCommunications(user.user_metadata?.marketing_communications ?? false);
    }
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/');
    }
  };

  const handleSaveProfile = async () => {
    if (!isSupabaseAvailable()) {
      toast.warning(t('profile.profile_update_demo_warning'));
      setIsEditing(false);
      return;
    }
    
    setIsUpdating(true);
    try {
      const { error } = await updateUser({
        data: {
          full_name: fullName,
          email_notifications: emailNotifications,
          marketing_communications: marketingCommunications,
        }
      });
      
      if (error) {
        toast.error(t('profile.profile_update_error', { error: error.message }));
      } else {
        toast.success(t('profile.profile_update_success'));
        setIsEditing(false);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(t('profile.unexpected_error_profile', { error: errorMessage }));
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error(t('profile.password_fields_required'));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error(t('profile.passwords_no_match'));
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error(t('profile.password_min_length'));
      return;
    }
    
    if (!isSupabaseAvailable()) {
      toast.warning(t('profile.password_change_demo_warning'));
      setShowPasswordModal(false);
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        toast.error(t('profile.password_change_error', { error: error.message }));
      } else {
        toast.success(t('profile.password_change_success'));
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(t('profile.unexpected_error_password', { error: errorMessage }));
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!isSupabaseAvailable()) {
      toast.warning(t('profile.delete_account_demo_warning'));
      setShowDeleteModal(false);
      return;
    }
    
    setIsDeleting(true);
    try {
      // Note: Supabase doesn't have a direct delete user method from client
      // This would typically require a server-side function or admin API call
      toast.warning(t('profile.delete_account_contact_support'));
      setShowDeleteModal(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(t('profile.unexpected_error_general', { error: errorMessage }));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {t('profile.back_to_dashboard')}
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">{t('profile.title')}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <span className="text-gray-700">
                {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                {t('profile.sign_out')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{t('profile.account_information')}</h2>
            <p className="text-sm text-gray-500 mt-1">{t('profile.account_subtitle')}</p>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-6">
              {/* Profile Picture Placeholder */}
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{t('profile.profile_picture')}</h3>
                  <p className="text-sm text-gray-500">{t('profile.profile_picture_subtitle')}</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    {t('profile.change_photo')}
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.full_name')}
                  </label>
                  {isEditing ? (
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-gray-500"
                      aria-describedby="fullName-desc"
                    />
                  ) : (
                    <p className="text-gray-900 py-2" id="fullName-desc">
                      {user?.user_metadata?.full_name || t('profile.not_provided')}
                    </p>
                  )}
                </div>

                <div>
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.email_address')}
                  </div>
                  <p className="text-gray-900 py-2">{user?.email}</p>
                  <p className="text-xs text-gray-500">
                    {user?.email_confirmed_at ? t('profile.verified') : t('profile.not_verified')}
                  </p>
                </div>

                <div>
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.account_created')}
                  </div>
                  <p className="text-gray-900 py-2">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                <div>
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.last_sign_in')}
                  </div>
                  <p className="text-gray-900 py-2">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Account Actions */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isUpdating}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isUpdating && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        <span>{isUpdating ? t('profile.saving') : t('profile.save_changes')}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFullName(user?.user_metadata?.full_name || '');
                          setEmailNotifications(user?.user_metadata?.email_notifications ?? true);
                          setMarketingCommunications(user?.user_metadata?.marketing_communications ?? false);
                        }}
                        disabled={isUpdating}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('profile.cancel')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {t('profile.edit_profile')}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    {t('profile.change_password')}
                  </button>
                  
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    {t('profile.delete_account')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white shadow rounded-lg mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{t('profile.preferences')}</h2>
            <p className="text-sm text-gray-500 mt-1">{t('profile.preferences_subtitle')}</p>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{t('profile.email_notifications')}</h3>
                  <p className="text-sm text-gray-500">{t('profile.email_notifications_subtitle')}</p>
                </div>
                <label htmlFor="emailNotifications" className="relative inline-flex items-center cursor-pointer">
                  <input 
                    id="emailNotifications"
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    disabled={!isEditing}
                    aria-label={t('profile.email_notifications')}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border-2 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{t('profile.marketing_communications')}</h3>
                  <p className="text-sm text-gray-500">{t('profile.marketing_communications_subtitle')}</p>
                </div>
                <label htmlFor="marketingCommunications" className="relative inline-flex items-center cursor-pointer">
                  <input 
                    id="marketingCommunications"
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={marketingCommunications}
                    onChange={(e) => setMarketingCommunications(e.target.checked)}
                    disabled={!isEditing}
                    aria-label={t('profile.marketing_communications')}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border-2 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.password_modal_title')}</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.current_password')}
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-gray-500"
                  placeholder={t('profile.current_password_placeholder')}
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.new_password')}
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-gray-500"
                  placeholder={t('profile.new_password_placeholder')}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.confirm_new_password')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-gray-500"
                  placeholder={t('profile.confirm_new_password_placeholder')}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={isChangingPassword}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('profile.cancel')}
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !newPassword || !confirmPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isChangingPassword && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isChangingPassword ? t('profile.changing_password') : t('profile.change_password')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title={t('profile.delete_account_title')}
        message={t('profile.delete_account_message')}
        confirmText={isDeleting ? t('profile.deleting') : t('profile.delete_account')}
        cancelText={t('profile.cancel')}
        variant="danger"
      />
    </div>
  );
}