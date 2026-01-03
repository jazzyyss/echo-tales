import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

const Login: FC = _ => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    console.log("email: ", email);
    console.log("pass: ", password);
    console.log("error: ", error);
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

						<button type="submit" className="btn-primary cursor-pointer">
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
