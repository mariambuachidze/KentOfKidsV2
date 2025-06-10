'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaStar, FaUser, FaReply } from 'react-icons/fa';

export default function CommentList({ comments, productId }) {
  const { data: session } = useSession();
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  
  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          userId: session.user.id,
          reply: replyText,
        }),
      });
      
      if (response.ok) {
        setReplyText('');
        setActiveReplyId(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Yanıt gönderilirken hata oluştu:', error);
    }
  };
  
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
        />
      ));
  };
  
  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-2xl font-semibold border-b pb-2">Müşteri Yorumları</h3>
      
      {comments.length === 0 ? (
        <p className="text-gray-500 italic">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <FaUser className="text-gray-400 mr-2" />
                    <span className="font-medium">{comment.user.name} {comment.user.surname}</span>
                  </div>
                  <h4 className="font-semibold mb-1">{comment.title}</h4>
                  <div className="flex mb-2">{renderStars(comment.rating)}</div>
                </div>
              </div>
              
              <p className="text-gray-700 mt-2">{comment.description}</p>
              
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-white p-3 rounded shadow-sm">
                      <div className="flex items-center mb-1">
                        <FaUser className="text-gray-400 mr-2" />
                        <span className="font-medium">{reply.user.name} {reply.user.surname}</span>
                        {reply.user.is_admin && (
                          <span className="ml-2 bg-primary-dark text-white text-xs px-2 py-0.5 rounded">Yönetici</span>
                        )}
                      </div>
                      <p className="text-gray-700">{reply.reply}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {
session?.user?.isAdmin && (
                <div className="mt-3">
                  {activeReplyId === comment.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Yanıtınızı yazın..."
                        className="input-field min-h-[80px]"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReplySubmit(comment.id)}
                          className="btn btn-primary text-sm"
                        >
                          Yanıtla
                        </button>
                        <button
                          onClick={() => {
                            setActiveReplyId(null);
                            setReplyText('');
                          }}
                          className="btn text-sm bg-gray-200 hover:bg-gray-300"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveReplyId(comment.id)}
                      className="flex items-center text-sm text-primary hover:text-primary-dark mt-2"
                    >
                      <FaReply className="mr-1" /> Yanıtla
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
