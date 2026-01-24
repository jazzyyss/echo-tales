import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../auth/authStore";

const Login: FC = () => {
  const navigate = useNavigate();

  const loginAction = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");	
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Email and Password are required!");
      return;
    }

    try {
      setIsSubmitting(true);

      await loginAction(cleanEmail, password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      // show server message if available
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as any)?.message ||
          err.response?.statusText ||
          "Login failed: try again!";
        setError(msg);
      } else {
        setError("Login failed: try again!");
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
              Tell Your Tales!
            </h4>
            <p className="text-sm lg:text-[15px] text-blue drop-shadow leading-5 lg:leading-6 mt-2 lg:mt-4 pr-3 lg:pr-7">
              Record your tales and memories in your personal travel journal.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/4 bg-white rounded-lg lg:rounded-r-lg relative p-8 lg:p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSubmit}>
            <h4 className="text-xl lg:text-2xl font-semibold mb-5 lg:mb-7">
              Login
            </h4>

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
              autoComplete="current-password"
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button
              type="submit"
              className="btn-primary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "LOGGING IN..." : "LOGIN"}
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="button"
              className="btn-primary btn-light cursor-pointer"
              onClick={() => navigate("/signup")}
              disabled={isSubmitting}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


/* import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { login, getMe } from "../../api/auth";

const Login: FC = _ => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();

    console.log("email: ", email);
    console.log("pass: ", password);
    console.log("error: ", error);

		const cleanEmail = email.trim().toLowerCase();
		if(!cleanEmail || !password){
			setError("Email and Password are required!");
			return;
		}

		try{
			setIsSubmitting(true);

			await login(cleanEmail, password);
			await getMe();
			navigate("/dashboard", {replace: true});
		}catch(err){
			setError("Login failed: try again!");
		}finally{
			setIsSubmitting(false);
		}

	}

  return(
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40 hidden lg:block"></div>
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2 hidden lg:block"></div>

      <div className="container h-screen flex flex-wrap items-center justify-center px-4 sm:px-8 lg:-48 mx-auto">
        <div className="w-full lg:w-2/4 h-[40vh] lg:h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-5 lg:p-10 z-50 mb-4 lg:mb-0">
          <div>
						<h4 className="text-3xl lg:text-5xl text-white font-semibold leading-tight lg:leading-14.5">
							Tell Your Tales!
						</h4>
						<p className="text-sm lg:text-[15px] text-white leading-5 lg:leading-6 mt-2 lg:mt-4 pr-3 lg:pr-7">
							Record your tales and memories in your personal travel journal.
						</p>
					</div>
        </div>
        <div className="w-full lg:w-2/4 bg-white rounded-lg lg:rounded-r-lg relative p-8 lg:p-16 shadow-lg shadow-cyan-200/20">
					<form onSubmit={handleSubmit}>
						<h4 className="text-xl lg:text-2xl font-semibold mb-5 lg:mb-7">
							Login
						</h4>

						<input
							type="text"
							placeholder="Email"
							className="input-box mb-3"
							value={email}
              onChange = {({target}) => {
                setEmail(target.value)
              }}
						/>

						<input
							type="text"
							placeholder="Password"
							className="input-box mb-3"
							value={password}
              onChange = {({target}) => {
                setPassword(target.value)
              }}
						/>

						{ error && <p className="text-red-500 text-xs pb-1">{error}</p>}

						<button type="submit" className="btn-primary cursor-pointer" disabled={isSubmitting}>
							LOGIN
						</button>

						<p className="text-xs text-slate-500 text-center my-4">Or</p>

						<button
							type="button"
							className="btn-primary btn-light cursor-pointer"
              onClick={_=>{navigate('/signup')}}
						>
							CREATE ACCOUNT
						</button>
					</form>
				</div>
      </div>
    </div>
  );
}

export default Login;
 */