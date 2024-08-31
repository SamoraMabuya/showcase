import dayjs, { Dayjs } from "dayjs";
import { ReactNode } from "react";

export interface VideoType {
  id: string;
  title: string;
  tagline: string;
  video_url: string;
  thumbnail_url: string;
  user_id: string;
}

export interface CommentType {
  username: ReactNode;
  id: string;
  video_id: string;
  content: string;
  created_at: Dayjs;
}
