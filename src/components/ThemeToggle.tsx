
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleToggleTheme = () => {
    toggleTheme();
    toast({
      title: theme === "light" 
        ? "Dark mode enabled" 
        : "Light mode enabled",
      description: theme === "light"
        ? "The interface has switched to dark mode."
        : "The interface has switched to light mode.",
      duration: 2000,
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleTheme}
      className="w-10 h-10 rounded-full transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-0'}`} />
      <span className="sr-only">
        {theme === "dark" ? t("nav.toggle.light") : t("nav.toggle.dark")}
      </span>
    </Button>
  );
}
