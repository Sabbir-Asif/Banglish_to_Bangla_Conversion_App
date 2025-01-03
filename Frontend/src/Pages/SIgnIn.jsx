import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../Components/Authentication/AuthProvider";
import { TbStackBack } from "react-icons/tb";

const SignIn = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      alert("Error sign in");
      setError(error.message);
    }
  };

  return (
    <div className="hero flex justify-center min-h-screen bg-base-200 font-poppins">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="flex gap-12 flex-shrink-0 w-full shadow-2xl bg-red-50 rounded-r-lg">
          <div className="bg-gradient-to-r from-orange-primary to-orange-secondary px-20 rounded-l-lg flex flex-col justify-center items-center">
            <h1 className="text-5xl text-center pb-8 font-bold text-cream-primary">
              KUET
            </h1>
            <TbStackBack className="text-8xl text-cream-primary" />
          </div>
          <form onSubmit={handleLogin} className="pr-20 pl-10 py-20">
            <h1 className="text-3xl font-bold text-center pb-5 text-cream-primary">Sign In</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="form-control">
              <label className="label">
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-gradient-to-r from-orange-primary to-orange-secondary hover:bg-[#86bbd8] text-orange-100">
                Sign In
              </button>
            </div>
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-orange-primary hover:underline">
                Sign Up
              </Link>
            </p>
            <p className="text-center mt-4">
              Forgot your password?{" "}
              <Link to="/forgot-password" className="text-orange-secondary hover:underline">
                Reset it
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
