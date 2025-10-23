import React, { useEffect } from 'react';

const PozeHome: React.FC = () => {
  useEffect(() => {
    // Redirect to the HTML file
    window.location.href = '/poze-home.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading new homepage...</p>
      </div>
    </div>
  );
};

export default PozeHome;
