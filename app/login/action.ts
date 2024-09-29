"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
export async function signup(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // Ensure a record is created in the users table
  if (authData.user) {
    const { error: insertError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: authData.user.email,
      username: username,
    });

    if (insertError) {
      console.error("Error creating user record:", insertError);
      return { error: "Failed to create user record" };
    }
  }

  return { message: "Please check your email for the confirmation link." };
}
