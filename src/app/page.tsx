'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">ELIZA WebApp</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              ELIZA WebApp
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Erstellen, verwalten und testen Sie KI-Agenten mit dem ELIZA Framework
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Agents</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Erstellen und verwalten Sie KI-Agenten mit individuellen Charaktereigenschaften und speziellem Wissen.
                </p>
                <div className="mt-4">
                  <Link href="/agents">
                    <Button>Zu den Agents</Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Rooms</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Konfigurieren Sie Räume, in denen Ihre KI-Agenten miteinander interagieren können.
                </p>
                <div className="mt-4">
                  <Link href="/rooms">
                    <Button variant="outline">Demnächst verfügbar</Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">LIVE</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Beobachten Sie die Interaktionen Ihrer KI-Agenten in Echtzeit und greifen Sie bei Bedarf ein.
                </p>
                <div className="mt-4">
                  <Link href="/live">
                    <Button variant="outline">Demnächst verfügbar</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Über das ELIZA Framework</h3>
              <p className="text-sm text-gray-500 mb-3">
                ELIZA ist ein leistungsstarkes Multi-Agent-Simulationsframework, das entwickelt wurde, um autonome KI-Agenten zu erstellen, bereitzustellen und zu verwalten. Es bietet eine flexible und erweiterbare Plattform für die Entwicklung intelligenter Agenten, die über mehrere Plattformen hinweg interagieren können, während sie konsistente Persönlichkeiten und Wissen beibehalten.
              </p>
              <p className="text-sm text-gray-500">
                Diese WebApp nutzt die Funktionen des ELIZA Frameworks, um eine benutzerfreundliche Oberfläche für die Erstellung und Verwaltung von KI-Agenten bereitzustellen.
              </p>
            </div>
          </div>
        </div>
      </main>
      
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
    </div>
  );
}
