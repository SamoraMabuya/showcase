import dayjs, { Dayjs } from "dayjs";
import { ReactNode } from "react";

export interface Videos {
  id: string;
  title: string;
  tagline: string;
  video_url: string;
  thumbnail_url: string;
  user_id: string;
  description: string;
  total_coins: number;
  like_count: number;
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
