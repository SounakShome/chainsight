"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Search, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ForecastData {
  sku: string;
  region: string;
  data: {
    currentStock: number;
    forecast: Array<{ date: string; predicted: number; actual: number | null }>;
    historical: Array<{ date: string; predicted: number; actual: number }>;
    accuracy: number;
    trend: string;
    seasonality: string;
  };
}

const availableSkus = [
  'SKU-12345-Milk',
  'SKU-67890-Bread',
];

const availableRegions = [
  'California',
  'Texas',
  'Florida',
];

export default function DemandForecast() {
  const [selectedSku, setSelectedSku] = useState('SKU-12345-Milk');
  const [selectedRegion, setSelectedRegion] = useState('California');
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku: selectedSku,
          region: selectedRegion,
        }),
      });
      
      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadForecast = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/forecast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sku: selectedSku,
            region: selectedRegion,
          }),
        });
        
        const data = await response.json();
        setForecastData(data);
      } catch (error) {
        console.error('Failed to fetch forecast:', error);
      } finally {
        setLoading(false);
      }
    };

    loadForecast();
  }, [selectedSku, selectedRegion]);

  const generateChartData = () => {
    if (!forecastData) return null;

    const historical = forecastData.data.historical;
    const forecast = forecastData.data.forecast;
    
    const labels = [...historical.map(h => h.date), ...forecast.map(f => f.date)];
    const actualData = [...historical.map(h => h.actual), ...new Array(forecast.length).fill(null)];
    const predictedData = [...historical.map(h => h.predicted), ...forecast.map(f => f.predicted)];

    return {
      labels,
      datasets: [
        {
          label: 'Actual Demand',
          data: actualData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Predicted Demand',
          data: predictedData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
      title: {
        display: true,
        text: 'Demand Forecast',
        color: 'rgb(156, 163, 175)',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Forecast Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">SKU</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableSkus.map((sku) => (
                <option key={sku} value={sku}>
                  {sku}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchForecast}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>{loading ? 'Loading...' : 'Generate Forecast'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      {forecastData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Stock</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {forecastData.data.currentStock.toLocaleString()}
                </p>
                <p className="text-green-400 text-sm mt-1">Units available</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#111111] border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Forecast Accuracy</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {forecastData.data.accuracy}%
                </p>
                <p className="text-green-400 text-sm mt-1">Historical performance</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111111] border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Trend</p>
                <p className="text-2xl font-bold text-white mt-1 capitalize">
                  {forecastData.data.trend}
                </p>
                <p className="text-blue-400 text-sm mt-1 capitalize">
                  {forecastData.data.seasonality.replace('_', ' ')}
                </p>
              </div>
              {forecastData.data.trend === 'increasing' ? (
                <TrendingUp className="h-8 w-8 text-green-400" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-400" />
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#111111] border border-gray-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Demand Forecast Chart</h3>
        <div className="h-80">
          {forecastData && generateChartData() ? (
            <Line data={generateChartData()!} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              {loading ? (
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading forecast data...</p>
                </div>
              ) : (
                <p>Select SKU and region to view forecast</p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Insights */}
      {forecastData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#111111] border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
          <div className="space-y-3">
            <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
              <p className="text-blue-300 font-medium">Stock Recommendation</p>
              <p className="text-gray-300 text-sm mt-1">
                Current stock levels appear adequate for the next 3 days. Consider restocking by July 13th to avoid stockouts.
              </p>
            </div>
            
            <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
              <p className="text-green-300 font-medium">Seasonal Pattern</p>
              <p className="text-gray-300 text-sm mt-1">
                Demand typically increases by 15-20% during summer months. Current forecast reflects this seasonal adjustment.
              </p>
            </div>
            
            <div className="p-4 bg-orange-900/20 border border-orange-800/30 rounded-lg">
              <p className="text-orange-300 font-medium">Risk Alert</p>
              <p className="text-gray-300 text-sm mt-1">
                Forecast confidence may be affected by ongoing weather disruptions in the region. Monitor closely.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
