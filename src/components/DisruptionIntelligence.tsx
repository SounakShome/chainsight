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
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Map View */}
      <div className="flex-1 bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
        <div className="h-full min-h-[400px] relative">
          {/* Fallback map placeholder since Mapbox token is needed */}
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
            <div className="text-center text-gray-400">
              <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Map View</p>
              <p className="text-sm">Mapbox integration would show disruption locations here</p>
            </div>
            
            {/* Simulated markers */}
            <div className="absolute inset-0">
              {disruptions.map((disruption, index) => (
                <div
                  key={disruption.id}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ${
                    disruption.severity === 'high' ? 'bg-red-500' :
                    disruption.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                  } animate-pulse`}
                  style={{
                    left: `${20 + (index * 15)}%`,
                    top: `${30 + (index * 10)}%`
                  }}
                  onClick={() => setSelectedDisruption(disruption)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disruption List */}
      <div className="w-full lg:w-96 bg-[#111111] border border-gray-800 rounded-xl">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Active Disruptions</h3>
          <p className="text-gray-400 text-sm mt-1">{disruptions.length} total alerts</p>
        </div>
        
        <div className="overflow-y-auto max-h-[600px]">
          {disruptions.map((disruption) => (
            <motion.div
              key={disruption.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-[#1a1a1a] transition-colors ${
                selectedDisruption?.id === disruption.id ? 'bg-[#1a1a1a]' : ''
              }`}
              onClick={() => setSelectedDisruption(disruption)}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getTypeIcon(disruption.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(disruption.severity)}`}>
                      {disruption.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{disruption.region}</span>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">{disruption.title}</h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{disruption.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(disruption.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{disruption.estimatedImpact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disruption Details Modal */}
      {selectedDisruption && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDisruption(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111111] border border-gray-800 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Disruption Details</h3>
              <button
                onClick={() => setSelectedDisruption(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon(selectedDisruption.type)}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(selectedDisruption.severity)}`}>
                  {selectedDisruption.severity.toUpperCase()}
                </span>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">{selectedDisruption.title}</h4>
                <p className="text-gray-400 text-sm">{selectedDisruption.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Region</p>
                  <p className="text-white">{selectedDisruption.region}</p>
                </div>
                <div>
                  <p className="text-gray-400">Affected Stores</p>
                  <p className="text-white">{selectedDisruption.affectedStores}</p>
                </div>
                <div>
                  <p className="text-gray-400">Estimated Impact</p>
                  <p className="text-white">{selectedDisruption.estimatedImpact}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className="text-white capitalize">{selectedDisruption.status}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-400">
                  Last updated: {new Date(selectedDisruption.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
