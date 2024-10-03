import React, { useState, useEffect } from 'react';

const UnderMaintenance = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prevRotation) => (prevRotation + 10) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <svg
        className="w-32 h-32 mb-8"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`rotate(${rotation} 50 50)`}>
          <circle cx="50" cy="50" r="45" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
          <rect x="35" y="35" width="30" height="30" fill="#4b5563" />
          <circle cx="50" cy="50" r="5" fill="#f3f4f6" />
        </g>
      </svg>
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Under Maintenance</h1>
      <p className="text-xl text-gray-600 mb-8">
        We're currently performing some updates. Please check back soon!
      </p>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <p className="text-yellow-700">
          Estimated downtime: 2 hours. We apologize for any inconvenience.
        </p>
      </div>
    </div>
  );
};

export default UnderMaintenance;