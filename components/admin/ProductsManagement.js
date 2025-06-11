// components/ProductsManagement.js
"use client";
import { useState, useEffect } from 'react';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    stock: { quantity: 0 }
  });

  // Güvenli fiyat formatlaması - ana sayfadaki gibi
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (!response.ok) throw new Error('Ürünler alınamadı');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Kategoriler alınamadı');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setCurrentProduct({
        ...currentProduct,
        stock: { ...currentProduct.stock, quantity: parseInt(value) || 0 }
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: name === 'price' ? value : value // price'ı string olarak tutuyoruz, submit sırasında parse edeceğiz
      });
    }
  };

  const openCreateModal = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category_id: '',
      stock: { quantity: 0 }
    });
    setFormMode('create');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct({
      ...product,
      category_id: product.category_id ? product.category_id.toString() : '',
      price: product.price ? product.price.toString() : '0',
      stock: product.stock || { quantity: 0 }
    });
    setFormMode('edit');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formMode === 'create' ? 'POST' : 'PUT';
      const url = formMode === 'create'
        ? '/api/admin/products'
        : `/api/admin/products/${currentProduct.id}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentProduct.name,
          description: currentProduct.description,
          image_url: currentProduct.image_url,
          category_id: parseInt(currentProduct.category_id) || 0,
          price: parseFloat(currentProduct.price) || 0,
          quantity: currentProduct.stock?.quantity ?? 0
        }),
      });

      if (!response.ok) throw new Error(`Ürün ${formMode === 'create' ? 'eklenemedi' : 'güncellenemedi'}`);

      fetchProducts();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Ürün silinemedi');
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="text-center">Ürünler yükleniyor...</div>;
  if (error) return <div className="text-red-500">Hata: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ürün Yönetimi</h2>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Yeni Ürün Ekle
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Görsel</th>
              <th className="py-2 px-4 border-b text-left">Ürün Adı</th>
              <th className="py-2 px-4 border-b text-left">Kategori</th>
              <th className="py-2 px-4 border-b text-left">Fiyat</th>
              <th className="py-2 px-4 border-b text-left">Stok</th>
              <th className="py-2 px-4 border-b text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{product.id}</td>
                <td className="py-2 px-4 border-b">
                  <img
                    src={product.image_url || "/placeholder.jpg"}
                    alt={product.name || "Ürün"}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4 border-b">{product.name || "Ürün Adı"}</td>
                <td className="py-2 px-4 border-b">{product.category?.name || "Kategori"}</td>
                <td className="py-2 px-4 border-b">₺{formatPrice(product.price)}</td>
                <td className="py-2 px-4 border-b">{product.stock?.quantity || 0}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ürün Ekle/Düzenle Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {formMode === 'create' ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                  <input
                    type="text"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    name="category_id"
                    value={currentProduct.category_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat</label>
                  <input
                    type="number"
                    name="price"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok Adedi</label>
                  <input
                    type="number"
                    name="quantity"
                    value={currentProduct.stock?.quantity || 0}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={currentProduct.image_url}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    name="description"
                    value={currentProduct.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border text-gray-700 rounded hover:bg-gray-100"
                >
                  İptal
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