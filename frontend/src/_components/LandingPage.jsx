import {
  Code2,
  Play,
  Zap,
  Github,
  Terminal,
  Check,
  Twitter,
  Linkedin,
  VideoIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../store/authStore";

const LandingPage = () => {
  const { token, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Modern Dark Nav */}
      <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Code2 className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-lg text-white">Corner</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {token ? (
              <>
                <NavLink
                  to="/projects"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/create-room"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Create Room
                </NavLink>
                <button
                  onClick={logout}
                  className="bg-red-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="bg-blue-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        {/* Refined Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Code Smarter: Collaborative Editor with Video Chat
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto mt-8">
            Real-time code editing with video chat and project saving for
            seamless collaboration. Write better code in half the time.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
              <Play className="mr-2 h-4 w-4" />
              Start Coding
            </button>
            <button className="border border-gray-700 text-gray-300 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </button>
          </div>
        </div>

        {/* Modern Code Preview */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl mb-20">
          <div className="border-b border-gray-800 p-4 flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80"></div>
          </div>
          <div className="grid grid-cols-2 gap-0 divide-x divide-gray-800">
            <div className="p-6">
              <pre className="text-blue-400 font-mono text-sm">
                <code>
                  {`
  function calculateTotal(items) {
    return items.reduce((sum, item) => 
      sum + item.price * item.quantity, 
      0
    );
  }`}
                </code>
              </pre>
            </div>
            <div className="bg-gray-900 p-6">
              <div className="text-sm text-gray-400 font-mono">
                Preview Output:
                <div className="mt-3 p-3 bg-gray-800 rounded-lg text-gray-300">
                  Function ready to calculate total price of items in cart
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refined Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="bg-blue-500/10 p-2 rounded-lg w-fit mb-4">
              <VideoIcon className="h-5 w-5 text-blue-500"></VideoIcon>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Video Conference Room
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Seamlessly connect with your team through high-quality video calls
              for efficient real-time collaboration.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="bg-purple-500/10 p-2 rounded-lg w-fit mb-4">
              <Terminal className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Real-Time Preview
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              See your code come to life instantly with our real-time preview
              feature. Perfect for web development.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="bg-green-500/10 p-2 rounded-lg w-fit mb-4">
              <Zap className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Optimized for performance with instant responses and seamless
              integration with your workflow.
            </p>
          </div>
        </div>

        {/* Modern CTA Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 mb-20">
          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Ready to Transform Your Coding Experience?
            </h2>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of developers who are already coding smarter, not
              harder.
            </p>
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Get Started Free
            </button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-blue-800/50 backdrop-blur-3xl"></div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-4xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400">Choose the plan thats right for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Plan */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
              <h3 className="text-white font-medium mb-2">Basic</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">₹0</span>
                <span className="text-gray-400 ml-2">forever</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Ideal for beginners and personal projects
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 5 projects",
                  "2GB storage",
                  "Basic AI suggestions",
                  "No video conferencing",
                  "Community support",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-sm text-gray-300"
                  >
                    <Check className="h-4 w-4 text-blue-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-900 rounded-xl border border-blue-500 p-6 relative">
              <div className="absolute -top-3 right-4 bg-blue-500 text-white text-xs py-1 px-3 rounded-full">
                Best Value
              </div>
              <h3 className="text-white font-medium mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">₹100</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                For professionals and teams
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 50 projects",
                  "20GB storage",
                  "Advanced AI features",
                  "Video conferencing support",
                  "Priority support",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-sm text-gray-300"
                  >
                    <Check className="h-4 w-4 text-blue-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <NavLink
                to={"https://buy.stripe.com/test_eVadT0dUcaR1dZ64gi"}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Start Free Trial
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Product */}
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "Documentation", "Changelog"].map(
                  (item) => (
                    <li key={item}>
                      <button className="text-sm text-gray-400 hover:text-white transition-colors">
                        {item}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Community", "Help Center", "Status", "Terms"].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-medium mb-4">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to our newsletter for updates and tips.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none flex-grow"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Code2 className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-white">Corner</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4 md:mt-0">
              © {new Date().getFullYear()} CodeAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
