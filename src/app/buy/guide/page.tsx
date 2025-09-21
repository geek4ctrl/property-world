'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function BuyingGuidePage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Getting Started', icon: 'home' },
    { id: 'financing', title: 'Financing Options', icon: 'credit-card' },
    { id: 'search', title: 'Property Search', icon: 'search' },
    { id: 'legal', title: 'Legal Process', icon: 'document-text' },
    { id: 'closing', title: 'Closing the Deal', icon: 'check-circle' },
    { id: 'moving', title: 'Moving In', icon: 'truck' }
  ];

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: string } = {
      'home': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      'search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      'document-text': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'truck': 'M8 9l4-4 4 4m0 6l-4 4-4-4'
    };
    return icons[iconName] || icons['home'];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Home Buying Guide</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your step-by-step guide to successfully purchasing property in South Africa
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Guide Sections</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left flex items-center px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(section.icon)} />
                    </svg>
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Speak with our property experts for personalized guidance.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors">
                  Contact an Expert
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {activeSection === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started: Your Home Buying Journey</h2>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-6">
                      Buying a home is one of the most significant financial decisions you'll make. This comprehensive guide 
                      will walk you through each step of the process in South Africa, helping you make informed decisions 
                      and avoid common pitfalls.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <h3 className="text-lg font-semibold text-green-900 mb-3">First-Time Buyers</h3>
                        <ul className="text-sm text-green-800 space-y-2">
                          <li>• Understand your financial position</li>
                          <li>• Learn about government incentives</li>
                          <li>• Get pre-approved for a home loan</li>
                          <li>• Research neighborhoods thoroughly</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">Seasoned Buyers</h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                          <li>• Consider selling vs. buying timing</li>
                          <li>• Explore investment opportunities</li>
                          <li>• Understand tax implications</li>
                          <li>• Leverage existing equity</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Steps Overview</h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, title: "Assess Your Financial Readiness", desc: "Calculate affordability and get pre-approved" },
                        { step: 2, title: "Define Your Requirements", desc: "Location, size, budget, and lifestyle needs" },
                        { step: 3, title: "Start Your Property Search", desc: "Use online tools and engage with agents" },
                        { step: 4, title: "View and Evaluate Properties", desc: "Conduct thorough inspections and comparisons" },
                        { step: 5, title: "Make an Offer", desc: "Submit competitive offers with proper conditions" },
                        { step: 6, title: "Finalize the Purchase", desc: "Complete legal processes and transfer" }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {item.step}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ Important Reminders</h3>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Factor in additional costs: transfer fees, bond registration, moving expenses</li>
                        <li>• Always conduct professional property inspections</li>
                        <li>• Understand the terms and conditions of your offer</li>
                        <li>• Keep detailed records of all communications and documents</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'financing' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Financing Your Home Purchase</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding Home Loans in South Africa</h3>
                      <p className="text-gray-600 mb-6">
                        Most property purchases require financing through a home loan (bond). Understanding your options 
                        and requirements is crucial for securing the best deal.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-3">Fixed Interest Rate</h4>
                          <p className="text-sm text-blue-800 mb-3">
                            Interest rate remains constant for a specified period (usually 1-5 years).
                          </p>
                          <div className="text-xs text-blue-700">
                            <strong>Pros:</strong> Predictable payments, budget certainty<br/>
                            <strong>Cons:</strong> Usually higher initial rate, limited flexibility
                          </div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-3">Variable Interest Rate</h4>
                          <p className="text-sm text-green-800 mb-3">
                            Rate fluctuates with the prime lending rate and market conditions.
                          </p>
                          <div className="text-xs text-green-700">
                            <strong>Pros:</strong> Potential savings when rates drop, more flexibility<br/>
                            <strong>Cons:</strong> Payment uncertainty, risk of rate increases
                          </div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-purple-900 mb-3">Capped Rate</h4>
                          <p className="text-sm text-purple-800 mb-3">
                            Variable rate with a maximum (cap) limit for added protection.
                          </p>
                          <div className="text-xs text-purple-700">
                            <strong>Pros:</strong> Protection from major increases, some flexibility<br/>
                            <strong>Cons:</strong> Usually higher than pure variable rates
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Pre-Approval Process</h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• 3 months' bank statements</li>
                              <li>• 3 months' payslips</li>
                              <li>• Employment contract/letter</li>
                              <li>• Copy of ID document</li>
                              <li>• Proof of deposit</li>
                              <li>• Credit report authorization</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Assessment Criteria</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Credit score and history</li>
                              <li>• Debt-to-income ratio</li>
                              <li>• Employment stability</li>
                              <li>• Available deposit amount</li>
                              <li>• Monthly affordability</li>
                              <li>• Overall financial behavior</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Government Assistance Programs</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">FLISP (Finance Linked Individual Subsidy Programme)</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Assists first-time homebuyers earning R3,501 to R22,000 per month.
                          </p>
                          <div className="text-xs text-gray-500">
                            Subsidy amount: R30,000 - R130,000 depending on income
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Enhanced People's Housing Process (ePHP)</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            For individuals earning less than R3,500 per month.
                          </p>
                          <div className="text-xs text-gray-500">
                            Provides funding for housing construction or improvement
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-green-900 mb-3">💡 Financing Tips</h3>
                      <ul className="text-sm text-green-800 space-y-2">
                        <li>• Get quotes from multiple banks to compare rates and terms</li>
                        <li>• Consider using a bond originator for better deals</li>
                        <li>• Maintain good credit score by paying bills on time</li>
                        <li>• Save for the largest deposit possible to reduce loan amount</li>
                        <li>• Factor in additional costs: insurance, rates, maintenance</li>
                        <li>• Consider loan term impact: shorter = higher payments but less interest</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'search' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Finding the Perfect Property</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Defining Your Requirements</h3>
                      <p className="text-gray-600 mb-6">
                        Before starting your search, clearly define what you need versus what you want. 
                        This helps focus your search and avoid emotional decisions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-900 mb-3">Must-Haves (Non-Negotiable)</h4>
                          <ul className="text-sm text-red-800 space-y-1">
                            <li>• Number of bedrooms needed</li>
                            <li>• Proximity to work/schools</li>
                            <li>• Maximum budget</li>
                            <li>• Property type (house/apartment/townhouse)</li>
                            <li>• Parking requirements</li>
                            <li>• Safety and security level</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-3">Nice-to-Haves (Wish List)</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Swimming pool</li>
                            <li>• Garden/outdoor space</li>
                            <li>• Modern finishes</li>
                            <li>• Multiple bathrooms</li>
                            <li>• Double garage</li>
                            <li>• Specific architectural style</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Research Neighborhoods</h3>
                      <div className="bg-gray-50 p-6 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Factors to Investigate</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Safety & Security</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Crime statistics</li>
                              <li>• Security measures</li>
                              <li>• Community watch programs</li>
                              <li>• Lighting and visibility</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Amenities & Services</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Schools and universities</li>
                              <li>• Healthcare facilities</li>
                              <li>• Shopping centers</li>
                              <li>• Recreation facilities</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Transport & Access</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Public transport options</li>
                              <li>• Traffic patterns</li>
                              <li>• Road conditions</li>
                              <li>• Airport/highway access</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Viewing Checklist</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Exterior Inspection</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Roof condition and gutters</li>
                              <li>• Foundation and structural integrity</li>
                              <li>• Paint and exterior walls</li>
                              <li>• Windows and doors</li>
                            </ul>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Garden and landscaping</li>
                              <li>• Driveway and paths</li>
                              <li>• Boundary walls and fencing</li>
                              <li>• Outdoor lighting and security</li>
                            </ul>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Interior Inspection</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Plumbing and water pressure</li>
                              <li>• Electrical systems and outlets</li>
                              <li>• Heating and cooling systems</li>
                              <li>• Kitchen appliances and fixtures</li>
                            </ul>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Flooring condition</li>
                              <li>• Wall and ceiling condition</li>
                              <li>• Storage space adequacy</li>
                              <li>• Natural light and ventilation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-3">🔍 Search Strategy Tips</h3>
                      <ul className="text-sm text-yellow-800 space-y-2">
                        <li>• Set up automated property alerts for your criteria</li>
                        <li>• View properties at different times of day and week</li>
                        <li>• Take photos and notes during viewings for comparison</li>
                        <li>• Research recent sales in the area for pricing context</li>
                        <li>• Don't limit yourself to one area - explore similar neighborhoods</li>
                        <li>• Consider properties with potential rather than just "move-in ready"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'legal' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Process & Documentation</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">The Offer to Purchase</h3>
                      <p className="text-gray-600 mb-6">
                        The Offer to Purchase is a crucial legal document that, once accepted, becomes a binding contract. 
                        Understanding its components is essential for protecting your interests.
                      </p>

                      <div className="bg-gray-50 p-6 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Components of an Offer</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Essential Terms</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Purchase price and payment terms</li>
                              <li>• Property description and address</li>
                              <li>• Occupation date</li>
                              <li>• Fixtures and fittings included</li>
                              <li>• Bond registration period</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Protective Conditions</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Suspensive condition for bond approval</li>
                              <li>• Property inspection clause</li>
                              <li>• Electrical compliance certificate</li>
                              <li>• Municipal clearance certificate</li>
                              <li>• Pest and damp inspection</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Inspections</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Electrical Compliance Certificate (COC)</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Required by law for all property transfers. Ensures electrical installation meets safety standards.
                          </p>
                          <div className="text-xs text-gray-500">
                            Cost: R1,500 - R3,000 | Duration: 1-2 weeks
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Building Inspection</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Professional assessment of structural integrity, plumbing, and major systems.
                          </p>
                          <div className="text-xs text-gray-500">
                            Cost: R3,000 - R8,000 | Duration: 2-3 hours on-site + report
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Pest and Damp Inspection</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Identifies termite damage, wood-boring beetle infestation, and moisture problems.
                          </p>
                          <div className="text-xs text-gray-500">
                            Cost: R1,500 - R2,500 | Duration: 1-2 hours + report
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Transfer Process Timeline</h3>
                      <div className="space-y-4">
                        {[
                          { week: "Week 1-2", title: "Offer Acceptance & Bond Application", desc: "Submit offer, obtain acceptance, apply for home loan" },
                          { week: "Week 3-4", title: "Bond Approval & Inspections", desc: "Receive bond approval, conduct property inspections" },
                          { week: "Week 5-6", title: "Attorney Appointment & Documentation", desc: "Transferring attorney appointed, documents prepared" },
                          { week: "Week 7-8", title: "Registration Preparation", desc: "Final documentation submitted to Deeds Office" },
                          { week: "Week 9-12", title: "Registration & Transfer", desc: "Property registration at Deeds Office, keys handed over" }
                        ].map((phase, index) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="w-20 text-sm font-medium text-green-600 flex-shrink-0">
                              {phase.week}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{phase.title}</h4>
                              <p className="text-sm text-gray-600">{phase.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                      <h3 className="text-lg font-semibold text-red-900 mb-3">⚠️ Legal Precautions</h3>
                      <ul className="text-sm text-red-800 space-y-2">
                        <li>• Never sign an offer without legal review if you're unsure</li>
                        <li>• Ensure all verbal promises are included in writing</li>
                        <li>• Understand all suspensive conditions and their implications</li>
                        <li>• Verify the seller's legal right to sell the property</li>
                        <li>• Check for any outstanding municipal accounts or levies</li>
                        <li>• Ensure property boundaries match the title deed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'closing' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Closing the Deal</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Final Costs Breakdown</h3>
                      <p className="text-gray-600 mb-6">
                        Beyond the purchase price, several additional costs are involved in property transfer. 
                        Plan for these expenses to avoid surprises.
                      </p>

                      <div className="bg-gray-50 p-6 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Transfer Costs Calculator</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-800 mb-3">Buyer's Costs</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Transfer duty (varies by price):</span>
                                <span className="font-semibold">R15,000 - R150,000+</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Transferring attorney fees:</span>
                                <span className="font-semibold">R15,000 - R25,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bond registration costs:</span>
                                <span className="font-semibold">R10,000 - R20,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bond attorney fees:</span>
                                <span className="font-semibold">R8,000 - R15,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Deeds Office fees:</span>
                                <span className="font-semibold">R500 - R1,500</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-3">Ongoing Costs</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Home insurance (monthly):</span>
                                <span className="font-semibold">R800 - R2,500</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Municipal rates (monthly):</span>
                                <span className="font-semibold">R500 - R3,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Homeowners association (if applicable):</span>
                                <span className="font-semibold">R500 - R2,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Security (if applicable):</span>
                                <span className="font-semibold">R300 - R800</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Maintenance reserve:</span>
                                <span className="font-semibold">R1,000 - R3,000</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Pre-Occupation Inspection</h3>
                      <div className="border border-gray-200 rounded-lg p-6">
                        <p className="text-gray-600 mb-4">
                          Conduct a final walk-through inspection before taking occupation to ensure the property 
                          is in the agreed condition and all included items are present.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Check List</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• All fixtures and fittings as per agreement</li>
                              <li>• No new damage since last viewing</li>
                              <li>• All appliances in working condition</li>
                              <li>• Utilities connected and functional</li>
                              <li>• Property cleaned and vacant</li>
                              <li>• All keys and remotes provided</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Document Everything</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Take photos of any issues found</li>
                              <li>• Note discrepancies in writing</li>
                              <li>• Get seller acknowledgment of issues</li>
                              <li>• Arrange remedial action before occupation</li>
                              <li>• Keep all inspection records</li>
                              <li>• Coordinate with your attorney</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Registration Day Process</h3>
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-2">🎉 What Happens on Registration Day</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Property ownership officially transfers to you</li>
                            <li>• Bank releases bond funds to seller's attorney</li>
                            <li>• You receive the title deed and keys</li>
                            <li>• Rates and taxes transfer to your name</li>
                            <li>• Home insurance must be active from this date</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Final Tips for Success</h3>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li>• Maintain open communication with all parties involved</li>
                        <li>• Keep detailed records of all transactions and communications</li>
                        <li>• Don't make major financial changes during the process</li>
                        <li>• Have utilities transferred to your name before occupation</li>
                        <li>• Update your address with banks, employers, and service providers</li>
                        <li>• Celebrate your achievement - you're now a homeowner!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'moving' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Moving In Successfully</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Pre-Move Planning</h3>
                      <p className="text-gray-600 mb-6">
                        Proper planning makes your move smoother and less stressful. Start organizing 
                        at least 6-8 weeks before your moving date.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-3">8 Weeks Before Moving</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Get moving quotes from 3+ companies</li>
                            <li>• Create a moving budget and timeline</li>
                            <li>• Start decluttering and organizing</li>
                            <li>• Order moving supplies</li>
                            <li>• Book moving company</li>
                            <li>• Notify landlord (if renting)</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-3">4 Weeks Before Moving</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Arrange utility connections</li>
                            <li>• Update address with institutions</li>
                            <li>• Transfer children's school records</li>
                            <li>• Arrange time off work for moving day</li>
                            <li>• Start using up frozen/perishable food</li>
                            <li>• Confirm moving arrangements</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Essential Address Changes</h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Financial Institutions</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Banks and credit cards</li>
                              <li>• Insurance companies</li>
                              <li>• Investment accounts</li>
                              <li>• Retirement funds</li>
                              <li>• Tax authorities (SARS)</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Services & Utilities</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Electricity supplier</li>
                              <li>• Water and sanitation</li>
                              <li>• Internet and phone</li>
                              <li>• DStv/satellite TV</li>
                              <li>• Refuse collection</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Personal & Professional</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Employer HR department</li>
                              <li>• Medical practitioners</li>
                              <li>• Children's schools</li>
                              <li>• Subscription services</li>
                              <li>• Online shopping accounts</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Moving Day Essentials</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Survival Kit for First Day</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Cleaning supplies and toilet paper</li>
                              <li>• Basic tools (screwdriver, hammer, etc.)</li>
                              <li>• Phone chargers and extension cords</li>
                              <li>• Snacks, water, and takeaway menus</li>
                              <li>• First aid kit and medications</li>
                            </ul>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Change of clothes and toiletries</li>
                              <li>• Important documents in a safe box</li>
                              <li>• Flashlight and batteries</li>
                              <li>• Cash for tips and unexpected expenses</li>
                              <li>• Contact list for all service providers</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">First Week in Your New Home</h3>
                      <div className="space-y-4">
                        {[
                          { day: "Day 1", tasks: ["Locate main water/electricity switches", "Test all major appliances", "Change locks or rekey existing ones", "Set up basic internet/phone"] },
                          { day: "Day 2-3", tasks: ["Unpack essential rooms first", "Register with local municipality", "Find nearest hospital/emergency services", "Locate grocery stores and pharmacies"] },
                          { day: "Day 4-7", tasks: ["Register children for school/activities", "Find local service providers", "Explore the neighborhood", "Meet your neighbors"] }
                        ].map((period) => (
                          <div key={period.day} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{period.day}</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {period.tasks.map((task, index) => (
                                <li key={index}>• {task}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-green-900 mb-3">🏡 Welcome Home!</h3>
                      <p className="text-sm text-green-800 mb-3">
                        Congratulations on successfully purchasing and moving into your new home! 
                        This is a significant achievement and the beginning of a new chapter.
                      </p>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Take time to appreciate your accomplishment</li>
                        <li>• Document your first days with photos</li>
                        <li>• Start a home maintenance schedule</li>
                        <li>• Build relationships in your new community</li>
                        <li>• Begin planning future improvements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation at bottom */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Progress: {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length} sections
                  </div>
                  <div className="flex space-x-4">
                    <Link
                      href="/buy/calculator"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Calculate Affordability
                    </Link>
                    <Link
                      href="/properties?listing=sale"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Start Property Search
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}