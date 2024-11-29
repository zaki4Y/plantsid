import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="plant-id-theme">
      <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-background/50 to-background">
        <Navbar />
        <main className="flex-1">
          <Hero />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;