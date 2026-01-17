import React from "react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf9] px-4 font-sans text-gray-800">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-in fade-in zoom-in duration-700">
          <h1 className="text-4xl font-serif italic text-pink-800 mb-2">
            Aura Beauty
          </h1>
          <div className="h-0.5 w-16 bg-pink-200 mx-auto"></div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-pink-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-center mb-2">{title}</h2>
            <p className="text-center text-gray-500 text-sm mb-8">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
