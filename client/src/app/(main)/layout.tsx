import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ClientAnimations } from "@/components/animations/client-animations";
import { PageTransition } from "@/providers/page-transition";
import { LoadingScreen } from "@/components/layout/loading-screen";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClientAnimations />
      <SmoothScrollProvider>
        <LoadingScreen />
        <Navbar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}
