
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { verifyUmrahIdNumber, linkUmrahIdToUser } from "@/lib/survey-service";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const AuthForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginIdNumber, setLoginIdNumber] = useState("");
  const [loginIdValid, setLoginIdValid] = useState<boolean | null>(null);
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [signupIdNumber, setSignupIdNumber] = useState("");
  const [isIdValid, setIsIdValid] = useState<boolean | null>(null);
  
  // Function to verify ID number
  const checkIdNumber = async (idNumber: string, isLogin: boolean = false) => {
    if (!idNumber || idNumber.trim().length < 3) {
      if (isLogin) {
        setLoginIdValid(null);
      } else {
        setIsIdValid(null);
      }
      return;
    }
    
    try {
      const { valid } = await verifyUmrahIdNumber(idNumber);
      if (isLogin) {
        setLoginIdValid(valid);
      } else {
        setIsIdValid(valid);
      }
    } catch (error) {
      console.error("Error verifying ID:", error);
      if (isLogin) {
        setLoginIdValid(false);
      } else {
        setIsIdValid(false);
      }
    }
  };
  
  // Validate signup ID when it changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (signupIdNumber) {
        checkIdNumber(signupIdNumber);
      }
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [signupIdNumber]);

  // Validate login ID when it changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (loginIdNumber) {
        checkIdNumber(loginIdNumber, true);
      }
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [loginIdNumber]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (loginIdNumber && loginIdValid === false) {
      toast({
        title: "Invalid ID number",
        description: "The ID number you entered is not recognized as a valid Umrah participant ID.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    console.log("Logging in with:", loginEmail);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      console.log("Login successful:", data);

      // If ID number provided, link it to user
      if (loginIdNumber && loginIdValid && data.user) {
        try {
          await linkUmrahIdToUser(loginIdNumber, data.user.id);
        } catch (linkError) {
          console.error("Error linking ID:", linkError);
          // Continue even if linking fails, as login is successful
        }
      }

      try {
        // Get user profile to check if admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user?.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }

        console.log("User profile:", profile);

        toast({
          title: "Success",
          description: "Successfully signed in!",
        });

        // Redirect based on admin status
        if (profile?.is_admin) {
          navigate('/dashboard');
        } else {
          navigate('/survey');
        }
      } catch (err) {
        console.error("Error checking profile:", err);
        // Default redirect if profile check fails
        navigate('/survey');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!signupEmail || !signupPassword || !signupFullName || !signupIdNumber) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (!isIdValid) {
      toast({
        title: "Invalid ID number",
        description: "The ID number you entered is not recognized as a valid Umrah participant ID.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    console.log("Signing up with:", signupEmail);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupFullName,
            id_number: signupIdNumber,
          },
        },
      });

      if (error) throw error;

      console.log("Signup successful:", data);
      
      // If we have a valid ID number, link it to the user
      if (data.user && signupIdNumber && isIdValid) {
        try {
          await linkUmrahIdToUser(signupIdNumber, data.user.id);
        } catch (linkError) {
          console.error("Error linking Umrah ID:", linkError);
          // Continue even if linking fails, as account is created
        }
      }

      toast({
        title: "Success",
        description: "Account created! Please check your email for confirmation.",
      });

      // Auto-login after signup if email verification is not required
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: signupEmail,
          password: signupPassword,
        });

        if (signInError) {
          console.log("Auto-login after signup failed:", signInError);
          // If auto-login fails, stay on the login page
          return;
        }

        navigate('/survey');
      } catch (loginError) {
        console.error("Auto-login error:", loginError);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Account Access</CardTitle>
        <CardDescription>Sign in or create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-id-number">Umrah ID Number</Label>
                <div className="relative">
                  <Input
                    id="login-id-number"
                    placeholder="Umrah ID Number (optional if already linked)"
                    value={loginIdNumber}
                    onChange={(e) => setLoginIdNumber(e.target.value)}
                    className={`pr-10 ${
                      loginIdValid === true ? "border-green-500" : 
                      loginIdValid === false ? "border-red-500" : ""
                    }`}
                  />
                  {loginIdNumber && loginIdValid !== null && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {loginIdValid ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {loginIdNumber && loginIdValid === false && (
                  <p className="text-xs text-red-500 mt-1">
                    ID not recognized. Please enter a valid Umrah participant ID.
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-xs text-center text-muted-foreground pt-2">
                <p>Admin login: admin@example.com / Admin123!</p>
                <p>Demo user with Umrah ID: Use 1118009354</p>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="full-name"
                  placeholder="Full Name"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id-number">Umrah ID Number <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="id-number"
                    placeholder="Umrah ID Number"
                    value={signupIdNumber}
                    onChange={(e) => setSignupIdNumber(e.target.value)}
                    className={`pr-10 ${
                      isIdValid === true ? "border-green-500" : 
                      isIdValid === false ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {isIdValid !== null && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {isIdValid ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {isIdValid === false && (
                  <p className="text-xs text-red-500 mt-1">
                    ID not recognized. Please enter a valid Umrah participant ID.
                  </p>
                )}
                {isIdValid === true && (
                  <p className="text-xs text-green-500 mt-1">
                    ID validated successfully!
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password <span className="text-red-500">*</span></Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
