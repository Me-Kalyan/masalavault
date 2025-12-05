import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ChefHat size={20} className="text-primary" />
            <span className="font-bold text-lg">MasalaVault</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span>© {new Date().getFullYear()} MasalaVault</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

