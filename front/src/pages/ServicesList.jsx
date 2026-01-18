import React from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../hooks/useServices";
import Alert from "../components/Alert";
import ServiceHeader from "../components/ServiceHeader";
import ServiceCard from "../components/ServiceCard";
import Pagination from "../components/Pagination";
import BookingModal from "../components/BookingModal";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import { useBookings } from "../hooks/useBookings";

const ServicesList = () => {
  const navigate = useNavigate();
  const { getUserData } = useAuth();

  const user = getUserData();

  const isEmployee = ["sminkerka", "manikirka"].includes(user.type);

  const {
    services,
    meta,
    loading,
    activeTab,
    setActiveTab,
    absoluteMaxPrice,
    filters,
    handleFilterChange,
    handlePageChange,
  } = useServices({
    sort_by: "cena",
    order: "desc",
    page: 1,
    naziv: "",
    kategorija: "",
  });

  const { selectedService, setSelectedService } = useBookings();

  const getButtonProps = () => {
    if (user.type === "vlasnica") return "IZMENI";
    if (isEmployee) {
      return activeTab === "mine" ? "PREDLOŽI IZMENU" : "";
    }
    return "ZAKAŽI";
  };

  const handleAction = (service) => {
    if (["vlasnica", "sminkerka", "manikirka"].includes(user.type)) {
      navigate(`/services/edit`, { state: { service } });
    } else {
      setSelectedService(service);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {isEmployee && (
        <div className="flex gap-4 mb-6 bg-white p-2 rounded-2xl w-fit shadow-sm border border-pink-50">
          {["all", "mine"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? "default" : "outline"}
              className={`!rounded-xl !px-6 !py-2 !text-sm !font-bold !border-none ${
                activeTab !== tab ? "!text-gray-400 hover:!text-pink-800" : ""
              }`}
            >
              {tab === "all" ? "Sve usluge" : "Moje usluge"}
            </Button>
          ))}
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
        <div className="flex justify-center py-20 animate-pulse">
          <div className="h-12 w-12 border-b-2 border-pink-800 rounded-full animate-spin"></div>
        </div>
      ) : services.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onAction={() => handleAction(service)}
                actionLabel={getButtonProps()}
              />
            ))}
          </div>

          {selectedService && (
            <BookingModal
              service={selectedService}
              onClose={() => setSelectedService(null)}
            />
          )}

          <Pagination meta={meta} onPageChange={handlePageChange} />
        </>
      ) : (
        <Alert
          type="info"
          variant="panel"
          message="Nema pronađenih usluga"
          description="Pokušajte da promenite filtere pretrage."
        />
      )}
    </div>
  );
};

export default ServicesList;
