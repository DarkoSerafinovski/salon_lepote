import React, { useState, useEffect, act } from "react";
import api from "../api";
import Alert from "../components/Alert";
import ServiceHeader from "../components/ServiceHeader";
import ServiceCard from "../components/ServiceCard";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState("");
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(10000);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    sort_by: "cena",
    order: "desc",
    page: 1,
    naziv: "",
    kategorija: "",
    max_cena: 10000,
  });

  const userType = localStorage.getItem("user_type");
  const isEmployee = ["sminkerka", "manikirka"].includes(userType);

  const getActionButtonProps = (service) => {
    const userType = localStorage.getItem("user_type");

    if (userType === "vlasnica") {
      return { label: "IZMENI", show: true };
    }

    if (["sminkerka", "manikirka"].includes(userType)) {
      if (activeTab === "mine") {
        return { label: "PREDLOŽI IZMENU", show: true };
      } else {
        return { label: "", show: false };
      }
    }

    return { label: "ZAKAŽI", show: true };
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === "mine") {
        response = await api.get("zaposleni/moje-usluge");
      } else {
        response = await api.get("/usluge", { params: filters });
      }

      const data = response.data.data;

      setServices(data);
      setMeta(response.data.meta);

      if (data.length > 0) {
        const highest = Math.max(...data.map((s) => s.cena_raw));

        if (highest > absoluteMaxPrice || filters.max_cena === "") {
          setAbsoluteMaxPrice(highest);
          if (filters.max_cena === "") {
            setFilters((prev) => ({ ...prev, max_cena: highest }));
          }
        }
      }
    } catch (err) {
      setError("Neuspešno učitavanje usluga.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, activeTab]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleAction = (service) => {
    if (["vlasnica", "sminkerka", "manikirka"].includes(userType)) {
      navigate(`/services/edit`, { state: { service } });
    } else if (userType === "klijent") {
      navigate(`/book/${service.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {isEmployee && (
        <div className="flex gap-4 mb-6 bg-white p-2 rounded-2xl w-fit shadow-sm border border-pink-50">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "all"
                ? "bg-pink-800 text-white"
                : "text-gray-400 hover:text-pink-800"
            }`}
          >
            Sve usluge
          </button>
          <button
            onClick={() => setActiveTab("mine")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "mine"
                ? "bg-pink-800 text-white"
                : "text-gray-400 hover:text-pink-800"
            }`}
          >
            Moje usluge
          </button>
        </div>
      )}

      {activeTab === "all" ? (
        <ServiceHeader
          filters={filters}
          onFilterChange={handleFilterChange}
          maxPrice={absoluteMaxPrice}
        />
      ) : (
        <div className="mb-10 bg-white p-10 rounded-[2rem] border border-pink-50 shadow-sm">
          <h1 className="text-3xl font-serif text-pink-900">Moji Tretmani</h1>
          <p className="text-gray-400 italic">
            Lista usluga koje vi obavljate u salonu
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-800"></div>
        </div>
      ) : services.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onAction={() => handleAction(service)}
                showAction={getActionButtonProps(service).show}
                actionLabel={getActionButtonProps(service).label}
              />
            ))}
          </div>

          <Pagination
            meta={meta}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </>
      ) : (
        <div className="py-10">
          <Alert
            type="info"
            variant="panel"
            message="Nema pronađenih usluga"
            description="Nažalost, nijedan tretman ne odgovara vašim trenutnim filterima. Pokušajte da proširite opseg cene ili promenite naziv pretrage."
          />
        </div>
      )}
    </div>
  );
};

export default ServicesList;
