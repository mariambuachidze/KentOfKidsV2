'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AppointmentForm() {
  const { data: session, status } = useSession();
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = format(tomorrow, 'yyyy-MM-dd');

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!description.trim()) {
      setError('Lütfen randevunuz için bir açıklama girin.');
      return;
    }

    if (!date) {
      setError('Lütfen bir tarih seçin.');
      return;
    }

    if (!time) {
      setError('Lütfen bir saat seçin.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!session || !session.user || !session.user.id) {
        setError('Lütfen giriş yapın.');
        return;
      }

      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      const appointmentDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
      const timeDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

      const response = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          date: appointmentDate.toISOString(),
          time: timeDate.toISOString()
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setDescription('');
        setDate('');
        setTime('');
      } else {
        const data = await response.json();
        setError(data.message || data.error || 'Randevu alınamadı.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center max-w-xl mx-auto my-8">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center max-w-xl mx-auto my-8">
        <h3 className="text-lg font-medium mb-2">Randevu almak ister misiniz?</h3>
        <p className="text-gray-600 mb-4">Lütfen randevu oluşturmak için giriş yapın.</p>
        <Link href="/login" className="btn btn-primary">
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Randevu Al</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
          <h3 className="text-lg font-medium text-green-700 mb-2">Randevu Alındı!</h3>
          <p className="text-green-600 mb-4">Randevunuz başarıyla oluşturuldu.</p>
          <button
            onClick={() => setSuccess(false)}
            className="btn bg-green-600 hover:bg-green-700 text-white"
          >
            Yeni Randevu Al
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block mb-2 font-medium">
              Tarih
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              max={format(maxDate, 'yyyy-MM-dd')}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block mb-2 font-medium">
              Saat
            </label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Saat seçin</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-medium">
              Açıklama
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Randevuda görüşmek istediğiniz konuyu belirtin"
              className="input-field min-h-[150px]"
              maxLength={500}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Randevu Al'}
          </button>
        </form>
      )}
    </div>
  );
}
