
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Landmark, 
  ArrowRight, 
  Shield, 
  Banknote, 
  PiggyBank, 
  Users 
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <Landmark className="h-8 w-8" />
              <span className="text-xl font-bold">Universal Unit SACCO</span>
            </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-white text-blue-700 hover:bg-gray-100">
                  Register
                </Button>
              </Link>
            </div>
          </nav>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Financial Growth in Kiambu Community
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Join Universal Unit SACCO to save, grow, and achieve your financial goals with our supportive community-focused cooperative.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 font-semibold">
                Become a Member <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Universal Unit SACCO?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Savings</h3>
              <p className="text-gray-600">Your savings are protected and grow with competitive interest rates in a regulated environment.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                <Banknote className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Affordable Loans</h3>
              <p className="text-gray-600">Access a variety of loan products with competitive rates and flexible repayment options.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                <PiggyBank className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Financial Education</h3>
              <p className="text-gray-600">Learn financial management skills through our workshops and resources for members.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Members Say</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="italic text-gray-600 mb-4">
                "Universal Unit SACCO helped me secure funding for my small business. Their support and guidance has been invaluable to my growth."
              </p>
              <p className="font-semibold">Jane Wambui, Small Business Owner</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="italic text-gray-600 mb-4">
                "The savings program allowed me to save consistently and eventually build my family home. I'm grateful for their financial advice."
              </p>
              <p className="font-semibold">John Maina, Teacher</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to secure your financial future?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of members who are building their financial security with Universal Unit SACCO.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 font-semibold">
                Join Now
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                Member Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-6 w-6" />
                <span className="text-lg font-bold">Universal Unit SACCO</span>
              </div>
              <p className="text-gray-400">Empowering financial growth in our community since 2005.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400">Kiambu Road, Kiambu</p>
              <p className="text-gray-400">P.O. Box 1234-00100</p>
              <p className="text-gray-400">info@universalunitsacco.co.ke</p>
              <p className="text-gray-400">+254 700 123 456</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Products</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-blue-400">Facebook</a>
                <a href="#" className="hover:text-blue-400">Twitter</a>
                <a href="#" className="hover:text-blue-400">Instagram</a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Universal Unit SACCO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
