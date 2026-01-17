import { useAuthStore, type Me } from "../../auth/authStore";
import LogoutButton from "../../components/Logout";

export default function Home() {

  const me: Me | null  = useAuthStore(s => s.me);

  

  return (
    <>
      Logged in by {me?.fullName ?? "Name"} from {me?.email ?? "email"}
      <LogoutButton />
    </>

  );
}