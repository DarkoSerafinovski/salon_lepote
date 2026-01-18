import { useState, useEffect } from "react";
import api from "../api";

export const useServices = (initialFilters) => {
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(0);
  const [filters, setFilters] = useState(initialFilters);
  const [requests, setRequests] = useState([]);

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
    } catch (err) {
      console.error("Greška pri učitavanju usluga");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchServices, 500);
    return () => clearTimeout(timer);
  }, [filters, activeTab]);

  useEffect(() => {
    if (services.length > 0 && activeTab === "all") {
      const highestInCurrentFetch = Math.max(
        ...services.map((s) => s.cena_raw || 0),
      );

      setAbsoluteMaxPrice((prevMax) => {
        if (highestInCurrentFetch > prevMax || prevMax === 0) {
          return highestInCurrentFetch;
        }
        return prevMax;
      });
    }
  }, [services, activeTab]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const createService = async (serviceData) => {
    setLoading(true);
    try {
      const response = await api.post("/vlasnica/usluge", serviceData);
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Došlo je do greške prilikom kreiranja usluge.";
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id, formData) => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("_method", "PUT");

      const response = await api.post(`/usluge/${id}`, data);
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Greška pri ažuriranju";
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vlasnica/usluge-izmene");
      setRequests(response.data.data);
    } catch (err) {
      console.error("Greška pri učitavanju molbi", err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceRequest = async (id, action) => {
    try {
      const response = await api.post(
        `/vlasnica/usluge-izmene/${id}/${action}`,
      );
      if (response.data.success) {
        if (action === "odobri") {
          await fetchRequests();
        } else {
          setRequests((prev) => prev.filter((req) => req.id !== id));
        }
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || `Greška pri akciji: ${action}`,
      };
    }
  };

  return {
    services,
    meta,
    loading,
    activeTab,
    setActiveTab,
    absoluteMaxPrice,
    filters,
    fetchServices,
    setFilters,
    handleFilterChange,
    handlePageChange,
    createService,
    updateService,
    requests,
    fetchRequests,
    handleServiceRequest,
  };
};
