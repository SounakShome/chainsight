"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#111111] border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
          <span className="text-xl sm:text-2xl font-bold text-white">ChainSight</span>
        </Link>
        
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
      </div>
    </nav>
  );
}
