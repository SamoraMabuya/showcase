import { useState, useEffect } from "react";
import { CommentType } from "./type";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Collapsible, CollapsibleContent } from "@/components/Collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
dayjs.extend(relativeTime);

// types.ts

interface CommentSectionProps {
  videoId: string; // Accept videoId as a prop
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]); // Define the type for comments
  const [newComment, setNewComment] = useState<string>(""); // Type for new comment
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [isOpen, setIsOpen] = useState(false);

  // Fetch comments when the component mounts or when videoId changes
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true); // Set loading state

      const { data, error } = await createClient()
        .from("comments")
        .select("*")
        .eq("video_id", videoId);

      if (error) {
        setError("Failed to load comments.");
        console.error("Error fetching comments:", error.message);
      } else {
        setComments(data || []);
      }

      setLoading(false); // Stop loading
    };

    fetchComments();
  }, [videoId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent adding empty comments

    const { data, error } = await createClient()
      .from("comments")
      .insert([{ video_id: videoId, content: newComment }])
      .select(); // This returns the inserted comment

    if (error) {
      console.error("Error adding comment:", error.message);
    } else {
      setComments((prevComments) => [...prevComments, data[0]]); // Append the newly inserted comment to the list
      setNewComment(""); // Clear the input after successful submission
    }
  };

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
      {/* Input for adding a new comment */}

      {/* Comments List */}
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
            />
          </div>
          {comments.length > 0 ? (
            <ul className="list-none space-y-2 w-full">
              {comments.map((comment, index) => (
                <li key={index} className=" p-2 rounded-md">
                  <div className="flex align-middle gap-x-5">
                    <h3>
                      <strong>{comment.username}</strong>
                    </h3>
                    <span>{dayjs(comment.created_at).fromNow()}</span>
                  </div>
                  <p className="mt-2">{comment.content}</p>
                </li>
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