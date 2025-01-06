import { useState } from "react";
import { Comments } from "../../lib/types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { Button } from "../ui/Button";
import { createClient } from "../../../utils/supabase/client";
import { Input } from "../ui/Input";
import { addComment, getComments } from "@/queries";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/Collapsible";

dayjs.extend(relativeTime);

interface CommentSectionProps {
  videoId: string;
}

interface CommentItemProps {
  comment: Comments;
  onReply: (parentId: string, content: string) => void;
  onNavigateToLogin: () => void;
}

const CommentItem = ({
  comment,
  onReply,
  onNavigateToLogin,
}: CommentItemProps) => {
  const [replyContent, setReplyContent] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const { user } = useAuth();

  const handleReply = () => {
    if (!user) {
      onNavigateToLogin();
      return;
    }
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyInput(false);
    }
  };

  return (
    <li className="p-2 rounded-md border-b border-gray-200">
      <div className="flex align-middle gap-x-5">
        <h3>
          <strong>{comment.username}</strong>
        </h3>
        <span>{dayjs(comment.created_at).fromNow()}</span>
      </div>
      <p className="mt-2">{comment.content}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          user ? setShowReplyInput(!showReplyInput) : onNavigateToLogin()
        }
      >
        Reply
      </Button>
      {showReplyInput && (
        <div className="mt-2 ml-4">
          <Input
            type="text"
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Button onClick={handleReply}>Post Reply</Button>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <ul className="ml-8 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onNavigateToLogin={onNavigateToLogin}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const client = createClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comments[], Error>({
    queryKey: ["comments", videoId],
    queryFn: () => getComments(client, videoId),
  });

  const addCommentMutation = useMutation({
    mutationFn: (newCommentData: { content: string; parentId?: string }) =>
      addComment(
        client,
        videoId,
        newCommentData.content,
        newCommentData.parentId
      ),
    onSuccess: (data) => {
      console.log("Comment added successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
      setNewComment("");
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      // You might want to show an error message to the user here
    },
  });

  const handleAddComment = () => {
    if (!user) {
      navigateToLogin();
      return;
    }
    if (newComment.trim()) {
      console.log("Attempting to add comment:", newComment);
      addCommentMutation.mutate({ content: newComment });
    }
  };
  const handleReply = (parentId: string, content: string) => {
    if (!user) {
      navigateToLogin();
      return;
    }
    addCommentMutation.mutate({ content, parentId });
  };

  const navigateToLogin = () => {
    const currentPath = window.location.pathname;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error.message}</p>;

  const ExpandIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="size-4"
    >
      <path
        fillRule="evenodd"
        d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="mt-6">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-x-1">
            <small className="text-base"> See comments </small>
            <ExpandIcon />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="w-full">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => !user && navigateToLogin()}
            />
            <br />
            <Button type="submit" onClick={handleAddComment} disabled={!user}>
              Post Comment
            </Button>
          </div>
          {comments && comments.length > 0 ? (
            <ul className="list-none space-y-2 w-full">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  onNavigateToLogin={navigateToLogin}
                />
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
