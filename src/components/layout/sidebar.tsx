import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  section: 'agents' | 'rooms' | 'live';
}

export function Sidebar({ section }: SidebarProps) {
  const pathname = usePathname();
  
  const agentLinks = [
    { href: '/agents', label: 'Alle Agents' },
    { href: '/agents/create', label: 'Agent erstellen' },
  ];
  
  const roomLinks = [
    { href: '/rooms', label: 'Alle Räume' },
    { href: '/rooms/create', label: 'Raum erstellen' },
  ];
  
  const liveLinks = [
    { href: '/live', label: 'Live-Übersicht' },
  ];
  
  const links = section === 'agents' 
    ? agentLinks 
    : section === 'rooms' 
      ? roomLinks 
      : liveLinks;
  
  const sectionTitle = section === 'agents' 
    ? 'Agents' 
    : section === 'rooms' 
      ? 'Räume' 
      : 'LIVE';
  
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{sectionTitle}</h2>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                block px-3 py-2 rounded-md text-sm font-medium
                ${pathname === link.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
