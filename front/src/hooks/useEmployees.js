import { useState, useEffect } from "react";
import api from "../api";

export const useEmployees = (initialFilters) => {
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchIme, setSearchIme] = useState("");
  const [searchPrezime, setSearchPrezime] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [scheduleEmployee, setScheduleEmployee] = useState(null);
  const [assigningEmployee, setAssigningEmployee] = useState(null);

  const [filters, setFilters] = useState(initialFilters);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vlasnica/zaposleni", {
        params: filters,
      });
      setEmployees(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      console.error("Greška pri učitavanju zaposlenih", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        ime: searchIme,
        prezime: searchPrezime,
        page: 1,
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchIme, searchPrezime]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "ime") setSearchIme(value);
    else if (name === "prezime") setSearchPrezime(value);
    else setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const getEmployeeServices = async (employeeId) => {
    try {
      const response = await api.get(
        `/vlasnica/zaposleni/${employeeId}/usluge`
      );
      return response.data.data;
    } catch (err) {
      console.error("Greška pri dobavljanju usluga zaposlenog");
      return [];
    }
  };

  const updateEmployeeServices = async (employeeId, serviceIds) => {
    setLoading(true);
    try {
      const payload = {
        user_id: employeeId,
        usluge: serviceIds,
      };
      await api.post("/vlasnica/zaposleni/usluge", payload);
      return { success: true, message: "Usluge su uspešno ažurirane!" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Greška pri čuvanju usluga.",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    meta,
    loading,
    filters,
    setFilters,
    searchIme,
    searchPrezime,
    handleFilterChange,
    selectedEmployee,
    setSelectedEmployee,
    scheduleEmployee,
    setScheduleEmployee,
    assigningEmployee,
    setAssigningEmployee,
    refresh: fetchEmployees,
    getEmployeeServices,
    updateEmployeeServices,
  };
};
