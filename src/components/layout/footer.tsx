import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ELIZA WebApp
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Powered by ELIZA Framework
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
