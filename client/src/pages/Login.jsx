import React from "react";

export default function Login() {
  const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
          Welcome
        </h2>
        <p className="text-gray-500 mb-8">
          Please sign in using one of the following providers:
        </p>

        <div className="flex flex-col gap-4">
          {/* Google */}
          <a href={`${base}/auth/google`}>
            <button className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition">
              Continue with Google
            </button>
          </a>

          {/* GitHub */}
          <a href={`${base}/auth/github`}>
            <button className="w-full py-3 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-medium transition">
              Continue with GitHub
            </button>
          </a>

          {/* Facebook */}
          <a href={`${base}/auth/facebook`}>
            <button className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
              Continue with Facebook
            </button>
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}

