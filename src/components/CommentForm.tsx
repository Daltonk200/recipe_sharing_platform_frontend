import { useState } from 'react';
import { Link } from 'react-router-dom';
import { commentAPI, type Comment } from '../api/comments';
import type { User } from '../api/auth';

interface CommentFormProps {
  recipeId: string;
  user: User | null;
  onCommentAdded: (comment: Comment) => void;
}

const CommentForm = ({ recipeId, user, onCommentAdded }: CommentFormProps) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }

    if (!commentText.trim()) {
      setError('Please enter a comment');
      return;
    }

    if (commentText.length > 500) {
      setError('Comment must be less than 500 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await commentAPI.addComment(recipeId, {
        text: commentText.trim()
      });
      
      onCommentAdded(response.comment);
      setCommentText('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
        <p className="text-gray-600 mb-4">Please log in to leave a comment</p>
        <div className="space-x-3">
          <Link
            to="/login"
            className="btn-primary inline-block"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="btn-secondary inline-block"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="mb-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts about this recipe..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={isSubmitting}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-sm ${
                    commentText.length > 450
                      ? commentText.length > 500
                        ? 'text-red-600'
                        : 'text-orange-600'
                      : 'text-gray-500'
                  }`}
                >
                  {commentText.length}/500
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Commenting as <span className="font-medium">{user.username}</span>
              </span>
              
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim() || commentText.length > 500}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Posting...
                  </span>
                ) : (
                  'Post Comment'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
