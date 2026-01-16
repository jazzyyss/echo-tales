import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../auth/authStore";

export default function AppShell() {
  useEffect(() => {
    useAuthStore.getState().bootstrap();
  }, []);

  return <Outlet />;
}