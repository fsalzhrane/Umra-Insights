
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export const VerificationForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, accept any code
      // In a real app, this would validate against a backend
      toast({
        title: "Success",
        description: "Verification successful",
      });
      
      // Store verification status in session
      sessionStorage.setItem("isVerified", "true");
      
      // Redirect to survey
      navigate("/survey");
    }, 1500);
  };

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">{t("verification.title")}</CardTitle>
        <CardDescription className="text-center">
          {t("verification.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                id="code"
                placeholder={t("verification.input.placeholder")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border-umrah-purple-light focus:border-umrah-purple"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-umrah-purple hover:bg-umrah-purple-dark" 
          onClick={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : t("verification.button")}
        </Button>
      </CardFooter>
    </Card>
  );
};
