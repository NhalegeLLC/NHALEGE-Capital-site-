import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Marcus Johnson",
      role: "Tech Entrepreneur",
      image: "https://images.unsplash.com/photo-1508243529287-e21914733111",
      quote: "I invested in more than my future — I invested in knowledge. Nhalege helped me grow my money and my mindset.",
      rating: 5
    },
    {
      name: "Aisha Williams",
      role: "Real Estate Investor",
      image: "https://images.pexels.com/photos/7533332/pexels-photo-7533332.jpeg",
      quote: "The dashboard made me feel like I finally had control over my financial journey.",
      rating: 5
    },
    {
      name: "Kwame Davis",
      role: "Business Owner",
      image: "https://images.pexels.com/photos/14917486/pexels-photo-14917486.jpeg",
      quote: "Nhalege isn't just a fund — it's a revolution. I got ROI and the blueprint for legacy.",
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-obsidian-950 to-obsidian-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our <span className="gradient-text">Contributors</span> Say
          </h2>
          <p className="text-xl text-platinum-300 max-w-3xl mx-auto">
            Real stories from real people building real wealth through Nhalege Private Capital.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="glass-dark p-8 rounded-2xl hover:scale-105 transition-transform duration-300 group"
              whileHover={{ y: -10 }}
            >
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gold-400"
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-obsidian-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-platinum-400 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-gold-400" />
                ))}
              </div>

              <blockquote className="text-platinum-200 text-lg leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>

              <div className="mt-6 pt-6 border-t border-platinum-700">
                <div className="flex items-center justify-between text-sm text-platinum-400">
                  <span>Verified Contributor</span>
                  <span className="text-gold-400 font-semibold">+{150 + index * 25}% Returns</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="glass p-6 rounded-2xl inline-block">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">4.9/5</div>
                <div className="text-sm text-platinum-400">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-platinum-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">500+</div>
                <div className="text-sm text-platinum-400">Success Stories</div>
              </div>
              <div className="w-px h-12 bg-platinum-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">$2M+</div>
                <div className="text-sm text-platinum-400">Profits Generated</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;