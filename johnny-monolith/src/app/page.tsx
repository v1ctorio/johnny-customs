import Header from '@/components/Header/Header';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import Footer from '@/components/Footer/Footer';

export default function HomePage() {
  return (
    <>
      <Header/>
      <ColorSchemeToggle />
      <Footer />
    </>
  );
}
