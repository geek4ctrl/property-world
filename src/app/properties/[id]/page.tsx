"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/i18n/translation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyDetailPage from "@/components/property/PropertyDetailPage";
import { sampleProperties } from "@/data/sampleProperties";

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const { t } = useTranslation();

  // Find the property by ID
  const property = sampleProperties.find((p) => p.id === propertyId);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t('property.property_not_found')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('property.property_not_found_desc')}
            </p>
            <div className="space-y-3">
              <Link
                href="/properties"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Properties
              </Link>
              <Link
                href="/"
                className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                {t('property.back_to_home')}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PropertyDetailPage property={property} />
      <Footer />
    </div>
  );
}
