
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">404</h1>
        <p className="text-xl text-gray-300 mb-6">The page you're looking for doesn't exist</p>
        <p className="text-gray-400 mb-8">
          The link you followed may be broken, or the page may have been removed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
