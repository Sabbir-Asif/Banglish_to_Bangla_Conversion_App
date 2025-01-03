import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/Authentication/AuthProvider";
import { Sparkles } from 'lucide-react';
import { FaAirbnb } from 'react-icons/fa6';

const SignUp = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleParallax = (e) => {
      if (!parallaxRef.current) return;
      const elements = parallaxRef.current.querySelectorAll('.parallax');
      elements.forEach((el) => {
        const speed = el.getAttribute('data-speed');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        el.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleParallax);
    return () => document.removeEventListener('mousemove', handleParallax);
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await createUser(email, password, name);
      navigate("/");
    } catch (error) {
      setError(error.message || "An error occurred during sign up. Please try again.");
    }
  };

  return (
    <div ref={parallaxRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9]">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 grid-animation opacity-10"></div>

      {/* Floating Elements Container */}
      <div className="absolute inset-0">
        <div className="particles-container"></div>
        
        <div
          className="parallax absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-gradient-to-r from-[#FF0000] to-[#FF8938] opacity-20 blur-3xl animate-morph"
          data-speed="2"
        />
        <div
          className="parallax absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-[#FF8938] to-[#E6A623] opacity-20 blur-3xl animate-morph-delayed"
          data-speed="3"
        />
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-4xl animate-fade-in">
          <div className="flex shadow-2xl rounded-lg overflow-hidden backdrop-blur-sm bg-white/30">
            {/* Left Column - Logo Section */}
            <div className="bg-gradient-to-r from-orange-primary to-orange-secondary w-1/3 p-12 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="flex flex-col items-center relative z-10">
                <h1 className="text-4xl text-center pb-8 font-bold text-white animate-float">
                  BanglaBridge
                </h1>
                <FaAirbnb className="text-6xl text-center text-white animate-float-delayed" />
              </div>
              <div className="absolute inset-0">
                <div className="absolute inset-0 grid-animation opacity-20"></div>
                <div className="absolute inset-0 particles-container opacity-30"></div>
              </div>
            </div>

            {/* Right Column - Form Section */}
            <div className="w-2/3 p-12 bg-white/40">
              <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-primary to-orange-secondary bg-clip-text text-transparent">
                  Create Account
                </h1>
                
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 animate-shake">
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-primary focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Full Name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-primary focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <input
                      type="password"
                      name="password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-primary focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-orange-primary to-orange-secondary text-white font-medium hover:brightness-110 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Sign Up</span>
                    <Sparkles className="h-4 w-4 animate-spin-slow" />
                  </button>

                  <div className="text-center">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link to="/sign-in" className="text-orange-primary hover:underline font-medium">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Particle Animation */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, transparent 100%);
        }
        
        .particles-container::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at center, #FF0000 1px, transparent 1px),
            radial-gradient(circle at center, #FF8938 1px, transparent 1px),
            radial-gradient(circle at center, #E6A623 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px, 40px 40px;
          animation: particleFloat 20s linear infinite;
          opacity: 0.3;
        }

        @keyframes particleFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-40px); }
        }

        /* Grid Animation */
        .grid-animation {
          background-image: linear-gradient(#FF8938 1px, transparent 1px),
                          linear-gradient(90deg, #FF8938 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, -50px); }
        }

        /* Float Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 5s ease-in-out 1s infinite;
        }

        /* Morphing Animation */
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
        }

        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }

        .animate-morph-delayed {
          animation: morph 8s ease-in-out 2s infinite;
        }

        /* Fade In Animation */
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Shake Animation */
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Spin Animation */
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SignUp;