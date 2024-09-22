"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    if (error.status === 400) {
      return {
        error:
          "User does not exist. Please check your email or sign up for a new account.",
      };
    }
    return { error: "An unexpected error occurred. Please try again later." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const username = formData.get("username") as string;

  const { error, data: signUpData } = await supabase.auth.signUp({
    ...data,
    options: {
      data: {
        username: username,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (
    signUpData.user &&
    signUpData.user.identities &&
    signUpData.user.identities.length === 0
  ) {
    return { error: "User already exists. Please log in." };
  }

  // Check if email confirmation is required
  if (signUpData.user && !signUpData.user.confirmed_at) {
    return { message: "Please check your email to  your account." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
