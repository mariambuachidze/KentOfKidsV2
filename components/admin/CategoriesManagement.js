// components/CategoriesManagement.js
"use client";
import { useState, useEffect } from 'react';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [currentCategory, setCurrentCategory] = useState({ name: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Kategoriler alınamadı');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const openCreateModal = () => {
    setCurrentCategory({ name: '' });
    setFormMode('create');
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setCurrentCategory({ ...category });
    setFormMode('edit');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formMode === 'create' ? 'POST' : 'PUT';
      const url = formMode === 'create'
        ? '/api/admin/categories'
        : `/api/admin/categories/${currentCategory.id}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCategory),
      });

      if (!response.ok) throw new Error(`Kategori ${formMode === 'create' ? 'eklenemedi' : 'güncellenemedi'}`);

      fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem ilgili tüm ürünleri etkiler.')) {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Kategori silinemedi');
        setCategories(categories.filter(c => c.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="text-center">Kategoriler yükleniyor...</div>;
  if (error) return <div className="text-red-500">Hata: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Kategori Yönetimi</h2>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Yeni Kategori Ekle
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">İsim</th>
              <th className="py-2 px-4 border-b text-left">Ürün Sayısı</th>
              <th className="py-2 px-4 border-b text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{category.id}</td>
                <td className="py-2 px-4 border-b">{category.name}</td>
                <td className="py-2 px-4 border-b">{category.products?.length || 0}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => openEditModal(category)} className="text-blue-600 mr-2">Düzenle</button>
                  <button onClick={() => deleteCategory(category.id)} className="text-red-600">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {formMode === 'create' ? 'Yeni Kategori Ekle' : 'Kategoriyi Düzenle'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border text-gray-700 rounded hover:bg-gray-100"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  {formMode === 'create' ? 'Ekle' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
