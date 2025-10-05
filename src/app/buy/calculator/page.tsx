'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/i18n/translation';

interface MortgageCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
}

export default function MortgageCalculatorPage() {
  const { t } = useTranslation();
  const [propertyPrice, setPropertyPrice] = useState<number>(2000000);
  const [deposit, setDeposit] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(11.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(15000);
  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);

  const calculateMortgage = () => {
    const loanAmount = propertyPrice - (propertyPrice * deposit / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    setCalculation({
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanAmount
    });
  };

  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, deposit, interestRate, loanTerm]);

  const affordabilityRatio = calculation ? (calculation.monthlyPayment / monthlyIncome) * 100 : 0;
  const disposableIncome = monthlyIncome - monthlyExpenses - (calculation?.monthlyPayment || 0);

  const getAffordabilityStatus = () => {
    if (affordabilityRatio <= 30) return { color: 'green', text: t('calculator.excellent'), description: t('calculator.well_within_affordable') };
    if (affordabilityRatio <= 35) return { color: 'blue', text: t('calculator.good'), description: t('calculator.manageable_payment') };
    if (affordabilityRatio <= 40) return { color: 'yellow', text: t('calculator.caution'), description: t('calculator.higher_payment_ratio') };
    return { color: 'red', text: t('calculator.risk'), description: t('calculator.may_be_difficult') };
  };

  const status = getAffordabilityStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('calculator.mortgage_calculator')}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('calculator.description')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('calculator.property_loan_details')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="property-price" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('calculator.property_price')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                    <input
                      id="property-price"
                      type="number"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none hover:border-gray-500"
                      placeholder="2,000,000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="deposit-percentage" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('calculator.deposit_percentage')}
                  </label>
                  <div className="relative">
                    <input
                      id="deposit-percentage"
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full pr-8 pl-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none hover:border-gray-500"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {t('calculator.deposit_amount')}: R{((propertyPrice * deposit) / 100).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('calculator.interest_rate')}
                  </label>
                  <div className="relative">
                    <input
                      id="interest-rate"
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full pr-8 pl-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none hover:border-gray-500"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="loan-term" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('calculator.loan_term')}
                  </label>
                  <select
                    id="loan-term"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none hover:border-gray-500"
                  >
                    <option value={10}>10 years</option>
                    <option value={15}>15 years</option>
                    <option value={20}>20 years</option>
                    <option value={25}>25 years</option>
                    <option value={30}>30 years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Affordability Assessment */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('calculator.affordability_assessment')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="monthly-income" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('calculator.monthly_gross_income')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                    <input
                      id="monthly-income"
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none hover:border-gray-500"
                      placeholder="50,000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="monthly-expenses" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('calculator.monthly_expenses')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                    <input
                      id="monthly-expenses"
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none hover:border-gray-500"
                      placeholder="15,000"
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {t('calculator.include_monthly_debts')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Payment Calculation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('calculator.payment_calculation')}</h2>
              
              {calculation && (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        R{Math.round(calculation.monthlyPayment).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">{t('calculator.monthly_payment')}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-lg font-semibold text-gray-900">
                        R{calculation.loanAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">{t('calculator.loan_amount')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-lg font-semibold text-gray-900">
                        R{Math.round(calculation.totalPayment).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">{t('calculator.total_payment')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-lg font-semibold text-gray-900">
                        R{Math.round(calculation.totalInterest).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">{t('calculator.total_interest')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-lg font-semibold text-gray-900">
                        {loanTerm} {t('calculator.years')}
                      </div>
                      <div className="text-sm text-gray-600">{t('calculator.loan_term')}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Affordability Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('calculator.affordability_status')}</h2>
              
              <div className={`bg-${status.color}-50 border border-${status.color}-200 rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-lg font-bold text-${status.color}-600`}>{status.text}</div>
                    <div className="text-sm text-gray-600">{status.description}</div>
                  </div>
                  <div className={`text-2xl font-bold text-${status.color}-600`}>
                    {affordabilityRatio.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('calculator.monthly_income')}:</span>
                  <span className="font-semibold">R{monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('calculator.monthly_expenses')}:</span>
                  <span className="font-semibold text-red-600">-R{monthlyExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('calculator.mortgage_payment')}:</span>
                  <span className="font-semibold text-red-600">
                    -R{calculation ? Math.round(calculation.monthlyPayment).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{t('calculator.disposable_income')}:</span>
                    <span className={`font-bold ${disposableIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R{Math.round(disposableIncome).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">{t('calculator.banking_guidelines')}</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {t('calculator.mortgage_not_exceed')}</li>
                  <li>• {t('calculator.banks_require_deposit')}</li>
                  <li>• {t('calculator.good_credit_improves')}</li>
                  <li>• {t('calculator.consider_additional_costs')}</li>
                </ul>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('calculator.additional_purchase_costs')}</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('calculator.transfer_fees_approx')}:</span>
                  <span className="font-semibold">R{Math.round(propertyPrice * 0.01).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('calculator.bond_registration')}:</span>
                  <span className="font-semibold">R{Math.round(calculation?.loanAmount ? calculation.loanAmount * 0.005 : 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('calculator.attorney_fees')}:</span>
                  <span className="font-semibold">R15,000 - R25,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('calculator.home_insurance_monthly')}:</span>
                  <span className="font-semibold">R800 - R2,000</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{t('calculator.estimated_total_additional')}:</span>
                    <span className="font-bold text-gray-900">
                      R{Math.round(propertyPrice * 0.015 + 20000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Get Pre-Approved CTA */}
        <div className="mt-12 bg-green-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t('calculator.ready_get_preapproved')}</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            {t('calculator.take_next_step')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              {t('calculator.find_mortgage_advisor')}
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-green-600 transition-colors">
              {t('calculator.download_calculation_report')}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}