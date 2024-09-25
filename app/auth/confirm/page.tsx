"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConfirmPage() {
  const [message, setMessage] = useState("Verifying your account...");
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setMessage(
          "Congratulations! Your account has been successfully verified."
        );
        setIsVerified(true);
      } else {
        setMessage("Verification failed. Please try signing up again.");
      }
    };

    checkSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        <div className="mt-2 text-center text-green-600">{message}</div>
        {isVerified && (
          <div className="mt-5 text-center">
            <Link
              href="/protected"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go to your account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
