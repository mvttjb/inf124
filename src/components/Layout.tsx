import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 w-full">
      <Navbar />
      {/* pt-20 on mobile clears the fixed top bar; normal padding on desktop */}
      <main className="flex-1 px-4 md:px-6 lg:px-8 pb-6 pt-20 md:pt-6 lg:pt-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
