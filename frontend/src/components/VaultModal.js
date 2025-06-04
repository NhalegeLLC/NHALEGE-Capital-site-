// Vault-Themed Investment Application Modal
// Premium "unlocking the vault" experience for Inner Circle applications

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LockClosedIcon, 
  LockOpenIcon,
  ShieldCheckIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import InvestmentApplicationForm from './InvestmentApplicationForm';

const VaultModal = ({ isOpen, onClose, onSubmit }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Start the unlock sequence
      setTimeout(() => setIsUnlocking(true), 500);
      setTimeout(() => setIsUnlocked(true), 2000);
      setTimeout(() => setShowForm(true), 2500);
    } else {
      // Reset state when modal closes
      setIsUnlocking(false);
      setIsUnlocked(false);
      setShowForm(false);
    }
  }, [isOpen]);

  const vaultVariants = {
    locked: {
      scale: 1,
      rotate: 0,
      filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))'
    },
    unlocking: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.8))',
      transition: {
        duration: 1.5,
        rotate: {
          repeat: 2,
          duration: 0.3
        }
      }
    },
    unlocked: {
      scale: 1.2,
      rotate: 0,
      filter: 'drop-shadow(0 0 60px rgba(212, 175, 55, 1))',
      transition: {
        duration: 0.5
      }
    }
  };

  const backgroundVariants = {
    locked: {
      background: 'radial-gradient(circle, rgba(11, 11, 15, 0.95) 0%, rgba(11, 11, 15, 0.98) 100%)'
    },
    unlocking: {
      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(11, 11, 15, 0.95) 70%)',
      transition: { duration: 1.5 }
    },
    unlocked: {
      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(11, 11, 15, 0.9) 70%)',
      transition: { duration: 0.5 }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto"
        variants={backgroundVariants}
        initial="locked"
        animate={isUnlocked ? "unlocked" : isUnlocking ? "unlocking" : "locked"}
        exit="locked"
      >
        <div className="absolute inset-0 backdrop-blur-md" onClick={onClose} />
        
        {!showForm ? (
          // Vault Unlocking Animation
          <motion.div
            className="relative z-10 text-center max-w-md w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            {/* Vault Door Animation */}
            <motion.div
              className="w-32 h-32 mx-auto mb-8 relative"
              variants={vaultVariants}
              initial="locked"
              animate={isUnlocked ? "unlocked" : isUnlocking ? "unlocking" : "locked"}
            >
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-gold-400 bg-gradient-to-br from-gold-400/20 to-gold-600/40">
                {/* Inner Circle */}
                <div className="absolute inset-4 rounded-full border-2 border-gold-500 bg-gradient-to-br from-obsidian-800 to-obsidian-900 flex items-center justify-center">
                  {/* Lock Icon */}
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: isUnlocked ? 0 : 1,
                      opacity: isUnlocked ? 0 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <LockClosedIcon className="w-12 h-12 text-gold-400" />
                  </motion.div>
                  
                  {/* Unlocked Icon */}
                  <motion.div
                    className="absolute"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: isUnlocked ? 1 : 0,
                      opacity: isUnlocked ? 1 : 0
                    }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <LockOpenIcon className="w-12 h-12 text-green-400" />
                  </motion.div>
                </div>
              </div>
              
              {/* Spinning Rings */}
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className={`absolute inset-${ring * 2} rounded-full border border-gold-400/30`}
                  animate={{ 
                    rotate: isUnlocking ? 360 * ring : 0,
                    scale: isUnlocking ? [1, 1.1, 1] : 1
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: isUnlocking ? Infinity : 0,
                    ease: "linear"
                  }}
                />
              ))}
            </motion.div>

            {/* Status Text */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {!isUnlocking && (
                <motion.div>
                  <h2 className="text-3xl font-bold gradient-text mb-2">
                    Accessing Inner Circle
                  </h2>
                  <p className="text-platinum-300">
                    Preparing exclusive investment vault...
                  </p>
                </motion.div>
              )}
              
              {isUnlocking && !isUnlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-3xl font-bold text-gold-400 mb-2">
                    Unlocking Vault...
                  </h2>
                  <p className="text-platinum-300">
                    Verifying exclusive access credentials...
                  </p>
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-2 h-2 bg-gold-400 rounded-full"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 1,
                            repeat: Infinity,
                            delay: dot * 0.2
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {isUnlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-green-400 mb-2">
                    Vault Unlocked!
                  </h2>
                  <p className="text-platinum-300 mb-4">
                    Welcome to the Inner Circle
                  </p>
                  
                  {/* Success indicators */}
                  <div className="flex justify-center space-x-4 text-green-400">
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="w-5 h-5" />
                      <span className="text-sm">Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-5 h-5" />
                      <span className="text-sm">Elite Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="w-5 h-5" />
                      <span className="text-sm">$50M+ Deal Flow</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          // Investment Application Form
          <motion.div
            className="relative z-10 w-full max-w-4xl"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InvestmentApplicationForm
              onClose={onClose}
              onSubmit={onSubmit}
              vaultTheme={true}
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default VaultModal;