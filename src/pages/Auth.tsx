import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import { 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  ShieldCheck, 
  ArrowLeft, 
  Cpu, 
  GitBranch, 
  Chrome 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AuthPage() {
  const { login, signup, addToast } = useApp();

  // Mode: 'login' | 'signup' | 'forgot' | 'otp'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSocialClick = (platform: string) => {
    addToast(`${platform} OAuth Triggered`, "Simulating deep secure handshake connection.", "info");
    setIsLoading(true);
    setTimeout(() => {
      login("sarah.chen@nexus-ai.com", "Sarah Chen");
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim()) {
      setFormError("Email address is a required field.");
      return;
    }

    if (authMode === 'login') {
      if (!password) {
        setFormError("Password credentials must be specified.");
        return;
      }
      setIsLoading(true);
      setTimeout(async () => {
        // Automatically route to mock Otp verification for a truly modern SaaS security experience!
        setIsLoading(false);
        setAuthMode('otp');
        addToast("Multi-Factor Triggered", "Please verify using your OTP app generator code.", "info");
      }, 1000);
    } 
    
    else if (authMode === 'signup') {
      if (!name.trim()) {
        setFormError("Your full name must be specified.");
        return;
      }
      if (password.length < 6) {
        setFormError("Password credentials must contain at least 6 characters.");
        return;
      }
      setIsLoading(true);
      const success = await signup(email, name);
      setIsLoading(false);
      if (success) {
        addToast("Account Setup Complete", "Nexus workspace successfully configured.", "success");
      }
    } 
    
    else if (authMode === 'forgot') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        addToast("Reset Mail Dispatched", `Password recovery details transmitted to ${email}`, "success");
        setAuthMode('login');
      }, 1200);
    } 
    
    else if (authMode === 'otp') {
      if (otpCode.length !== 6) {
        setFormError("SaaS token requires a valid 6-digit verification code.");
        return;
      }
      setIsLoading(true);
      // Logs in Sarah Connor demo user!
      const userMail = email || "sarah.chen@nexus-ai.com";
      const userName = name || "Sarah Chen";
      const success = await login(userMail, userName);
      setIsLoading(false);
      if (!success) {
        setFormError("Verification security handshake could not be verified.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4 lg:p-6 transition-colors duration-300">
      
      <div className="w-full max-w-md bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-xl shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col gap-6 relative">
        
        {/* Visual Saas Logo Branding */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg text-lg ring-4 ring-blue-500/10 dark:ring-blue-900/10">
            N
          </div>
          <h2 className="text-sm font-bold tracking-widest text-gray-950 dark:text-gray-50 uppercase mt-1">
            NEXUS SAAS GATEWAY
          </h2>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">Telemetry Control System</span>
        </div>

        {/* Dynamic header headings depending on current login/signup states */}
        <div className="text-center flex flex-col gap-1 select-none">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase">
            {authMode === 'login' && "Sign in to Workspace"}
            {authMode === 'signup' && "Create Developer Account"}
            {authMode === 'forgot' && "Restore Password credentials"}
            {authMode === 'otp' && "Verify Multi-Factor Code"}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
            {authMode === 'login' && "Access real-time AI model costs, project backlogs, and telemetry logs."}
            {authMode === 'signup' && "Configure a premium analytics dashboard context for your software team."}
            {authMode === 'forgot' && "An recovery code will be transmitted to your email endpoint details."}
            {authMode === 'otp' && "Input the 6-digit confirmation token showing on your authenticator device."}
          </p>
        </div>

        {/* FORM FIELDS AREA */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-2.5 text-xs text-red-550 dark:text-red-400 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Render Full Name only on Signup */}
          {authMode === 'signup' && (
            <Input
              label="Full Name of Administrator"
              placeholder="Sarah Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-gray-400" />}
            />
          )}

          {/* Render Email address on login/signup/forgot */}
          {authMode !== 'otp' && (
            <Input
              label="Secure Account Email"
              type="email"
              placeholder="sarah.chen@nexus-ai.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
            />
          )}

          {/* Render Password on login and signup */}
          {(authMode === 'login' || authMode === 'signup') && (
            <Input
              label="Account Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
            />
          )}

          {/* Render OTP digit input only on multi-factor page */}
          {authMode === 'otp' && (
            <Input
              label="Digital Multi-Factor Key"
              placeholder="123456"
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              leftIcon={<KeyRound className="w-4 h-4 text-gray-400" />}
            />
          )}

          {/* Forgot link under Login */}
          {authMode === 'login' && (
            <button
              type="button"
              onClick={() => setAuthMode('forgot')}
              className="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 justify-end"
            >
              Forgot secure password credentials?
            </button>
          )}

          {/* Primary Operations Button submission */}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full text-xs py-2.5 font-bold shadow-md mt-2"
          >
            {authMode === 'login' && "CONTINUE TO MFA"}
            {authMode === 'signup' && "RESERVE WORKSPACE"}
            {authMode === 'forgot' && "TRANSMIT RECOVERY LINK"}
            {authMode === 'otp' && "CONFIRM TELEMETRY ACCESS"}
          </Button>
        </form>

        {/* SOCIAL AUTH DIVIDERS & BUTTONS - only on Login & Signup */}
        {(authMode === 'login' || authMode === 'signup') && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="h-px bg-gray-100 dark:bg-gray-900 flex-1" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono select-none">Or connect via</span>
              <span className="h-px bg-gray-100 dark:bg-gray-900 flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSocialClick("Google")}
                className="flex items-center justify-center gap-2 border border-gray-150/60 dark:border-gray-900 rounded-md py-1.5 px-3 bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-905 text-xs text-gray-600 dark:text-gray-300 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500/10"
              >
                <Chrome className="w-3.5 h-3.5" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick("GitHub")}
                className="flex items-center justify-center gap-2 border border-gray-150/60 dark:border-gray-900 rounded-md py-1.5 px-3 bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-905 text-xs text-gray-600 dark:text-gray-300 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500/10"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM SCREEN FOOTER TOGGLERS */}
        <div className="flex items-center justify-center gap-1 border-t border-gray-100 dark:border-gray-900/50 pt-4 text-xs font-semibold text-gray-550">
          {authMode === 'login' && (
            <>
              <span>New to the Telemetry app?</span>
              <button 
                onClick={() => setAuthMode('signup')}
                className="text-blue-500 hover:text-blue-600 hover:underline hover:scale-101 focus:outline-none"
              >
                Sign up instead
              </button>
            </>
          )}

          {authMode === 'signup' && (
            <>
              <span>Already configured a seat?</span>
              <button 
                onClick={() => setAuthMode('login')}
                className="text-blue-500 hover:text-blue-600 hover:underline hover:scale-101 focus:outline-none"
              >
                Sign in instead
              </button>
            </>
          )}

          {(authMode === 'forgot' || authMode === 'otp') && (
            <button
              onClick={() => {
                setAuthMode('login');
                setFormError("");
              }}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to secure Login</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
