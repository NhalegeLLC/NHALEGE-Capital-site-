import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalculatorIcon, ArrowTrendingUpIcon, SparklesIcon } from '@heroicons/react/24/outline';
import useIntegrations from '../hooks/useIntegrations';

const EnhancedROICalculator = ({ onCalculationComplete }) => {
  const [amount, setAmount] = useState(1000);
  const [term, setTerm] = useState(9);
  const [compound, setCompound] = useState(false);
  const [projectedReturn, setProjectedReturn] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const { trackROICalculation, trackUserJourney } = useIntegrations();

  const termOptions = [
    { months: 6, multiplier: 1.25, minInvestment: 500 },
    { months: 9, multiplier: 1.5, minInvestment: 1000 },
    { months: 12, multiplier: 2.0, minInvestment: 2000 }
  ];

  const calculateReturn = () => {
    setIsCalculating(true);
    
    const selectedTerm = termOptions.find(option => option.months === term);
    if (!selectedTerm || amount < selectedTerm.minInvestment) {
      setProjectedReturn(0);
      setIsCalculating(false);
      return;
    }

    // Simulate calculation delay for premium feel
    setTimeout(() => {
      let finalAmount = amount * selectedTerm.multiplier;
      
      if (compound) {
        // Add slight bonus for compound option
        finalAmount *= 1.05;
      }
      
      setProjectedReturn(finalAmount);
      setIsCalculating(false);
    }, 800);
  };

  useEffect(() => {
    calculateReturn();
  }, [amount, term, compound]);

  const selectedTerm = termOptions.find(option => option.months === term);
  const isValidAmount = selectedTerm && amount >= selectedTerm.minInvestment;
  const profit = projectedReturn - amount;
  const profitPercentage = amount > 0 ? ((profit / amount) * 100) : 0;

  const handleGetStarted = () => {
    if (onCalculationComplete && isValidAmount && projectedReturn > 0) {
      onCalculationComplete(amount, projectedReturn, term);
    }
  };

  return (
    <motion.div
      className="glass-dark p-8 rounded-3xl max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mr-4">
          <CalculatorIcon className="w-6 h-6 text-obsidian-900" />
        </div>
        <h3 className="text-2xl font-bold">Wealth Projection Calculator</h3>
      </div>

      <div className="space-y-8">
        {/* Investment Amount */}
        <div>
          <label className="block text-lg font-semibold mb-4">Investment Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold-400 text-xl font-bold">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-obsidian-800 border border-platinum-600 rounded-xl py-4 pl-8 pr-4 text-xl font-semibold text-white focus:border-gold-400 focus:outline-none transition-colors"
              min="500"
              step="100"
            />
          </div>
          {selectedTerm && amount < selectedTerm.minInvestment && (
            <p className="text-red-400 text-sm mt-2">
              Minimum investment for {term} months: ${selectedTerm.minInvestment.toLocaleString()}
            </p>
          )}
        </div>

        {/* Term Selection */}
        <div>
          <label className="block text-lg font-semibold mb-4">Investment Term</label>
          <div className="grid grid-cols-3 gap-4">
            {termOptions.map((option) => (
              <button
                key={option.months}
                onClick={() => setTerm(option.months)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  term === option.months
                    ? 'border-gold-400 bg-gold-400/10 text-gold-400'
                    : 'border-platinum-600 bg-obsidian-800 text-platinum-300 hover:border-platinum-400'
                }`}
              >
                <div className="text-lg font-bold">{option.months} Months</div>
                <div className="text-sm">{((option.multiplier - 1) * 100).toFixed(0)}% Return</div>
                <div className="text-xs">Min: ${option.minInvestment}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Compound Option */}
        <div className="flex items-center justify-between p-4 bg-obsidian-800 rounded-xl">
          <div>
            <div className="font-semibold">Compound Returns</div>
            <div className="text-sm text-platinum-400">Reinvest profits for bonus growth (+5%)</div>
          </div>
          <button
            onClick={() => setCompound(!compound)}
            className={`w-12 h-6 rounded-full transition-colors ${
              compound ? 'bg-gold-400' : 'bg-platinum-600'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                compound ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Results */}
        <motion.div
          className="bg-gradient-to-r from-gold-500/10 to-royal-500/10 p-6 rounded-2xl border border-gold-400/20"
          animate={{ scale: isCalculating ? 0.98 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <ArrowTrendingUpIcon className="w-6 h-6 text-gold-400 mr-2" />
            <h4 className="text-xl font-bold">Projected Returns</h4>
          </div>
          
          {isCalculating ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-platinum-300">Calculating your wealth potential...</p>
            </div>
          ) : isValidAmount ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-platinum-300">Initial Investment:</span>
                <span className="text-xl font-bold">${amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-platinum-300">Projected Value:</span>
                <span className="text-2xl font-bold text-gold-400">${projectedReturn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-platinum-300">Total Profit:</span>
                <span className="text-xl font-bold text-green-400">+${profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-platinum-300">Return Rate:</span>
                <span className="text-xl font-bold text-royal-400">{profitPercentage.toFixed(1)}%</span>
              </div>
              <div className="mt-6 p-4 bg-obsidian-800/50 rounded-xl">
                <p className="text-sm text-platinum-400 text-center">
                  In {term} months, your ${amount.toLocaleString()} investment could grow to{' '}
                  <span className="text-gold-400 font-semibold">${projectedReturn.toLocaleString()}</span> with our fixed yield structure.
                </p>
              </div>
              
              {/* Enhanced CTA Button */}
              <motion.button
                onClick={handleGetStarted}
                className="w-full btn-primary py-4 rounded-xl font-semibold text-lg mt-6 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gold-300 to-gold-500 opacity-0 group-hover:opacity-20 transition-opacity"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative flex items-center justify-center gap-3">
                  <SparklesIcon className="w-6 h-6" />
                  Start Building Your Legacy
                  <SparklesIcon className="w-6 h-6" />
                </span>
              </motion.button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-platinum-400">Please enter a valid investment amount to see projections.</p>
            </div>
          )}
        </motion.div>

        <div className="text-center">
          <p className="text-sm text-platinum-500">
            * All returns based on performance of diversified assets managed by Nhalege Capital.
            Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedROICalculator;