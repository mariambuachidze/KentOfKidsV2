"use client";
import { useState, useEffect } from "react";

export default function AppointmentsManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/admin/appointments", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Randevular alınamadı");
      const data = await response.json();
      console.log(data);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    if (window.confirm("Bu randevuyu silmek istediğinize emin misiniz?")) {
      try {
        const response = await fetch(`/api/admin/appointments/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Randevu silinemedi");
        setAppointments(appointments.filter((a) => a.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const deleteReply = async (appointmentId, replyId) => {
    if (window.confirm("Bu yanıtı silmek istediğinize emin misiniz?")) {
      try {
        const response = await fetch(
          `/api/admin/appointments/${appointmentId}/reply?replyId=${replyId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Yanıt silinemedi");
        setAppointments(
          appointments.map((a) =>
            a.id === appointmentId
              ? { ...a, replies: a.replies.filter((r) => r.id !== replyId) }
              : a
          )
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const response = await fetch(
        `/api/admin/appointments/${replyingTo}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: replyText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Yanıt eklenemedi");
      }
      const newReply = await response.json();

      setAppointments(
        appointments.map((a) =>
          a.id === replyingTo ? { ...a, replies: [...a.replies, newReply] } : a
        )
      );

      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("tr-TR");
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading)
    return <div className="text-center">Randevular yükleniyor...</div>;
  if (error) return <div className="text-red-500">Hata: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Randevu Yönetimi</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500">Hiç randevu bulunamadı.</p>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {appointment.user &&
                    appointment.user.name &&
                    appointment.user.surname
                      ? `${appointment.user.name} ${appointment.user.surname} (${appointment.user.email})`
                      : appointment.user?.email
                      ? `(${appointment.user.email})`
                      : "Kullanıcı bilgisi yok"}
                  </h3>
                  <div className="text-sm text-gray-500">
                    Randevu #{appointment.id} • {formatDate(appointment.date)} •{" "}
                    {formatTime(appointment.time)}
                  </div>
                  <p className="mt-2 text-gray-700">
                    {appointment.description}
                  </p>
                </div>
                <button
                  onClick={() => deleteAppointment(appointment.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Sil
                </button>
              </div>

              {/* Yanıtlar */}
              {appointment.replies?.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Yanıtlar:
                  </h4>
                  <div className="space-y-3">
                    {appointment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {reply.user?.name} {reply.user?.surname}
                            {reply.user?.is_admin && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded">
                                Yönetici
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mt-1">{reply.reply}</p>
                        </div>
                        <button
                          onClick={() => deleteReply(appointment.id, reply.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yanıt formu */}
              {replyingTo === appointment.id ? (
                <form onSubmit={handleReply} className="mt-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="2"
                    placeholder="Yanıt yazın..."
                    required
                  ></textarea>
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                    >
                      Yanıtla
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setReplyingTo(appointment.id)}
                  className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Bu randevuya yanıtla
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
