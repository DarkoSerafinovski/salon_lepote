import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const { logout, getUserData } = useAuth();

  const user = getUserData();

  const navLinks = {
    vlasnica: [
      { name: "Usluge", path: "/services" },
      { name: "Kreiraj Uslugu", path: "/create-service" },
      { name: "Molbe Zaposlenih", path: "/service-requests" },
      { name: "Zaposleni", path: "/employees" },
      { name: "Nedeljni Raspored", path: "/schedule" },
    ],
    klijent: [
      { name: "Usluge", path: "/services" },
      { name: "Moje Rezervacije", path: "/my-bookings" },
    ],
    zaposleni: [
      { name: "Usluge", path: "/services" },
      { name: "Moj Raspored", path: "/employee-schedule" },
      { name: "Moje Dnevne Obaveze", path: "/my-daily-schedule" },
    ],
  };

  const getLinks = () => {
    if (["sminkerka", "manikirka"].includes(user.type)) {
      return navLinks.zaposleni;
    }
    return navLinks[user.type] || [];
  };

  const handleLogoutClick = async () => {
    await logout();
    onLogout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-pink-50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            to="/services"
            className="text-2xl font-serif italic text-pink-800 tracking-tight"
          >
            Aura Beauty
          </Link>

          <div className="hidden md:flex gap-6">
            {getLinks().map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-sm font-bold text-gray-500 hover:text-pink-800 uppercase tracking-widest transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user.name && (
            <span className="hidden sm:block text-xs font-medium text-gray-400 uppercase tracking-tighter">
              Dobrodošli,{" "}
              <span className="text-pink-800 font-bold">{user.name}</span>
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogoutClick}
            className="!rounded-full px-4 py-2 border-pink-600 text-pink-800 hover:bg-pink-50"
          >
            IZLOGUJ SE
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
