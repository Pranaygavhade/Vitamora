import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center
                 transition-all duration-300 hover:scale-110 active:scale-95
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
      style={{
        background: 'linear-gradient(135deg, #167A45 0%, #1e5234 100%)',
        boxShadow: '0 4px 20px rgba(22,122,69,0.40)',
        color: 'var(--color-cream)',
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
