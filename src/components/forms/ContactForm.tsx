'use client';

import React, { useState } from 'react';
import { Button, Input, Textarea, Select, Checkbox } from '@/components/ui/FormComponents';

interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
  onSubmit?: (data: ContactFormData) => void;
  className?: string;
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
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions' as any;
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
          <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
          <p className="text-green-700 mb-4">
            Thank you for your inquiry{propertyTitle ? ` about ${propertyTitle}` : ''}. 
            We'll get back to you within 24 hours.
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
            Send Another Message
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
            <h3 className="font-semibold text-blue-800 mb-1">Inquiry About</h3>
            <p className="text-blue-700">{propertyTitle}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="Enter your full name"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          <Input
            type="email"
            label="Email Address *"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="Enter your email address"
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
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          <Select
            label="Inquiry Type"
            value={formData.inquiryType}
            onChange={(e) => handleInputChange('inquiryType', e.target.value)}
            options={[
              { value: 'information', label: 'Request Information' },
              { value: 'viewing', label: 'Schedule Viewing' },
              { value: 'offer', label: 'Make an Offer' },
              { value: 'general', label: 'General Inquiry' }
            ]}
          />
        </div>

        <Select
          label="Preferred Contact Method"
          value={formData.preferredContact}
          onChange={(e) => handleInputChange('preferredContact', e.target.value)}
          options={[
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
            { value: 'either', label: 'Either Email or Phone' }
          ]}
        />

        <Textarea
          label="Message *"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          error={errors.message}
          placeholder="Please tell us about your requirements, preferred viewing times, or any questions you may have..."
          rows={5}
        />

        <div className="space-y-3">
          <Checkbox
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            error={errors.agreeToTerms as string}
            label="I agree to the Terms and Conditions and Privacy Policy *"
            description="Required to process your inquiry"
          />

          <Checkbox
            checked={formData.subscribeNewsletter}
            onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
            label="Subscribe to property updates and newsletter"
            description="Receive notifications about new properties and market insights"
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
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
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
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  );
}