"use client";

import { useState, useEffect } from "react";
import { login, signup } from "./action";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);
    if (result.error) {
      setMessage(result.error);
      setIsError(true);
    } else if (result.success) {
      router.push("/");
    }
  };
  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData);
    if (result.error) {
      setMessage(result.error);
      setIsError(true);
    } else if (result.message) {
      setMessage(result.message);
      setIsError(false);
    } else if (result.success) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {message && (
          <div
            className={`border-l-4 p-4 ${
              isError
                ? "bg-red-100 border-red-500 text-red-700"
                : "bg-blue-100 border-blue-500 text-blue-700"
            }`}
            role="alert"
          >
            <p>{message}</p>
          </div>
        )}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Account Login
          </h2>
        </div>
        <form className="mt-8 space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
            <div className="text-center">
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
