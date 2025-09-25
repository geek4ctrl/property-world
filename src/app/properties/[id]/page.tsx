"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyMap from "@/components/map/PropertyMap";
import { PropertyErrorBoundary, MapErrorBoundary } from "@/components/ui/SpecializedErrorBoundaries";
import { sampleProperties } from "@/data/sampleProperties";
import { formatPrice, formatPropertyType } from "@/lib/utils";
import { ListingType } from "@/types";
import { useTranslation } from "@/i18n/translation";
import { generateSmartAvatar } from "@/lib/avatarUtils";

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const { t } = useTranslation();

  // Find the property by ID
  const property = sampleProperties.find((p) => p.id === propertyId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('property.property_not_found')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('property.property_not_found_desc')}
          </p>
          <Link
            href="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('property.back_to_home')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const primaryImage =
    property.images.find((img) => img.isPrimary) || property.images[0];
  const otherImages = property.images.filter((img) => !img.isPrimary);
  const allImages = [primaryImage, ...otherImages];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">
              {t('navigation.home')}
            </Link>
            <span>/</span>
            <Link href="/" className="hover:text-primary-600">
              {t('navigation.properties')}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            <PropertyErrorBoundary>
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              {/* Main Image */}
              <div className="aspect-[16/10] relative">
                <Image
                  src={
                    allImages[selectedImageIndex]?.url ||
                    "/placeholder-property.jpg"
                  }
                  alt={allImages[selectedImageIndex]?.alt || property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === 0 ? allImages.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === allImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto">
                    {allImages.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-primary-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          width={80}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>

              {/* Price and Type */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {formatPrice(property.price, property.currency)}
                    {property.listingType === ListingType.TO_RENT && (
                      <span className="text-lg font-normal text-gray-600">
                        {t('property.per_month')}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600">
                    {formatPropertyType(property.propertyType, t)}
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    property.listingType === ListingType.FOR_SALE
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {property.listingType === ListingType.FOR_SALE ? t('property.for_sale') : t('property.to_rent')}
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.bedrooms}
                  </div>
                  <div className="text-sm text-gray-600">{t('property.bedrooms')}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.bathrooms}
                  </div>
                  <div className="text-sm text-gray-600">{t('property.bathrooms')}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.garages || 0}
                  </div>
                  <div className="text-sm text-gray-600">{t('property.garages')}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.squareMeters}
                  </div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {t('property.description')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {t('property.features_amenities')}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {t('property.location')}
                </h2>
                <div className="text-gray-700 mb-4">
                  <p>{property.address.street}</p>
                  <p>
                    {property.address.suburb}, {property.address.city}
                  </p>
                  <p>
                    {property.address.province}, {property.address.postalCode}
                  </p>
                  <p>{property.address.country}</p>
                </div>
                
                {/* Interactive Map */}
                <div className="mt-4">
                  <MapErrorBoundary>
                    <PropertyMap 
                      property={property} 
                      className="w-full h-64 rounded-lg border border-gray-200"
                    />
                  </MapErrorBoundary>
                </div>
              </div>
            </div>
            </PropertyErrorBoundary>
          </div>

          {/* Right Column - Agent Info and Contact */}
          <div className="lg:col-span-1">
            <PropertyErrorBoundary>
              {/* Agent Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('property.contact_agent')}
              </h2>

              <div className="flex items-center space-x-4 mb-4">
                {property.agent.profileImage && !avatarError ? (
                  <Image
                    src={property.agent.profileImage}
                    alt={property.agent.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <Image
                    src={generateSmartAvatar(property.agent.name)}
                    alt={property.agent.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                    onError={(e) => {
                      // Final fallback to initials with styled background
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                          ${property.agent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      `;
                    }}
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {property.agent.name}
                  </h3>
                  <p className="text-gray-600">{property.agent.agency}</p>
                </div>
              </div>

              {property.agent.bio && (
                <p className="text-gray-700 text-sm mb-4">
                  {property.agent.bio}
                </p>
              )}

              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-primary-700 font-medium">
                    {property.agent.phone}
                  </span>
                </a>

                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-700">{property.agent.email}</span>
                </a>
              </div>

              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                {t('property.send_message')}
              </button>

              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t('property.your_name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={t('property.enter_your_name')}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t('property.email_address')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={t('property.enter_your_email')}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t('property.phone_number')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={t('property.enter_your_phone')}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t('property.message')}
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={t('property.message_placeholder')}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      {t('property.send_message')}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('property.quick_actions')}
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{t('property.save_to_favorites')}</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span className="text-gray-700">{t('property.share')}</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{t('property.schedule_viewing')}</span>
                </button>
              </div>
            </div>
            </PropertyErrorBoundary>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
