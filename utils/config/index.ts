import { HistoryIcon, HomeIcon, UploadIcon, UserIcon } from "@/lib/Icon";

export const RouteItems = [
  {
    key: "homeId",
    text: "Home",
    href: "/",
    icon: HomeIcon,
    authRequired: false,
  },
  {
    key: "profileId",
    text: "Profile",
    href: "/Profile",
    icon: UserIcon,
    authRequired: true,
  },
  {
    key: "uploadId",
    text: "Upload",
    href: "/upload",
    icon: UploadIcon,
    authRequired: true,
  },
  {
    key: "history",
    text: "History",
    href: "/History",
    icon: HistoryIcon,
    authRequired: true,
  },
];
