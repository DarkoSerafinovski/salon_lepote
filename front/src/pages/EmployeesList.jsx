import React, { useState, useEffect } from "react";
import api from "../api";
import EmployeeCard from "../components/EmployeeCard";
import Pagination from "../components/Pagination";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import EmployeeServicesModal from "../components/EmployeeSevicesModal";
import EmployeeScheduleModal from "../components/EmployeeScheduleModal";
import AssignScheduleModal from "../components/AssignScheduleModal";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchIme, setSearchIme] = useState("");
  const [searchPrezime, setSearchPrezime] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [scheduleEmployee, setScheduleEmployee] = useState(null);
  const [assigningEmployee, setAssigningEmployee] = useState(null);

  const [filters, setFilters] = useState({
    ime: "",
    prezime: "",
    email: "",
    type: "",
    radni_staz: "",
    page: 1,
    sort_by: "radni_staz",
    order: "desc",
    per_page: 8,
  });

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
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        ime: searchIme,
        prezime: searchPrezime,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchIme, searchPrezime]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "ime") {
      setSearchIme(value);
    } else if (name === "prezime") {
      setSearchPrezime(value);
    } else {
      setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    }
  };

  const handleViewServices = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleAssignNew = (employee) => {
    setScheduleEmployee(null); // Zatvaramo pregled
    setAssigningEmployee(employee); // Otvaramo formu
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-pink-900 mb-2">Naš Tim</h1>
          <p className="text-gray-500 italic">
            Upravljajte zaposlenima i njihovim performansama
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50 flex-1 ml-0 md:ml-10">
          <FormInput
            label="Ime"
            name="ime"
            value={searchIme}
            onChange={handleFilterChange}
            placeholder="Traži..."
          />
          <FormInput
            label="Prezime"
            name="prezime"
            value={searchPrezime}
            onChange={handleFilterChange}
          />
          <FormSelect
            label="Uloga"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "Sve uloge" },
              { value: "sminkerka", label: "Šminkerka" },
              { value: "manikirka", label: "Manikirka" },
            ]}
          />
          <FormSelect
            label="Sortiraj"
            name="sort_by"
            value={filters.sort_by}
            onChange={handleFilterChange}
            options={[
              { value: "ime", label: "Po imenu" },
              { value: "prezime", label: "Po prezimenu" },
              { value: "email", label: "Po email-u" },
              { value: "type", label: "Po profesiji" },
              { value: "radni_staz", label: "Po stažu" },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-pink-800 font-serif">
          Učitavanje tima...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {employees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onViewServices={() => handleViewServices(emp)}
                onViewSchedule={() => setScheduleEmployee(emp)} // NOVO
              />
            ))}
          </div>

          {selectedEmployee && (
            <EmployeeServicesModal
              employee={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
            />
          )}

          {scheduleEmployee && (
            <EmployeeScheduleModal
              employee={scheduleEmployee}
              onClose={() => setScheduleEmployee(null)}
              onAssignNew={handleAssignNew}
            />
          )}

          {assigningEmployee && (
            <AssignScheduleModal
              employee={assigningEmployee}
              onClose={() => setAssigningEmployee(null)}
            />
          )}

          <Pagination
            meta={meta}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesList;
