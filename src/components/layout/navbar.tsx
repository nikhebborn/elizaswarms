import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                ELIZA WebApp
              </Link>
            </div>
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href="/agents" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/agents') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Agents
              </Link>
              <Link 
                href="/rooms" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/rooms') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Rooms
              </Link>
              <Link 
                href="/live" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/live') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                LIVE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
