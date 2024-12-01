import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6">
      <div className=" from-white to-transparent">
        <div className="h-0.5 mb-2 bg-white"></div>
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          {/* Branding */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">Mini Me</h3>
            <p className="text-sm text-gray-400">Your content, your way.</p>
          </div>

          {/* Navigation Links */}
          <div className="mb-4 md:mb-0 space-x-4 text-sm">
            <a href="/" className="hover:text-gray-300">
              Home
            </a>
            <a href="/generate" className="hover:text-gray-300">
              Generate
            </a>
            <a href="/credentials" className="hover:text-gray-300">
              Credentials
            </a>
            <a href="/about" className="hover:text-gray-300">
              About
            </a>
            <a href="/contact" className="hover:text-gray-300">
              Contact
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
