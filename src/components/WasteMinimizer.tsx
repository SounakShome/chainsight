"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  TrendingDown, 
  AlertTriangle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

interface WasteItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  location: string;
  currentStock: number;
  expiryDate: string;
  daysUntilExpiry: number;
  costPerUnit: number;
  totalValue: number;
  recommendations: Array<{
    action: string;
    discount?: number;
    expectedSales: number;
    estimatedRevenue: number;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    transferCost?: number;
    targetStore?: string;
    bundleWith?: string;
    taxBenefit?: number;
    socialImpact?: string;
  }>;
  wasteRisk: 'critical' | 'high' | 'medium' | 'low';
  historicalWasteRate: number;
}

interface WasteSummary {
  totalItems: number;
  totalValue: number;
  criticalItems: number;
  expiringToday: number;
  potentialWasteValue: number;
  averageWasteRate: number;
  categoriesAffected: number;
}

export default function WasteMinimizer() {
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [summary, setSummary] = useState<WasteSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);

  const fetchWasteData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/waste');
      const data = await response.json();
      setWasteItems(data.items || []);
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to fetch waste data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchWasteData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-800';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-800';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-300 bg-red-900/30';
      case 'high': return 'text-orange-300 bg-orange-900/30';
      case 'medium': return 'text-yellow-300 bg-yellow-900/30';
      case 'low': return 'text-green-300 bg-green-900/30';
      default: return 'text-gray-300 bg-gray-900/30';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'markdown':
      case 'deep_markdown': return '💰';
      case 'transfer': return '🚚';
      case 'bundle_promotion': return '📦';
      case 'promotional_display': return '🎯';
      case 'donation': return '❤️';
      case 'staff_purchase_program': return '👥';
      default: return '⚡';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-800/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">Critical Items</p>
                <p className="text-3xl font-bold text-white mt-1">{summary.criticalItems}</p>
                <p className="text-red-400 text-sm mt-1">Immediate action needed</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border border-orange-800/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Expiring Today</p>
                <p className="text-3xl font-bold text-white mt-1">{summary.expiringToday}</p>
                <p className="text-orange-400 text-sm mt-1">Within 24 hours</p>
              </div>
              <Clock className="h-12 w-12 text-orange-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold text-white mt-1">
                  ${(summary.totalValue / 1000).toFixed(0)}K
                </p>
                <p className="text-blue-400 text-sm mt-1">At-risk inventory</p>
              </div>
              <DollarSign className="h-12 w-12 text-blue-400" />
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
                  ${(summary.potentialWasteValue / 1000).toFixed(0)}K
                </p>
                <p className="text-green-400 text-sm mt-1">Waste prevention</p>
              </div>
              <TrendingDown className="h-12 w-12 text-green-400" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Perishable Inventory</h3>
          <button
            onClick={fetchWasteData}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Waste Items Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden"
      >
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-base font-semibold text-white">Perishable Inventory</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {wasteItems.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{item.productName}</h4>
                    <p className="text-gray-400 text-xs">{item.sku}</p>
                    <span className="inline-block px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded mt-1">
                      {item.category}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getRiskColor(item.wasteRisk)} ml-2`}>
                    {item.wasteRisk.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <p className="text-gray-400">Location</p>
                    <p className="text-white">{item.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Stock</p>
                    <p className="text-white">{item.currentStock} units</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Expires</p>
                    <p className="text-white">{item.daysUntilExpiry} days</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Value</p>
                    <p className="text-white">${item.totalValue.toLocaleString()}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  <span>View Actions</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1a1a] border-b border-gray-800">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Product</th>
                <th className="text-left p-4 text-gray-300 font-medium">Location</th>
                <th className="text-left p-4 text-gray-300 font-medium">Stock</th>
                <th className="text-left p-4 text-gray-300 font-medium">Expires</th>
                <th className="text-left p-4 text-gray-300 font-medium">Value</th>
                <th className="text-left p-4 text-gray-300 font-medium">Risk</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wasteItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{item.productName}</p>
                      <p className="text-gray-400 text-sm">{item.sku}</p>
                      <span className="inline-block px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded mt-1">
                        {item.category}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-300 text-sm">{item.location}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{item.currentStock}</p>
                    <p className="text-gray-400 text-sm">units</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{new Date(item.expiryDate).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-sm">{item.daysUntilExpiry} days</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white">${item.totalValue.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">${item.costPerUnit}/unit</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getRiskColor(item.wasteRisk)}`}>
                      {item.wasteRisk.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Item Details Modal */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111111] border border-gray-800 rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Action Recommendations</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <h4 className="text-white font-medium mb-2">{selectedItem.productName}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Location</p>
                    <p className="text-white">{selectedItem.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Current Stock</p>
                    <p className="text-white">{selectedItem.currentStock} units</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Days Until Expiry</p>
                    <p className="text-white">{selectedItem.daysUntilExpiry} days</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Value</p>
                    <p className="text-white">${selectedItem.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Recommended Actions</h4>
                <div className="space-y-3">
                  {selectedItem.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-[#1a1a1a] border border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getActionIcon(rec.action)}</span>
                          <span className="text-white font-medium capitalize">
                            {rec.action.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Expected Sales</p>
                          <p className="text-white">{rec.expectedSales} units</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Estimated Revenue</p>
                          <p className="text-white">${rec.estimatedRevenue.toLocaleString()}</p>
                        </div>
                        {rec.discount && (
                          <div>
                            <p className="text-gray-400">Discount</p>
                            <p className="text-white">{rec.discount}%</p>
                          </div>
                        )}
                        {rec.targetStore && (
                          <div>
                            <p className="text-gray-400">Transfer To</p>
                            <p className="text-white">{rec.targetStore}</p>
                          </div>
                        )}
                        {rec.bundleWith && (
                          <div>
                            <p className="text-gray-400">Bundle With</p>
                            <p className="text-white">{rec.bundleWith}</p>
                          </div>
                        )}
                        {rec.socialImpact && (
                          <div>
                            <p className="text-gray-400">Social Impact</p>
                            <p className="text-white">{rec.socialImpact}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
