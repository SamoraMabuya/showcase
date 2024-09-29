import { Dayjs } from "dayjs";
import { ReactNode } from "react";

export interface Videos {
  created_at: string;
  description: string;
  id: string;
  like_count: number | null;
  tagline: string;
  thumbnail_url: string;
  title: string;
  total_coins: number;
  user_id: string;
  video_url: string;
}

export interface Comments {
  id: string;
  user_id: string;
  video_id: string;
  content: string;
  created_at: string;
  username: string;
  parent_id: string | null;
  replies?: Comments[];
}
export interface CommentWithReplies extends Comments {
  replies: CommentWithReplies[];
}
export interface Suggested {
  currentVideoId: string;
}
