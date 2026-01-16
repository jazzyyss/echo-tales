import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const accessToken = useAuthStore((s) => s.accessToken);

  if (isBootstrapping) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm opacity-70">Loading...</div>
      </div>
    );
  }

  if (!accessToken) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
