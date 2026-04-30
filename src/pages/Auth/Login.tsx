import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Leaf, ArrowRight, Sprout, CloudSun, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const from = (location.state as any)?.from || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        localStorage.setItem("user", JSON.stringify({ email, role: "client" }));
        toast({ title: "Welcome back!", description: `Logged in as ${email}` });
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-emerald-300 blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">AgriAssist</span>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              कल की खेती<br />
              <span className="text-green-200">आज के हाथों में।</span>
            </h1>
            <p className="text-green-100 text-lg leading-relaxed">
              AI-powered farming tools to help you grow smarter, reduce costs, and maximize your harvest.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { icon: <Sprout className="h-4 w-4" />, text: "AI Crop Disease Detection" },
              { icon: <CloudSun className="h-4 w-4" />, text: "14-Day Agricultural Forecast" },
              { icon: <BarChart3 className="h-4 w-4" />, text: "Profit & Expense Tracker" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                <div className="text-green-200">{f.icon}</div>
                <span className="text-white text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-green-200 text-sm italic">"Trusted by 10,000+ farmers across India"</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">AgriAssist</span>
          </div>

          {from !== "/" && (
            <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
              🔒 Login required to access that page
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back 👋</h2>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your farmer account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
              <Input id="email" type="email" placeholder="farmer@example.com" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password"
                  required value={password} onChange={e => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-base pr-12" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl px-4 py-3 text-xs text-green-700 dark:text-green-400 flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">💡</span>
              <span>Demo: any valid email + password with 6+ characters</span>
            </div>
            <Button type="submit" disabled={isLoading}
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-base shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-gray-400 font-medium">NEW TO AGRIASSIST?</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          <Link to="/register">
            <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-semibold text-base hover:border-green-500 hover:text-green-600 transition-all">
              Create Free Farmer Account
            </Button>
          </Link>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our{" "}
            <a href="#" className="text-green-600 hover:underline">Terms</a> &{" "}
            <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;