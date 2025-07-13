"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface Disruption {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  location: { lat: number; lng: number };
  region: string;
  timestamp: string;
  affectedStores: number;
  estimatedImpact: string;
  status: 'active' | 'monitoring';
}

export default function DisruptionIntelligence() {
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [selectedDisruption, setSelectedDisruption] = useState<Disruption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisruptions = async () => {
      try {
        const response = await fetch('/api/disruption');
        const data = await response.json();
        setDisruptions(data.disruptions || []);
      } catch (error) {
        console.error('Failed to fetch disruptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisruptions();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchDisruptions, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-800';
      case 'medium': return 'text-orange-400 bg-orange-900/20 border-orange-800';
      case 'low': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weather': return '🌪️';
      case 'logistics': return '🚢';
      case 'supplier': return '🏭';
      default: return '⚠️';
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
    <div className="h-full flex flex-col space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Disruption Intelligence</h2>
          <p className="text-gray-400">Real-time monitoring of supply chain disruptions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-400">Live Monitoring</span>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2">
            <span className="text-sm text-white font-medium">{disruptions.length} Active Alerts</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'High Priority', count: disruptions.filter(d => d.severity === 'high').length, color: 'red' },
          { label: 'Medium Priority', count: disruptions.filter(d => d.severity === 'medium').length, color: 'orange' },
          { label: 'Low Priority', count: disruptions.filter(d => d.severity === 'low').length, color: 'yellow' },
          { label: 'Total Affected Stores', count: disruptions.reduce((sum, d) => sum + d.affectedStores, 0), color: 'blue' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111111] border border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.count}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                stat.color === 'red' ? 'bg-red-500' :
                stat.color === 'orange' ? 'bg-orange-500' :
                stat.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Disruption Cards */}
        <div className="lg:col-span-7">
          <div className="bg-[#111111] border border-gray-800 rounded-xl h-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Active Disruptions</h3>
              <p className="text-gray-400 text-sm mt-1">Click on any card to view detailed information</p>
            </div>
            
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {disruptions.map((disruption) => (
                <motion.div
                  key={disruption.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-gray-600 ${
                    selectedDisruption?.id === disruption.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedDisruption(disruption)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="text-3xl">{getTypeIcon(disruption.type)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getSeverityColor(disruption.severity)}`}>
                            {disruption.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-400">{disruption.region}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${disruption.status === 'active' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      </div>
                      
                      <h4 className="text-white font-semibold mb-2 line-clamp-1">{disruption.title}</h4>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{disruption.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-300">{new Date(disruption.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-300">{disruption.estimatedImpact}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-300">{disruption.affectedStores} stores</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Map */}
        <div className="lg:col-span-5">
          <div className="bg-[#111111] border border-gray-800 rounded-xl h-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Regional Impact Map</h3>
              <p className="text-gray-400 text-sm mt-1">Geographic distribution of disruptions</p>
            </div>
            
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                {/* Background grid pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="grid grid-cols-10 grid-rows-8 h-full w-full">
                    {Array.from({ length: 80 }).map((_, i) => (
                      <div key={i} className="border border-gray-600"></div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center text-gray-400 z-10">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-sm px-4 mt-2 opacity-75">Real-time disruption visualization</p>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-center space-x-6 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>High Risk</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>Medium Risk</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Low Risk</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced markers */}
                <div className="absolute inset-0">
                  {disruptions.map((disruption, index) => (
                    <motion.div
                      key={disruption.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`absolute w-4 h-4 rounded-full cursor-pointer shadow-lg ${
                        disruption.severity === 'high' ? 'bg-red-500 shadow-red-500/50' :
                        disruption.severity === 'medium' ? 'bg-orange-500 shadow-orange-500/50' : 'bg-yellow-500 shadow-yellow-500/50'
                      } animate-pulse hover:scale-150 transition-all duration-200`}
                      style={{
                        left: `${20 + (index * 15)}%`,
                        top: `${30 + (index * 12)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => setSelectedDisruption(disruption)}
                      title={disruption.title}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Disruption Details Modal */}
      {selectedDisruption && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDisruption(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{getTypeIcon(selectedDisruption.type)}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedDisruption.title}</h3>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getSeverityColor(selectedDisruption.severity)}`}>
                      {selectedDisruption.severity.toUpperCase()} PRIORITY
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${selectedDisruption.status === 'active' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-sm text-gray-400 capitalize">{selectedDisruption.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDisruption(null)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Description */}
            <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-gray-700 rounded-xl p-6 mb-8">
              <h4 className="text-white font-semibold mb-3 text-lg">Description</h4>
              <p className="text-gray-300 leading-relaxed">{selectedDisruption.description}</p>
            </div>
            
            {/* Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h5 className="text-white font-semibold text-lg mb-4">Impact Details</h5>
                
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-400 font-medium">Region</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{selectedDisruption.region}</p>
                </div>
                
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M9 15h2" />
                    </svg>
                    <span className="text-gray-400 font-medium">Affected Stores</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{selectedDisruption.affectedStores} locations</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h5 className="text-white font-semibold text-lg mb-4">Financial Impact</h5>
                
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <span className="text-gray-400 font-medium">Estimated Loss</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{selectedDisruption.estimatedImpact}</p>
                </div>
                
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-400 font-medium">Duration</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{Math.floor((Date.now() - new Date(selectedDisruption.timestamp).getTime()) / (1000 * 60))} minutes</p>
                    <p className="text-gray-400 text-sm mt-1">Since {new Date(selectedDisruption.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl">
                Create Action Plan
              </button>
              <button className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-4 rounded-xl transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl">
                Generate Report
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
