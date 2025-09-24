import { useState } from 'react';
import { commentAPI, type Comment } from '../api/comments';
import type { User } from '../api/auth';

interface CommentListProps {
  comments: Comment[];
  recipeId: string;
  user: User | null;
  recipeOwnerId?: string;
  onCommentDeleted: (commentId: string) => void;
}

const CommentList = ({ comments, recipeId, user, recipeOwnerId, onCommentDeleted }: CommentListProps) => {
  const [deletingComments, setDeletingComments] = useState<Set<string>>(new Set());

  const handleDeleteComment = async (commentId: string) => {
    if (!user || deletingComments.has(commentId)) return;

    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        setDeletingComments(prev => new Set([...prev, commentId]));
        await commentAPI.deleteComment(recipeId, commentId);
        onCommentDeleted(commentId);
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment. Please try again.');
      } finally {
        setDeletingComments(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    }
  };

  const canDeleteComment = (comment: Comment) => {
    if (!user) return false;
    // User can delete if they are the comment author or the recipe owner
    return comment.createdBy._id === user.id || recipeOwnerId === user.id;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 24 * 7) {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">💬</div>
        <p className="text-gray-500">No comments yet.</p>
        <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Comments ({comments.length})
      </h3>
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">
                    {comment.createdBy.username}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {comment.text}
                </p>
              </div>
              
              {canDeleteComment(comment) && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  disabled={deletingComments.has(comment._id)}
                  className="ml-3 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete comment"
                >
                  {deletingComments.has(comment._id) ? (
                    <span className="text-sm">...</span>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
