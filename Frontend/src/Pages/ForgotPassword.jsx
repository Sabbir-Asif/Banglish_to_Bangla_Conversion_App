import React, { useState, useContext } from 'react';
import { AuthContext } from '../Components/Authentication/AuthProvider';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const { sendPasswordResetEmail } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        if (!email) {
            setError("Please enter your email address");
            setIsLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(email);
            setSuccess("Password reset email sent! Check your inbox.");
            setEmail("");
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setError("No account exists with this email address.");
                    break;
                case 'auth/invalid-email':
                    setError("Please enter a valid email address.");
                    break;
                case 'auth/too-many-requests':
                    setError("Too many attempts. Please try again later.");
                    break;
                default:
                    setError("Failed to send reset email. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="hero flex justify-center min-h-screen bg-base-200 font-poppins">
            <div className="hero-content flex-col">
                <div className="max-w-md w-full">
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4 bg-base-100 p-8 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-blue-primary text-center mb-2">Reset Password</h1>
                        
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                {success}
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="form-control">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input input-bordered w-full"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Submit Button with Loader */}
                        <button 
                            type="submit"
                            className="btn bg-gradient-to-r from-orange-primary to-orange-secondary  hover:bg-[#86bbd8] text-orange-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Email'
                            )}
                        </button>

                        {/* Sign In Link */}
                        <p className="text-center mt-4">
                            Remembered your password?{" "}
                            <Link 
                                to="/sign-in" 
                                className="text-orange-primary hover:underline font-semibold"
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
