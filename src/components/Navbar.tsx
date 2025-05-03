import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Umbrella } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 rounded-full bg-umrah-purple flex items-center justify-center">
                <Umbrella className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 font-semibold text-foreground">Umrah Insights</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-foreground hover:text-umrah-purple">
              {t("nav.home")}
            </Link>
            {user && (
              <>
                <Link to="/survey" className="px-3 py-2 text-sm font-medium text-foreground hover:text-umrah-purple">
                  {t("nav.survey")}
                </Link>
                <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-foreground hover:text-umrah-purple">
                  {t("nav.dashboard")}
                </Link>
              </>
            )}
            {user ? (
              <Button variant="outline" onClick={handleSignOut}>
                {t("nav.logout")}
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline">
                  {t("nav.login")}
                </Button>
              </Link>
            )}
            <ThemeToggle />
            <LanguageSelector />
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-umrah-purple hover:bg-background focus:outline-none"
              onClick={toggleMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-background">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-umrah-purple"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.home")}
            </Link>
            {user && (
              <>
                <Link 
                  to="/survey" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-umrah-purple"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.survey")}
                </Link>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-umrah-purple"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.dashboard")}
                </Link>
              </>
            )}
            {user ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full justify-start"
              >
                {t("nav.logout")}
              </Button>
            ) : (
              <Link 
                to="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-umrah-purple"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.login")}
              </Link>
            )}
            <div className="px-3 py-2 flex space-x-4">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
