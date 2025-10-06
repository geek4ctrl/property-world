'use client';

import React, { useState } from 'react';
import { Button, Input, Textarea, Select, Checkbox } from '@/components/ui/FormComponents';
import { useTranslation } from '@/i18n/translation';

interface ContactFormProps {
  readonly propertyId?: string;
  readonly propertyTitle?: string;
  readonly onSubmit?: (data: ContactFormData) => void;
  readonly className?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  inquiryType: 'viewing' | 'information' | 'offer' | 'general';
  preferredContact: 'email' | 'phone' | 'either';
  agreeToTerms: boolean;
  subscribeNewsletter?: boolean;
}

export default function ContactForm({ 
  propertyId, 
  propertyTitle, 
  onSubmit, 
  className = '' 
}: ContactFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'information',
    preferredContact: 'email',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact.name_required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.email_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.valid_email_required');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.message_required');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.message_min_length');
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('contact.agree_terms_required') as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className={`animate-fade-in ${className}`}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">{t('contact.message_sent_success')}</h3>
          <p className="text-green-700 mb-4">
            {t('contact.thank_you_inquiry', { propertyTitle: propertyTitle ? ` about ${propertyTitle}` : '' })}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
                inquiryType: 'information',
                preferredContact: 'email',
                agreeToTerms: false,
                subscribeNewsletter: false
              });
            }}
          >
            {t('contact.send_another_message')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-fade-in ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {propertyTitle && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-slide-down">
            <h3 className="font-semibold text-blue-800 mb-1">{t('contact.inquiry_about')}</h3>
            <p className="text-blue-700">{propertyTitle}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={`${t('contact.full_name')} *`}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder={t('contact.full_name_placeholder')}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          <Input
            type="email"
            label={`${t('contact.email_address')} *`}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder={t('contact.email_placeholder')}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="tel"
            label={t('contact.phone_number')}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder={t('contact.phone_placeholder')}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          <Select
            label={t('contact.inquiry_type')}
            value={formData.inquiryType}
            onChange={(e) => handleInputChange('inquiryType', e.target.value)}
            options={[
              { value: 'information', label: t('contact.request_information') },
              { value: 'viewing', label: t('contact.schedule_viewing') },
              { value: 'offer', label: t('contact.make_offer') },
              { value: 'general', label: t('contact.general_inquiry') }
            ]}
          />
        </div>

        <Select
          label={t('contact.preferred_contact_method')}
          value={formData.preferredContact}
          onChange={(e) => handleInputChange('preferredContact', e.target.value)}
          options={[
            { value: 'email', label: t('contact.email') },
            { value: 'phone', label: t('contact.phone') },
            { value: 'either', label: t('contact.either_email_phone') }
          ]}
        />

        <Textarea
          label={`${t('contact.message')} *`}
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          error={errors.message}
          placeholder={t('contact.message_placeholder')}
          rows={5}
        />

        <div className="space-y-3">
          <Checkbox
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            error={errors.agreeToTerms ? String(errors.agreeToTerms) : undefined}
            label={`${t('contact.agree_terms')} *`}
            description={t('contact.agree_terms_desc')}
          />

          <Checkbox
            checked={formData.subscribeNewsletter}
            onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
            label={t('contact.subscribe_newsletter')}
            description={t('contact.subscribe_newsletter_desc')}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            loading={isSubmitting}
            className="flex-1"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            }
          >
            {isSubmitting ? t('contact.sending_message') : t('contact.send_message')}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
                inquiryType: 'information',
                preferredContact: 'email',
                agreeToTerms: false,
                subscribeNewsletter: false
              });
              setErrors({});
            }}
          >
            {t('contact.clear_form')}
          </Button>
        </div>
      </form>
    </div>
  );
}