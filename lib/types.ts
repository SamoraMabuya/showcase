import { Dayjs } from "dayjs";
import { ReactNode } from "react";

export interface Videos {
  created_at: string;
  description: string | null;
  id: string;
  like_count: number | null;
  tagline: string | null;
  thumbnail_url: string | null;
  title: string | null;
  total_coins: number | null;
  user_id: string;
  video_url: string;
}

export interface Comments {
  username: ReactNode;
  id: string;
  video_id: string;
  content: string;
  created_at: Dayjs;
}

export interface Suggested {
  currentVideoId: string;
}
