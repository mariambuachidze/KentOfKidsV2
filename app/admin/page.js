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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Yönetim Paneli</h1>
            </div>
            <div className="flex items-center">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Siteye Dön
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'users', label: 'Kullanıcılar' },
              { key: 'products', label: 'Ürünler' },
              { key: 'comments', label: 'Yorumlar' },
              { key: 'appointments', label: 'Randevular' },
              { key: 'categories', label: 'Kategoriler' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-6">
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'products' && <ProductsManagement />}
          {activeTab === 'comments' && <CommentsManagement />}
          {activeTab === 'appointments' && <AppointmentsManagement />}
          {activeTab === 'categories' && <CategoriesManagement />}
        </div>
      </div>
    </div>
  );
}
