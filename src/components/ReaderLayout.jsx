import Navbar from "./reader/Navbar";
import Footer from "./reader/Footer";

export default function ReaderLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}