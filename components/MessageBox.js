"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaPaperPlane } from "react-icons/fa";

export default function MessageBox({ userId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [appointmentReplies, setAppointmentReplies] = useState([]);
  const [commentReplies, setCommentReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", title: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMessages, setShowMessages] = useState(true);
  const [showPlusIcon, setShowPlusIcon] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [messagesRes, appointmentRes, commentRes] = await Promise.all([
          fetch(`/api/messages/received?userId=${userId}`),
          fetch(`/api/messages/appointments?userId=${userId}`),
          fetch(`/api/messages/comments?userId=${userId}`),
        ]);

        const messagesData = await messagesRes.json();
        const appointmentData = await appointmentRes.json();
        const commentData = await commentRes.json();

        setMessages(messagesData);
        setAppointmentReplies(appointmentData);
        setCommentReplies(commentData);
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      }
      setLoading(false);
      setShowPlusIcon(true);
    };

    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, senderId: userId }),
    });
    const result = await res.json();

    if (!res.ok) {
      setError(result.message);
    } else {
      setSuccess("Mesaj başarıyla gönderildi.");
      setForm({ email: "", title: "", description: "" });
      setShowForm(false);
    }
  };

  const handleMessagesClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showPlusIcon && (
        <button
          className="bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700"
          onClick={() => {
            setShowForm(true);
            setShowPlusIcon(false);
          }}
          aria-label="Yeni mesaj"
        >
          <FaPlus />
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 mt-4 relative">
          <button
            className="absolute top-2 right-2 text-gray-600"
            onClick={() => {
              setShowForm(false);
              setShowPlusIcon(true);
            }}
            aria-label="Kapat"
          >
            <FaTimes />
          </button>

          <h3 className="text-lg font-bold mb-4">Yeni Mesaj</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Alıcı E-Posta</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Başlık</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Açıklama</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="4"
                maxLength={500}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
            <button
              type="submit"
              className="bg-pink-400 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-pink-700"
            >
              <FaPaperPlane /> Gönder
            </button>
          </form>
        </div>
      )}

      {showMessages && (
        <div className="mt-6 bg-white p-4 rounded shadow max-h-[500px] overflow-y-auto w-96 relative">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            onClick={handleMessagesClose}
            aria-label="Kapat"
          >
            <FaTimes />
          </button>

          <h4 className="text-md font-semibold mb-2">Randevu Yanıtları</h4>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : appointmentReplies.length === 0 ? (
            <p>Yanıt yok.</p>
          ) : (
            appointmentReplies.map((reply) => (
              <div key={reply.id} className="border-b py-2">
                <p className="text-sm font-medium text-gray-800">
                  {reply.reply}
                </p>
                {reply.user && (
                  <p className="text-xs text-gray-500">
                    Gönderen: {reply.user.name} {reply.user.surname} (
                    {reply.user.email})
                  </p>
                )}
              </div>
            ))
          )}

          <h4 className="text-md font-semibold mt-4 mb-2">Yorum Yanıtları</h4>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : commentReplies.length === 0 ? (
            <p>Yanıt yok.</p>
          ) : (
            commentReplies.map((reply) => (
              <div key={reply.id} className="border-b py-2">
                <p className="text-sm font-medium text-gray-800">
                  {reply.reply}
                </p>
                {reply.user && (
                  <p className="text-xs text-gray-500">
                    Gönderen: {reply.user.name} {reply.user.surname} (
                    {reply.user.email})
                  </p>
                )}
              </div>
            ))
          )}
          <h4 className="text-md font-semibold mt-4 mb-2">Mesajlar</h4>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : messages.length === 0 ? (
            <p>Henüz mesaj yok.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="border-b py-2">
                <p className="text-sm text-gray-800 font-semibold">
                  {msg.title}
                </p>
                <p className="text-sm text-gray-600">
                  Gönderen: {msg.sender?.name} {msg.sender?.surname} (
                  {msg.sender?.email})
                </p>
                <p className="text-sm">{msg.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
