import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../auth/authStore"; // adjust path if your store is in /store/

const SignUp: FC = () => {
  const navigate = useNavigate();
  const signupAction = useAuthStore((s) => s.signup);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");

    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFullName || !cleanUsername || !cleanEmail || !password) {
      setError("Full name, username, email, and password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if(cleanUsername.length < 5){
      setError("Username must be at least 5 characters.");
      return;
    }


    try {
      setIsSubmitting(true);

      await signupAction(cleanFullName, cleanUsername, cleanEmail, password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 409) {
          setError("Email already in use.");
          return;
        }
        if (status === 400) {
          setError("Invalid input. Check your details and try again.");
          return;
        }
        if (status === 500) {
          setError("Server error. Try again later.");
          return;
        }

        const msg =
          (err.response?.data as any)?.message ||
          err.response?.statusText ||
          "Signup failed. Try again.";
        setError(msg);
      } else {
        setError("Signup failed. Try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40 hidden lg:block"></div>
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2 hidden lg:block"></div>

      <div className="container h-screen flex flex-wrap items-center justify-center px-4 sm:px-8 lg:-48 mx-auto">
        <div className="w-full lg:w-2/4 h-[40vh] lg:h-[90vh] flex items-end bg-login-bg-img bg-cover bg-bottom rounded-lg p-5 lg:p-10 z-50 mb-4 lg:mb-0">
          <div>
            <h4 className="text-3xl lg:text-5xl text-blue drop-shadow font-semibold leading-tight lg:leading-14.5">
              Join Tales!
            </h4>
            <p className="text-sm lg:text-[15px] text-blue drop-shadow leading-5 lg:leading-6 mt-2 lg:mt-4 pr-3 lg:pr-7">
              Create an account to save your travel stories and memories.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/4 bg-white rounded-lg lg:rounded-r-lg relative p-8 lg:p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSubmit}>
            <h4 className="text-xl lg:text-2xl font-semibold mb-5 lg:mb-7">
              Create Account
            </h4>

            <input
              type="text"
              placeholder="Full Name"
              className="input-box mb-3"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              autoComplete="name"
            />

            <input
              type="text"
              placeholder="Username"
              className="input-box mb-3"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              autoComplete="username"
            />

            <input
              type="email"
              placeholder="Email"
              className="input-box mb-3"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              autoComplete="email"
            />

            <input
              type="password"
              placeholder="Password"
              className="input-box mb-3"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              autoComplete="new-password"
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button
              type="submit"
              className="btn-primary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "CREATING..." : "SIGN UP"}
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Already have an account?</p>

            <button
              type="button"
              className="btn-primary btn-light cursor-pointer"
              onClick={() => navigate("/login")}
              disabled={isSubmitting}
            >
              GO TO LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
