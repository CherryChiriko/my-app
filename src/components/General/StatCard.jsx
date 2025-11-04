import React from "react";

const StatCard = ({ icon, title, value, description, className = "" }) => (
  <div
    className={`rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300
      ${className}`}
  >
    <div className="mb-3">
      <h3 className="text-base font-medium flex items-center gap-3 opacity-90">
        {icon}
        {title}
      </h3>
    </div>
    <div>
      <div className="text-4xl font-bold mb-1">{value}</div>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  </div>
);

export default StatCard;
