import React from "react";
import { useEmployees } from "../hooks/useEmployees";
import Button from "../components/Button";
import EmployeeCard from "../components/EmployeeCard";
import Pagination from "../components/Pagination";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import EmployeeServicesModal from "../components/EmployeeSevicesModal";
import EmployeeScheduleModal from "../components/EmployeeScheduleModal";
import AssignScheduleModal from "../components/AssignScheduleModal";
import { useNavigate } from "react-router-dom";

const EmployeesList = () => {
  const {
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
  } = useEmployees({
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

  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex justify-between items-start w-full lg:w-auto">
          <div>
            <h1 className="text-4xl font-serif text-pink-900 mb-2">Naš Tim</h1>
            <p className="text-gray-500 italic">
              Upravljajte zaposlenima i njihovim performansama
            </p>
          </div>
          <div className="lg:hidden">
            <Button className="!rounded-full px-6">+ NOVI</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50 flex-1">
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
              { value: "radni_staz", label: "Po stažu" },
              { value: "ime", label: "Po imenu" },
              { value: "type", label: "Po profesiji" },
            ]}
          />
        </div>

        <div className="hidden lg:block">
          <Button
            className="!rounded-full px-8 py-4 shadow-lg shadow-pink-100 whitespace-nowrap"
            onClick={() => {
              navigate("/add-employee");
            }}
          >
            ZAPOSLI NOVOG
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-pink-800 font-serif italic text-xl">
          Učitavanje tima...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {employees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onViewServices={() => setSelectedEmployee(emp)}
                onViewSchedule={() => setScheduleEmployee(emp)}
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
              onAssignNew={(emp) => {
                setScheduleEmployee(null);
                setAssigningEmployee(emp);
              }}
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
