
import { Terminal } from "lucide-react"; // Adjust this import based on your icon library
import { Button } from "../components/ui/button.jsx"; // Adjust the import path based on your project structure

function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Terminal className="h-8 w-8 text-emerald-500" />
          <span className="text-xl font-bold">CodeForge AI</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a className="text-sm hover:text-emerald-400 transition-colors" href="#features">
            Features
          </a>
          <a className="text-sm hover:text-emerald-400 transition-colors" href="#pricing">
            Pricing
          </a>
          <a className="text-sm hover:text-emerald-400 transition-colors" href="#about">
            About
          </a>
          <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
            Login
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
