import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../auth/authStore";

export default function AppShell() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    useAuthStore.getState().bootstrap();
  }, []);

  return <Outlet />;
}
