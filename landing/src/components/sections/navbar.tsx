import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#workflow" },
  { label: "Proof", href: "#proof" },
  { label: "Download", href: "#download" },
];

export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4 py-3 md:px-8 lg:px-16">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3">
          <div className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full">
            <span className="font-heading text-2xl italic text-white">T</span>
          </div>
          <div className="hidden md:block">
            <p className="font-body text-sm font-medium text-white">TextAid</p>
            <p className="font-body text-xs text-white/50">AI writing for every tab</p>
          </div>
        </a>

        <nav className="hidden md:flex">
          <div className="liquid-glass flex items-center gap-1 rounded-full px-1.5 py-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-2 font-body text-sm font-medium text-white/90 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <Button asChild variant="secondary" size="sm" className="ml-1 rounded-full px-3.5 py-1.5">
              <a href="#download">
                Download App
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
