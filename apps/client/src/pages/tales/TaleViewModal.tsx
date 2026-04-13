import { useEffect, useState } from "react";
import moment from "moment";
import {
  MdChatBubbleOutline,
  MdClose,
  MdDelete,
  MdFavorite,
  MdFavoriteBorder,
  MdLocationOn,
  MdSend,
} from "react-icons/md";
import type { Tale, TaleComment } from "../../types/tale";
import { useAuthStore, type Me } from "../../auth/authStore";
import {
  createComment,
  deleteComment,
  listComments,
  toggleLike,
} from "../../api/tales";
import { toast } from "react-toastify";

export default function TaleViewModal({
  tale,
  onClose,
  onDelete,
}: {
  tale: Tale | null;
  onClose: () => void;
  onDelete: () => void;
}) {
  const me: Me | null = useAuthStore((s) => s.me);

  const [comments, setComments] = useState<TaleComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [localTale, setLocalTale] = useState<Tale | null>(tale);

  useEffect(() => {
    setLocalTale(tale);
  }, [tale]);

  useEffect(() => {
    const run = async () => {
      if (!tale) return;
      setLoadingComments(true);
      try {
        const data = await listComments(tale.id);
        setComments(data);
      } catch {
        toast.error("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    };

    void run();
  }, [tale]);

  if (!localTale) return null;

  const isOwner = localTale.owner._id === me?.id;

  const handleLikeToggle = async () => {
    try {
      const updated = await toggleLike(localTale.id);
      setLocalTale(updated);
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleCreateComment = async () => {
    const body = commentBody.trim();
    if (!body) return;

    try {
      setSubmittingComment(true);
      const created = await createComment(localTale.id, body);
      setComments((prev) => [created, ...prev]);
      setCommentBody("");
      setLocalTale((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev
      );
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(localTale.id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setLocalTale((prev) =>
        prev ? { ...prev, commentCount: Math.max(0, prev.commentCount - 1) } : prev
      );
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-slate-900">
            {localTale.title || "Untitled tale"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            By {localTale.owner.fullName} · {moment(localTale.visitedDate).format("MMM D, YYYY")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-600 hover:text-white"
            >
              <MdDelete className="text-lg" />
              Delete
            </button>
          )}

          <button
            className="rounded-2xl p-2 text-slate-600 hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>
      </div>

      {localTale.images.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {localTale.images.map((image) => (
            <img
              key={image.publicId}
              src={image.secureUrl}
              alt={localTale.title || "Tale image"}
              className="h-72 w-full rounded-3xl border border-slate-200 object-cover"
            />
          ))}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        {localTale.visitedLocation.map((location) => (
          <span
            key={location}
            className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-2 text-cyan-700"
          >
            <MdLocationOn />
            {location}
          </span>
        ))}

        {isOwner && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-slate-700">
            {localTale.visibility}
          </span>
        )}
      </div>

      <div className="mb-6 rounded-3xl bg-slate-50 p-5">
        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {localTale.story}
        </p>
      </div>

      <div className="mb-6 flex items-center gap-5 border-y border-slate-200 py-4">
        <button
          type="button"
          onClick={handleLikeToggle}
          className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-rose-600"
        >
          {localTale.isLikedByMe ? (
            <MdFavorite className="text-2xl text-rose-500" />
          ) : (
            <MdFavoriteBorder className="text-2xl" />
          )}
          <span>{localTale.likeCount} likes</span>
        </button>

        <div className="inline-flex items-center gap-2 text-sm text-slate-700">
          <MdChatBubbleOutline className="text-2xl" />
          <span>{localTale.commentCount} comments</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Comments</h3>

        <div className="mt-4 flex items-start gap-3">
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[90px] flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleCreateComment}
            disabled={submittingComment || !commentBody.trim()}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
            aria-label="Send comment"
          >
            <MdSend className="text-xl" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {loadingComments ? (
            <p className="text-sm text-slate-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-slate-500">No comments yet.</p>
          ) : (
            comments.map((comment) => {
              const canDelete = comment.owner._id === me?.id;

              return (
                <div key={comment._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {comment.owner.fullName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {moment(comment.createdAt).fromNow()}
                      </p>
                    </div>

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {comment.body}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}