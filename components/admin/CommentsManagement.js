"use client";
import { useState, useEffect } from 'react';

export default function CommentsManagement() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/comments');
      if (!response.ok) throw new Error('Yorumlar alınamadı');
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id) => {
    if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Yorum silinemedi');
        setComments(comments.filter(comment => comment.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const deleteReply = async (commentId, replyId) => {
    if (window.confirm('Bu cevabı silmek istediğinize emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/comments/${commentId}/reply?replyId=${replyId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Cevap silinemedi');
        setComments(comments.map(comment =>
          comment.id === commentId
            ? { ...comment, replies: comment.replies.filter(r => r.id !== replyId) }
            : comment
        ));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const response = await fetch(`/api/admin/comments/${replyingTo}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });

      if (!response.ok) throw new Error('Cevap eklenemedi');
      const newReply = await response.json();

      setComments(comments.map(comment =>
        comment.id === replyingTo
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      ));

      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">Yorumlar yükleniyor...</div>;
  if (error) return <div className="text-red-500">Hata: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Yorum Yönetimi</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500">Hiç yorum bulunamadı.</p>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{comment.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>{comment.user?.name} {comment.user?.surname}</span>
                    <span className="mx-2">•</span>
                    <span>Ürün: {comment.product?.name}</span>
                    <span className="mx-2">•</span>
                    <span>Puan: {comment.rating}/5</span>
                  </div>
                </div>
                <button onClick={() => deleteComment(comment.id)} className="text-red-600 hover:text-red-800">Sil</button>
              </div>
              <p className="mt-2 text-gray-700">{comment.description}</p>

              {comment.replies?.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Yanıtlar:</h4>
                  <div className="space-y-3">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center text-sm">
                            <span className="font-medium">{reply.user?.name} {reply.user?.surname}</span>
                            {reply.user?.is_admin && (
                              <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded">Yönetici</span>
                            )}
                          </div>
                          <p className="text-gray-700 mt-1">{reply.reply}</p>
                        </div>
                        <button
                          onClick={() => deleteReply(comment.id, reply.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {replyingTo === comment.id ? (
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
                      className="px-3 py-1 border text-gray-700 rounded hover:bg-gray-100 text-sm"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                    >
                      Yanıtla
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Bu yoruma yanıtla
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
