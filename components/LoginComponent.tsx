"use client";
import React, { useState, useEffect, useContext } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Shield, GraduationCap, UserCheck, Users, User, Lightbulb, Cog } from 'lucide-react';
import { cn } from '../lib/utils';
import { useRouter } from 'next/navigation';
import { contextType } from '@/contextApi/CreateDataContext';
import { Context } from '@/contextApi/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

type LoginStep = 'login' | 'forgot-password' | 'otp-verification' | 'reset-password' | 'success';

interface LoginComponentProps {
  onLoginSuccess?: () => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLoginSuccess }) => {
  const [currentStep, setCurrentStep] = useState<LoginStep>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | 'student'>('admin');

  const [rememberMe, setRememberMe] = useState(false);
  const { boundActions} = useContext<contextType>(Context);
  const { signIn } = boundActions;
  

  const router = useRouter()
  // Timer effect for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Object.values(newErrors).forEach((msg) => toast.error(msg));
       toast.error(Object.values(newErrors)[0]);
      setLoading(false);
      return;
    }

    signIn({email, password, setLoading, setError:setErrors, router, selectedrole:selectedRole})

    

    // Simulate API call
    // setTimeout(() => {
    setLoading(false);
    // router.push("/dashboard")
    // Simulate successful login
    //   onLoginSuccess?.();
    // }, 1500);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!email) {
      setErrors({ email: 'Email is required' });
      toast.error("Email is required")
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email' });
      toast.error("Please enter a valid email")

      setLoading(false);
      return;
    }
try {
   const res = await axios.post(
      process.env.apiUrl + `/api/forget-password`,
      { email }
    );

    toast.success(res?.data?.message);

    setCurrentStep("otp-verification");
    setTimer(120);
    setIsTimerActive(true);
} catch (error:any) {
 toast.error(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);

  };}

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter complete OTP' });
      toast.error("Please enter complete OTP")
      setLoading(false);
      return;
    }

try {
    const res = await axios.post(
      process.env.apiUrl + `/api/verify-code`,
      {
        email,
        code: otpString,
      }
    );

    toast.success(res?.data?.message);

    setCurrentStep("reset-password");
    setOtp(['', '', '', '', '', '']);

} catch (error:any) {
 toast.error(error?.response?.data?.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const newErrors: Record<string, string> = {};
    if (!password) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) newErrors.password = 'Password must be at least 8 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
       toast.error(Object.values(newErrors)[0]);
      setLoading(false);
      return;
    }
try {
   const res = await axios.post(
      process.env.apiUrl + `/api/reset-password`,
      {
        email,
        newPassword: password,
      }
    );

    toast.success(res?.data?.message);

    setCurrentStep("success");
    setPassword('');
setConfirmPassword('');

}  catch (error: any) {
    toast.error(error?.response?.data?.message || "Reset failed");
  } finally {
    setLoading(false);
  }
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
    setErrors({});
    setOtp(['', '', '', '', '', '']);
    setTimer(120);
    setIsTimerActive(false);
      setEmail('');
  setPassword('');
  setConfirmPassword('');
  };

  const handleGoToDashboard = () => {
    
    // onLoginSuccess?.();
    handleBackToLogin()
  };

 const resendOtp = async () => {
  try {
    setLoading(true);

    const res = await axios.post(
      process.env.apiUrl + `/api/forget-password`,
      { email, type: "resend" }
    );

    toast.success("OTP resent successfully");

    setTimer(120);
    setIsTimerActive(true);
    setOtp(['', '', '', '', '', '']);

  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Resend failed");
  } finally {
    setLoading(false);
  }
};

  const roles = [
    { id: 'admin', label: 'Admin', icon: UserCheck },
    { id: 'teacher', label: 'Employee', icon: Users },
    { id: 'student', label: 'Student', icon: User },
    { id: 'counselor', label: 'Counselor', icon: User }

  ];

  return (
    <>
      <div className="text-black min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md ">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep === 'login' && 'Welcome Back'}
                {currentStep === 'forgot-password' && 'Forgot Password'}
                {currentStep === 'otp-verification' && 'Verify OTP'}
                {currentStep === 'reset-password' && 'Reset Password'}
                {currentStep === 'success' && 'Success!'}
              </h1>
              <p className="text-gray-600">
                {currentStep === 'login' && 'Sign in to your account'}
                {currentStep === 'forgot-password' && 'Enter your email to receive OTP'}
                {currentStep === 'otp-verification' && 'Enter the 6-digit code sent to your email'}
                {currentStep === 'reset-password' && 'Create a new password'}
                {currentStep === 'success' && 'Password reset successfully!'}
              </p>
            </div> 

            {/* Login Form */}
             {currentStep === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-lg text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                        errors.email ? "border-red-500" : "border-gray-300"
                      )}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-lg text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                        errors.password ? "border-red-500" : "border-gray-300"
                      )}
                      disabled={loading}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            )} 

            {/* Forgot Password Form */}
             {currentStep === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                        errors.email ? "border-red-500" : "border-gray-300"
                      )}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </button>
              </form>
            )} 

            {/* OTP Verification */}
            {currentStep === 'otp-verification' && (
              <form onSubmit={handleOtpVerification} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                    Enter 6-digit OTP sent to {email}
                  </label>
                  <div className="flex justify-center space-x-3 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={cn(
                          "w-12 h-12 text-center text-xl font-semibold border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                          errors.otp ? "border-red-500" : "border-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  {errors.otp && <p className="text-red-500 text-sm text-center">{errors.otp}</p>}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Time remaining: <span className="font-semibold text-blue-600">{formatTime(timer)}</span>
                  </p>
                  {timer === 0 ? (
                    <button
                      type="button"
                      onClick={resendOtp}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                     disabled={loading || timer !== 0}
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">Didn't receive? Wait for timer to resend</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </button>
              </form>
            )}

            {/* Reset Password Form */}
            {currentStep === 'reset-password' && (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                        errors.password ? "border-red-500" : "border-gray-300"
                      )}
                      disabled={loading}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                      )}
                      disabled={loading}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )} 

            {/* Success Screen */}
           {currentStep === 'success' && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Complete!</h3>
                  <p className="text-gray-600">
                    Your password has been successfully reset. You can now access your account with your new password.
                  </p>
                </div>
                <button
                  onClick={handleGoToDashboard}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all"
                >
                  Go to Login
                </button>
              </div>
            )} 
          </div>

          {/* Footer */}
           <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Protected by advanced security measures
            </p>
          </div> 
        </div>
      </div>

      
    </>
  );
}



export default LoginComponent;