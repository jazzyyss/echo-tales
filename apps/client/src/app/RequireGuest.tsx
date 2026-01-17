import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const token = useAuthStore((s) => s.accessToken);

  if (isBootstrapping) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm opacity-70">Loading...</div>
      </div>
    );
  }

  // If already authed, guests-only pages should bounce to dashboard
  if (token) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
