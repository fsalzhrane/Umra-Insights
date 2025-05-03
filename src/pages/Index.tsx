import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
const Index = () => {
  const {
    t,
    isRTL
  } = useLanguage();
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-umrah-purple-soft py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                {t("landing.title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                {t("landing.subtitle")}
              </p>
              <Link to="/survey">
                <Button className="bg-umrah-purple hover:bg-umrah-purple-dark text-lg h-auto px-[106px] py-[17px]">
                  {t("landing.cta")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 pattern-bg">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-umrah-purple-soft rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-umrah-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("landing.feature1.title")}</h3>
                <p className="text-gray-600">{t("landing.feature1.description")}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-umrah-purple-soft rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-umrah-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("landing.feature2.title")}</h3>
                <p className="text-gray-600">{t("landing.feature2.description")}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-umrah-purple-soft rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-umrah-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("landing.feature3.title")}</h3>
                <p className="text-gray-600">{t("landing.feature3.description")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-umrah-purple py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            
            <Link to="/survey">
              
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Index;