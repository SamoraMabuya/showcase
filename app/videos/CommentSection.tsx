import { useState, useEffect } from "react";
import { CommentType } from "./type";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

// types.ts

interface CommentSectionProps {
  videoId: string; // Accept videoId as a prop
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]); // Define the type for comments
  const [newComment, setNewComment] = useState<string>(""); // Type for new comment
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

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

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      {/* Input for adding a new comment */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAddComment} className="mt-2">
          Submit
        </Button>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <ul className="list-none space-y-2">
          {comments.map((comment, index) => (
            <li key={index} className="border p-2 rounded-md">
              {comment.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
}
