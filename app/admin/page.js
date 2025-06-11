// components/AdminPanel.js
"use client";
import { useState } from 'react';
import Link from 'next/link';
import UsersManagement from '@/components/admin/UsersManagement';
import ProductsManagement from '@/components/admin/ProductsManagement';
import CommentsManagement from '@/components/admin/CommentsManagement';
import AppointmentsManagement from '@/components/admin/AppointmentsManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { key: 'users', label: 'Kullanıcılar', icon: '👥' },
    { key: 'products', label: 'Ürünler', icon: '📦' },
    { key: 'comments', label: 'Yorumlar', icon: '💬' },
    { key: 'appointments', label: 'Randevular', icon: '📅' },
    { key: 'categories', label: 'Kategoriler', icon: '🏷️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Yönetim Paneli
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link 
                href="/" 
                className="group px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>←</span>
                <span>Siteye Dön</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-2 mb-8">
          <nav className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group relative flex items-center space-x-3 px-6 py-4 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-semibold">{tab.label}</span>
                
                {/* Active indicator */}
                {activeTab === tab.key && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 min-h-[600px]">
          <div className="p-8">
            {/* Tab Content Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-xl">
                <span className="text-2xl">
                  {tabs.find(tab => tab.key === activeTab)?.icon}
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {tabs.find(tab => tab.key === activeTab)?.label} Yönetimi
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="transition-all duration-500 ease-in-out">
              {activeTab === 'users' && (
                <div className="animate-fadeIn">
                  <UsersManagement />
                </div>
              )}
              {activeTab === 'products' && (
                <div className="animate-fadeIn">
                  <ProductsManagement />
                </div>
              )}
              {activeTab === 'comments' && (
                <div className="animate-fadeIn">
                  <CommentsManagement />
                </div>
              )}
              {activeTab === 'appointments' && (
                <div className="animate-fadeIn">
                  <AppointmentsManagement />
                </div>
              )}
              {activeTab === 'categories' && (
                <div className="animate-fadeIn">
                  <CategoriesManagement />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}