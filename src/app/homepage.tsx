"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">ChainSight</span>
        </div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <span>Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-6xl font-bold text-white mb-6">
            Walmart <span className="text-blue-400">ChainSight</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Advanced Supply Chain Intelligence Dashboard powered by AI
          </p>
          <p className="text-lg text-gray-400 mb-12">
            Real-time disruption detection • Smart demand forecasting • Perishable waste minimization
          </p>
          
          <SignedOut>
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </SignedIn>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
            <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Disruption Intelligence</h3>
            <p className="text-gray-400">
              Real-time monitoring of weather, logistics, and supplier disruptions with intelligent alerts and impact assessment.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
            <TrendingUp className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Demand Forecast</h3>
            <p className="text-gray-400">
              AI-powered SKU-level demand prediction with regional insights and inventory optimization recommendations.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
            <BarChart3 className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Waste Minimizer</h3>
            <p className="text-gray-400">
              Smart perishable inventory management with automated markdown and redistribution suggestions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
