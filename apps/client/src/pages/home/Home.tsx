import { useAuthStore, type Me } from "../../auth/authStore";

export default function Home() {

  const me: Me | null  = useAuthStore(s => s.me);

  return (
    <>Logged in by {me?.fullName ?? "Name"} from {me?.email ?? "email"}</>
  );
}