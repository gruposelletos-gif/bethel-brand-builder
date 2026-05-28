import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PageLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-background">{children}</main>
      <Footer />
    </>
  );
};

export default PageLayout;
