'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

// Bu bileşen, ürünleri listelemek ve filtrelemek için kullanılır
export default function ProductList({ products, categories }) {
  // State tanımlamaları
  const [selectedCategory, setSelectedCategory] = useState('all'); // Seçili kategori - varsayılan olarak 'tümü'
  const [sortBy, setSortBy] = useState('name'); // Sıralama kriteri - varsayılan olarak 'isim'

  // Kategori filtrelemesi
  // Eğer 'tümü' seçildiyse bütün ürünleri göster, değilse seçilen kategoriye göre filtrele
  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category_id === parseInt(selectedCategory)
  );

  // Ürünleri seçilen kritere göre sırala
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name); // İsme göre alfabetik sıralama
    } else if (sortBy === 'price-low') {
      return a.price - b.price; // Fiyata göre artan sıralama
    } else if (sortBy === 'price-high') {
      return b.price - a.price; // Fiyata göre azalan sıralama
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Filtre ve sıralama kontrolleri */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Kategori filtresi bileşeni */}
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onChange={setSelectedCategory} 
        />
        
        {/* Sıralama seçenekleri */}
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="name">Ürün Adı (A-Z)</option>
            <option value="price-low">Ürün Fiyatı (En düşük fiyat)</option>
            <option value="price-high">Ürün Fiyatı (En yüksek fiyat)</option>
          </select>
        </div>
      </div>

      {/* Ürün listesi görüntüleme */}
      {sortedProducts.length > 0 ? (
        // Ürünler varsa grid layoutta göster
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        // Ürün yoksa uyarı mesajı göster
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Bu kategoride ürün bulunmamaktadır</p>
        </div>
      )}
    </div>
  );
}