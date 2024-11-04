"use client";
import { AvatarFallback } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Tables } from "@/utils/database.types";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Label } from "@radix-ui/react-label";
import { useState, useEffect } from "react";

// type ProfileData = {
//   avatar_url: string | null;
//   age: number | null;
//   full_name: string | null;
//   username: string | null;
//   email: string | null;
//   date_joined: string | null;
//   profile_id: string | null;
// };

let userProfile: <'profile'>

const Profile = () => {
  const [profile, setProfile] = useState<userProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (profile?.profile_id) {
      fetchProfile();
    }
  }, [profile?.profile_id]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("profile_id", user?.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    const { error } = await supabase
      .from("profile")
      .update(profile)
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  }; 

  if (!profile) return <div>Loading...</div>;

  const avatarFallBack = profile.username?.slice(0, 2).toUpperCase();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <Avatar>
            <AvatarImage
              src={profile.avatar_url || ""}
              alt="Profile"
              className="w-24 h-24"
            />
            <AvatarFallback>{avatarFallBack}</AvatarFallback>
          </Avatar>
        </div>
        <div className="mb-4">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={profile.full_name || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={profile.username || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={profile.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
            type="email"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            value={profile.age || ""}
            onChange={handleChange}
            disabled={!isEditing}
            type="number"
          />
        </div>
        <div className="mb-4">
          <Label>Date Joined</Label>
          <p>{new Date(profile.date_joined || "").toLocaleDateString()}</p>
        </div>
        {isEditing ? (
          <Button type="submit">Save Changes</Button>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </form>
    </div>
  );
};

export default Profile;
