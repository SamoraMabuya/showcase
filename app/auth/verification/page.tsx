// app/auth/verification-success/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { EmailOtpType } from "@supabase/supabase-js";

export default function VerificationSuccessPage() {
  const [message, setMessage] = useState("Verifying your account...");
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyAccount = async () => {
      const supabase = createClient();

      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type") as EmailOtpType;
      const next = searchParams.get("next") ?? "/";

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type });
        if (error) {
          setMessage(
            "Verification failed. Please try again or contact support."
          );
          setIsError(true);
        } else {
          setMessage("Your account has been successfully verified!");
          // Optionally, you can redirect the user after a successful verification
          // setTimeout(() => router.push(next), 2000);
        }
      } else {
        setMessage("Invalid verification link. Please try signing up again.");
        setIsError(true);
      }
    };

    verifyAccount();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        <div
          className={`mt-2 text-center ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
        {!isError && (
          <div className="mt-5 text-center">
            <Link
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Continue to your account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}