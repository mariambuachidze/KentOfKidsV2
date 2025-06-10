'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function CommentForm({ productId }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (rating === 0) {
      setError('Lütfen bir puan seçin.');
      return;
    }

    if (!title.trim()) {
      setError('Lütfen yorum başlığı girin.');
      return;
    }

    if (!description.trim()) {
      setError('Lütfen yorum açıklaması girin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userId: session.user.id,
          title,
          description,
          rating,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTitle('');
        setDescription('');
        setRating(0);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || 'Yorum gönderilemedi.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Yorum yapmak ister misiniz?</h3>
        <p className="text-gray-600 mb-4">Bu ürün için yorum yapabilmek için giriş yapmalısınız.</p>
        <Link href="/login" className="btn btn-primary">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
        <h3 className="text-lg font-medium text-green-700 mb-2">Teşekkürler!</h3>
        <p className="text-green-600">Yorumunuz başarıyla gönderildi.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Yorum Yap</h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Puan</label>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <button
                  type="button"
                  key={ratingValue}
                  className={`text-2xl cursor-pointer focus:outline-none ${
                    (hover || rating) >= ratingValue ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  <FaStar />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block mb-2 font-medium">
            Başlık
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Deneyiminizi özetleyin"
            className="input-field"
            maxLength={50}
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 font-medium">
            Yorum
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
            className="input-field min-h-[120px]"
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
        </button>
      </form>
    </div>
  );
}
