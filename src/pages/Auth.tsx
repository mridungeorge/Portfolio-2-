
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in."
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-lighter/30">
      <div className="w-full max-w-md glass p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-6 text-center gradient-text">
          Dashboard Login
        </h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass w-full"
              placeholder="email@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass w-full"
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button 
            type="submit"
            className="btn-cyber w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
