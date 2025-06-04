import React from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  AcademicCapIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

const ProcessTimeline = () => {
  const steps = [
    {
      icon: CurrencyDollarIcon,
      title: "Contribute Capital",
      description: "Start with as little as $500. Your investment is immediately deployed across our diversified portfolio of real estate, startups, and market opportunities.",
      image: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35",
      color: "from-gold-400 to-gold-600"
    },
    {
      icon: ChartBarIcon,
      title: "Watch It Grow",
      description: "Track your portfolio performance in real-time with monthly updates, transparent reporting, and detailed analytics through your personal dashboard.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      color: "from-royal-400 to-royal-600"
    },
    {
      icon: AcademicCapIcon,
      title: "Access Masterclass Lessons",
      description: "Unlock exclusive wealth education content based on your investment tier. Learn from industry experts and successful entrepreneurs.",
      image: "https://images.unsplash.com/photo-1640160186315-838b53fcabc6",
      color: "from-platinum-400 to-platinum-600"
    },
    {
      icon: ArrowPathIcon,
      title: "Withdraw, Reinvest, or Fund Other Ventures",
      description: "Flexible options to withdraw profits, compound your returns, or direct funds toward new opportunities as they arise.",
      image: "https://images.unsplash.com/photo-1488229297570-58520851e868",
      color: "from-gold-400 to-royal-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-6 bg-obsidian-900 relative overflow-hidden">
      <div className="absolute inset-0 hero-pattern opacity-30"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="gradient-text">It Works</span>
          </h2>
          <p className="text-xl text-platinum-300 max-w-3xl mx-auto">
            A simple, transparent process designed to maximize your wealth while expanding your knowledge.
          </p>
        </motion.div>

        <motion.div
          className="space-y-16 md:space-y-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={stepVariants}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-platinum-600">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold">{step.title}</h3>
                
                <p className="text-lg text-platinum-300 leading-relaxed">
                  {step.description}
                </p>

                <div className="flex items-center gap-2 text-gold-400">
                  <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Active Process</span>
                </div>
              </div>

              {/* Visual */}
              <motion.div
                className="flex-1 max-w-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <div className="glass-dark p-8 rounded-3xl">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                    
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-obsidian-900 font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 mt-8">
                      <div className="w-px h-16 bg-gradient-to-b from-gold-400 to-transparent"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="glass-dark p-8 rounded-3xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Ready to Start Your Journey?
            </h3>
            <p className="text-platinum-300 mb-6">
              Join hundreds of successful contributors who are building wealth and gaining knowledge through Nhalege Private Capital.
            </p>
            <button className="btn-primary px-8 py-4 rounded-xl font-semibold">
              Begin Your Investment Journey
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessTimeline;