
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background flex items-center justify-center py-12">
        <AuthForm />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
