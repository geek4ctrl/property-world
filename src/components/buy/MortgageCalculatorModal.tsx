'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MortgageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MortgageCalculatorModal({ isOpen, onClose }: MortgageCalculatorModalProps) {
  const [propertyPrice, setPropertyPrice] = useState(2000000);
  const [deposit, setDeposit] = useState(10);
  const [interestRate, setInterestRate] = useState(11.5);
  const [loanTerm, setLoanTerm] = useState(20);

  if (!isOpen) return null;

  // Quick calculation
  const loanAmount = propertyPrice - (propertyPrice * deposit / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Quick Mortgage Calculator</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="propertyPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Property Price
            </label>
            <input 
              id="propertyPrice"
              type="number" 
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              placeholder="e.g. 2,000,000" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 mb-1">
              Deposit (%)
            </label>
            <input 
              id="deposit"
              type="number" 
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              placeholder="e.g. 10" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%)
            </label>
            <input 
              id="interestRate"
              type="number" 
              step="0.1" 
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              placeholder="e.g. 11.5" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term (years)
            </label>
            <select 
              id="loanTerm"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="20">20 years</option>
              <option value="25">25 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                R{Math.round(monthlyPayment).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Estimated monthly payment</div>
            </div>
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <div>Loan Amount: R{loanAmount.toLocaleString()}</div>
              <div>Deposit: R{(propertyPrice * deposit / 100).toLocaleString()}</div>
            </div>
          </div>
          <Link
            href="/buy/calculator"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            onClick={onClose}
          >
            Use Advanced Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}