"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
    scrolled
      ? "backdrop-blur-xl bg-white/20 "
      : ""
  }`}

    >
      <div className="container mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl"
          onClick={closeMenu}
        >

          FableCraft
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
  <Link
    href="/create"
    className="relative after:block after:w-0 after:h-[2px] after:bg-blue-700 after:transition-all after:duration-500 after:ease-out hover:after:w-full after:absolute after:-bottom-0.5 after:left-0"
  >
    Create
  </Link>
  <Link
    href="/script"
    className="relative after:block after:w-0 after:h-[2px] after:bg-blue-700 after:transition-all after:duration-500 after:ease-out hover:after:w-full after:absolute after:-bottom-0.5 after:left-0"
  >
    Scripts
  </Link>
  <Link
    href="/library"
    className="relative after:block after:w-0 after:h-[2px] after:bg-blue-700 after:transition-all after:duration-500 after:ease-out hover:after:w-full after:absolute after:-bottom-0.5 after:left-0"
  >
    Library
  </Link>
</nav>

        <div className="hidden md:block">
          <Link href="/create">
            <Button
              size="sm"
              className="bg-blue-700 hover:bg-transparent hover:text-blue-700 hover:border-2 border-blue-700 text-white rounded-3xl"
            >
              Create Story
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={toggleMenu}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div
          className={`md:hidden backdrop-blur-xl bg-white/20 border-t border-white/30 transition-all`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4 text-base font-medium">
            <Link href="/create" onClick={closeMenu}>Create</Link>
            <Link href="/script" onClick={closeMenu}>Scripts</Link>
            <Link href="/library" onClick={closeMenu}>Library</Link>

            <Link href="/create" onClick={closeMenu}>
              <Button
                className="bg-blue-700  hover:bg-blue-700 w-full"
              >
                Create Story
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
