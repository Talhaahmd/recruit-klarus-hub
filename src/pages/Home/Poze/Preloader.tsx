import React, { useEffect, useState } from 'react';

const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="cs_perloader">
      <div className="cs_perloader_in">
        <div className="cs_perloader_dots_wrap">
          <div className="cs_perloader_dots">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
        </div>
      </div>
      <span className="cs_perloader_text">Loading...</span>
    </div>
  );
};

export default Preloader;

