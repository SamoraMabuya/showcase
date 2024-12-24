"use client";
import { AvatarFallback } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui//Input";
import { Tables } from "@/utils/database.types";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Label } from "@radix-ui/react-label";
import { useState, useEffect, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type UserProfile = Tables<"profile">;

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch profile once when component mounts
  useEffect(() => {
    fetchProfile();
  }, []); // Empty dependency array

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // First get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      // Then get their profile
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profile")
        .update(profile)
        .eq("user_id", user.id);

      if (error) throw error;

      setIsEditing(false);
      // Optionally refetch to ensure we have the latest data
      await fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile found</div>;
  }
  const avatarFallBack = profile.username?.slice(0, 2).toUpperCase();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <form onSubmit={() => handleChange}>
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
