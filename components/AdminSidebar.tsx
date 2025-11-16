'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import {
  Users,
  Menu,
  Home,
  LogOut,
  FileCheck,
  Gift,
  Calendar,
  Banknote
} from 'lucide-react';

interface SidebarItem {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
}

interface AdminSidebarProps {
  currentPath?: string;
}

export default function AdminSidebar({ currentPath = '' }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      sessionStorage.removeItem('admin_session');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      sessionStorage.removeItem('admin_session');
      router.push('/admin/login');
    }
  };

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard', active: currentPath === '/admin/dashboard' },
    { icon: Users, label: 'Profiles', href: '/admin/profiles', active: currentPath === '/admin/profiles' },
    { icon: Gift, label: 'Packages', href: '/admin/packages', active: currentPath === '/admin/packages' },
    { icon: Banknote, label: 'Payments', href: '/admin/payments', active: currentPath === '/admin/payments' },
    { icon: Calendar, label: 'Event Registrations', href: '/admin/event-registrations', active: currentPath === '/admin/event-registrations' },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-humsafar-500 shadow-xl transition-all duration-300 flex flex-col`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-humsafar-500/30">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            <Menu className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-humsafar-500/20 text-white border border-humsafar-400/30'
                      : 'text-humsafar-100 hover:bg-humsafar-500/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-humsafar-500/30">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-red-200 hover:text-white hover:bg-[#ee406d]/20"
        >
          <LogOut className="h-5 w-5" />
          {sidebarOpen && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
}