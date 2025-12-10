import Link from "next/link";
import {  Github, Twitter, Instagram, Linkedin,  } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" border-t mt-28">
      <div className="container mx-auto px-6 py-14 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">


          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">

              StoryForge
            </Link>
            <p className="text-gray-600 max-w-xs text-sm leading-relaxed">
              Create magical stories with AI. Choose characters, settings,
              twists — and bring your imagination to life.
            </p>

            <div className="flex gap-3">
              <Link href="https://github.com/olagunju-oluwabukola">
                <Github className="h-5 w-5 text-gray-700 hover:text-blue-700" />
              </Link>
              <Link href="https://x.com/ofeyishayomi3">
                <Twitter className="h-5 w-5 text-gray-700 hover:text-blue-700" />
              </Link>
              <Link href="https://www.linkedin.com/in/oluwabukola-olagunju-434512229/">
                <Linkedin className="h-5 w-5 text-gray-700 hover:text-blue-700" />
              </Link>
            </div>
          </div>


          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link href="/create">Create Stories</Link></li>
              <li><Link href="/script">Generate Scripts</Link></li>
              <li><Link href="/library">My Library</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
          </div>


          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Templates</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link href="#">Horror</Link></li>
              <li><Link href="#">Comedy</Link></li>
              <li><Link href="#">Sci-Fi</Link></li>
              <li><Link href="#">Fantasy</Link></li>
              <li><Link href="#">Kids Mode</Link></li>
            </ul>
          </div>


          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get new templates, updates, and creative inspiration.
            </p>

            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-2 border rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white px-4 rounded-r-lg text-sm flex items-center gap-2"
              >

                Subscribe
              </button>
            </form>
          </div>
        </div>


        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} StoryForge. All rights reserved.
          </p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
