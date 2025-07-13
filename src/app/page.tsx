"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
          <span className="text-xl sm:text-2xl font-bold text-white">ChainSight</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-6 sm:py-2 rounded-lg transition-colors text-sm sm:text-base">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-6 sm:py-2 rounded-lg transition-colors inline-flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
            >
              <span>Dashboard</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Walmart <span className="text-blue-400">ChainSight</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4">
            Advanced Supply Chain Intelligence Dashboard powered by AI
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-12 px-2">
            Real-time disruption detection • Smart demand forecasting • Perishable waste minimization
          </p>
          
          <SignedOut>
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            </Link>
          </SignedIn>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-20 max-w-6xl px-4"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700">
            <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-red-400 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Disruption Intelligence</h3>
            <p className="text-sm sm:text-base text-gray-400">
              Real-time monitoring of weather, logistics, and supplier disruptions with intelligent alerts and impact assessment.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700">
            <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Demand Forecast</h3>
            <p className="text-sm sm:text-base text-gray-400">
              AI-powered SKU-level demand prediction with regional insights and inventory optimization recommendations.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700">
            <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Waste Minimizer</h3>
            <p className="text-sm sm:text-base text-gray-400">
              Smart perishable inventory management with automated markdown and redistribution suggestions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
