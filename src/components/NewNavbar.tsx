"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#111111] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">ChainSight</span>
        </Link>
        
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
      </div>
    </nav>
  );
}
