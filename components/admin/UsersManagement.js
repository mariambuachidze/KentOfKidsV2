// components/UsersManagement.js
"use client";
import { useState, useEffect } from 'react';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Kullanıcılar alınamadı');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Kullanıcı silinemedi');
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const updateUserRole = async (id, isAdmin) => {
    try {
      const response = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_admin: isAdmin }),
      });
      if (!response.ok) throw new Error('Kullanıcı rolü güncellenemedi');
      setUsers(users.map(user => user.id === id ? { ...user, is_admin: isAdmin } : user));
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">Kullanıcılar yükleniyor...</div>;
  if (error) return <div className="text-red-500">Hata: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Kullanıcı Yönetimi</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Ad</th>
              <th className="py-2 px-4 border-b text-left">Soyad</th>
              <th className="py-2 px-4 border-b text-left">E-posta</th>
              <th className="py-2 px-4 border-b text-left">Telefon</th>
              <th className="py-2 px-4 border-b text-left">Rol</th>
              <th className="py-2 px-4 border-b text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.surname}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.phone_number}</td>
                <td className="py-2 px-4 border-b">
                  {editingUser === user.id ? (
                    <select 
                      className="border rounded p-1"
                      defaultValue={user.is_admin ? 'admin' : 'user'}
                      onChange={(e) => updateUserRole(user.id, e.target.value === 'admin')}
                    >
                      <option value="user">Kullanıcı</option>
                      <option value="admin">Yönetici</option>
                    </select>
                  ) : (
                    <span>{user.is_admin ? 'Yönetici' : 'Kullanıcı'}</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editingUser === user.id ? (
                    <button 
                      onClick={() => setEditingUser(null)}
                      className="text-gray-600 mr-2"
                    >
                      Vazgeç
                    </button>
                  ) : (
                    <button 
                      onClick={() => setEditingUser(user.id)}
                      className="text-blue-600 mr-2"
                    >
                      Rolü Düzenle
                    </button>
                  )}
                  <button 
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
