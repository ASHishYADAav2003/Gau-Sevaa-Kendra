import { Link } from "react-router";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-orange-600 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for seems to have wandered off like one of our rescue cows.
            Let's help you find your way back.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </Link>
          <Link
            to="/animals"
            className="inline-flex items-center justify-center bg-white text-orange-600 border-2 border-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Animals
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link to="/donate" className="text-orange-600 hover:text-orange-700 font-semibold">
              Make a Donation →
            </Link>
            <Link to="/animals" className="text-orange-600 hover:text-orange-700 font-semibold">
              Meet Our Animals →
            </Link>
            <Link to="/transparency" className="text-orange-600 hover:text-orange-700 font-semibold">
              View Transparency →
            </Link>
            <Link to="/volunteer" className="text-orange-600 hover:text-orange-700 font-semibold">
              Become a Volunteer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
