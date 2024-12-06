import { HomeIcon, UserIcon, UploadIcon, HistoryIcon } from "@/lib/Icon";

export const RouteItems = [
  {
    key: "homeId",
    text: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    key: "profileId",
    text: "Profile",
    href: "/Profile",
    icon: UserIcon,
  },
  {
    key: "uploadId",
    text: "Upload",
    href: "/Upload",
    icon: UploadIcon,
  },
  {
    key: "history",
    text: "History",
    href: "/History",
    icon: HistoryIcon,
  },
];
