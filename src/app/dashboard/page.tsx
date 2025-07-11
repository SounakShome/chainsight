"use client";

import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Menu, 
  X,
  Home,
  Bell
} from 'lucide-react';
import DisruptionIntelligence from '@/components/DisruptionIntelligence';
import DemandForecast from '@/components/DemandForecast';
import WasteMinimizer from '@/components/WasteMinimizer';
import Overview from '@/components/Overview';

const navigation = [
  { name: 'Overview', icon: Home, id: 'overview' },
  { name: 'Disruption Intelligence', icon: AlertTriangle, id: 'disruption' },
  { name: 'Demand Forecast', icon: TrendingUp, id: 'forecast' },
  { name: 'Waste Minimizer', icon: Package, id: 'waste' },
];

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <Overview />;
      case 'disruption':
        return <DisruptionIntelligence />;
      case 'forecast':
        return <DemandForecast />;
      case 'waste':
        return <WasteMinimizer />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="h-screen flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-gray-800 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">ChainSight</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeView === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-[#111111] border-b border-gray-800 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-white">
                {navigation.find(nav => nav.id === activeView)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-400 hover:text-white">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderActiveView()}
          </motion.div>
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
