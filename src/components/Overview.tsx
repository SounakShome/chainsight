"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, DollarSign, Store } from 'lucide-react';

interface DisruptionSummary {
  total: number;
  active: number;
  totalAffectedStores: number;
  totalEstimatedImpact: number;
}

interface WasteSummary {
  totalItems: number;
  totalValue: number;
  criticalItems: number;
  expiringToday: number;
  potentialWasteValue: number;
}

export default function Overview() {
  const [disruptionData, setDisruptionData] = useState<DisruptionSummary | null>(null);
  const [wasteData, setWasteData] = useState<WasteSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [disruptionRes, wasteRes] = await Promise.all([
          fetch('/api/disruption'),
          fetch('/api/waste')
        ]);

        const disruptionResult = await disruptionRes.json();
        const wasteResult = await wasteRes.json();

        setDisruptionData(disruptionResult.summary);
        setWasteData(wasteResult.summary);
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Supply Chain Overview</h2>
        <p className="text-gray-400">Real-time insights across all operations</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-800/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm font-medium">Active Disruptions</p>
              <p className="text-3xl font-bold text-white mt-1">
                {disruptionData?.active || 0}
              </p>
              <p className="text-red-400 text-sm mt-1">
                {disruptionData?.totalAffectedStores || 0} stores affected
              </p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border border-orange-800/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm font-medium">Critical Waste Items</p>
              <p className="text-3xl font-bold text-white mt-1">
                {wasteData?.criticalItems || 0}
              </p>
              <p className="text-orange-400 text-sm mt-1">
                Expiring in 24 hours
              </p>
            </div>
            <Clock className="h-12 w-12 text-orange-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Potential Savings</p>
              <p className="text-3xl font-bold text-white mt-1">
                ${((wasteData?.potentialWasteValue || 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-green-400 text-sm mt-1">
                Waste reduction opportunity
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Total Impact</p>
              <p className="text-3xl font-bold text-white mt-1">
                ${((disruptionData?.totalEstimatedImpact || 0) / 1000000).toFixed(1)}M
              </p>
              <p className="text-blue-400 text-sm mt-1">
                Estimated disruption cost
              </p>
            </div>
            <Store className="h-12 w-12 text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#111111] border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 hover:bg-[#222222] transition-colors cursor-pointer">
            <AlertTriangle className="h-8 w-8 text-red-400 mb-2" />
            <h4 className="text-white font-medium mb-1">Review Critical Alerts</h4>
            <p className="text-gray-400 text-sm">Check high-priority disruptions requiring immediate attention</p>
          </div>
          
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 hover:bg-[#222222] transition-colors cursor-pointer">
            <Clock className="h-8 w-8 text-orange-400 mb-2" />
            <h4 className="text-white font-medium mb-1">Process Expiring Items</h4>
            <p className="text-gray-400 text-sm">Take action on perishables expiring within 24 hours</p>
          </div>
          
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 hover:bg-[#222222] transition-colors cursor-pointer">
            <DollarSign className="h-8 w-8 text-green-400 mb-2" />
            <h4 className="text-white font-medium mb-1">Optimize Inventory</h4>
            <p className="text-gray-400 text-sm">Run demand forecasts to optimize stock levels</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#111111] border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-[#1a1a1a] rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">Hurricane warning detected in Southeast region</p>
              <p className="text-gray-400 text-xs">2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-[#1a1a1a] rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">145 units of organic spinach expiring in 2 days</p>
              <p className="text-gray-400 text-xs">15 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-[#1a1a1a] rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">Demand forecast updated for SKU-12345-Milk in California</p>
              <p className="text-gray-400 text-xs">1 hour ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
