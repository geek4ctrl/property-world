'use client';

import { useState } from 'react';
import { useTranslation } from '@/i18n/translation';
import { formatPrice } from '@/lib/utils';

interface MortgageCalculatorProps {
  propertyPrice: number;
  className?: string;
}

export default function MortgageCalculator({ propertyPrice, className = '' }: MortgageCalculatorProps) {
  const { t } = useTranslation();
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.1); // 10% default
  const [interestRate, setInterestRate] = useState(11.5); // South African prime rate
  const [termYears, setTermYears] = useState(20);
  const [showCalculation, setShowCalculation] = useState(false);

  const calculateMonthlyPayment = () => {
    const principal = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = termYears * 12;

    if (monthlyRate === 0) {
      return principal / numPayments;
    }

    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * termYears * 12;
  const totalInterest = totalPayment - (propertyPrice - downPayment);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {t('property.mortgage_calculator')}
        </h3>
        <button
          onClick={() => setShowCalculation(!showCalculation)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {showCalculation ? 'Hide' : 'Calculate'}
        </button>
      </div>

      {showCalculation && (
        <div className="space-y-4">
          {/* Property Price (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Price
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium">
              {formatPrice(propertyPrice, 'ZAR')}
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment
            </label>
            <div className="relative">
              <input
                type="number"
                value={Math.round(downPayment)}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={propertyPrice}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">
                  {Math.round((downPayment / propertyPrice) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex mt-1 space-x-1">
              {[5, 10, 20].map(percent => (
                <button
                  key={percent}
                  onClick={() => setDownPayment(propertyPrice * (percent / 100))}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="30"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current SA prime rate: ~11.5%
            </p>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term (Years)
            </label>
            <select
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10 years</option>
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={25}>25 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>

          {/* Results */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatPrice(monthlyPayment, 'ZAR')}
                </div>
                <div className="text-sm text-blue-800 font-medium">
                  {t('property.monthly_payment')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-900">
                  {formatPrice(propertyPrice - downPayment, 'ZAR')}
                </div>
                <div className="text-gray-600">Loan Amount</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-900">
                  {formatPrice(totalInterest, 'ZAR')}
                </div>
                <div className="text-gray-600">Total Interest</div>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              *This is an estimate. Actual rates and terms may vary.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}