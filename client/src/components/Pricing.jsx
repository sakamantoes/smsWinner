// src/components/Pricing.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: 'month',
    features: ['50 Virtual Numbers', 'Basic SMS Verification', 'Email Support', '5 Countries'],
    popular: false,
  },
  {
    name: 'Premium',
    price: '$99',
    period: 'month',
    features: ['500 Virtual Numbers', 'Advanced SMS Verification', 'Priority Support', '30+ Countries', 'Google Voice Setup'],
    popular: true,
  },
  {
    name: 'Business',
    price: '$299',
    period: 'month',
    features: ['Unlimited Numbers', 'Enterprise API Access', '24/7 Dedicated Support', '150+ Countries', 'Custom Solutions'],
    popular: false,
  },
];

const PricingCard = ({ plan, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className={`glass-card rounded-2xl p-8 glow-border relative ${
      plan.popular ? 'border-red-500 shadow-lg shadow-red-500/20' : ''
    }`}
  >
    {plan.popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-700 px-4 py-1 rounded-full text-sm font-semibold">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
    <div className="mb-4">
      <span className="text-4xl font-bold text-red-500">{plan.price}</span>
      <span className="text-gray-400">/{plan.period}</span>
    </div>
    <ul className="space-y-3 mb-8">
      {plan.features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2 text-gray-300">
          <Check className="w-4 h-4 text-red-500" /> {feature}
        </li>
      ))}
    </ul>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-3 rounded-lg font-semibold transition-all ${
        plan.popular
          ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30'
          : 'glass-card border border-red-500/30 text-white hover:bg-red-500/10'
      }`}
    >
      Get Started
    </motion.button>
  </motion.div>
);

const Pricing = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-red-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Flexible <span className="text-red-500">Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your needs
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;