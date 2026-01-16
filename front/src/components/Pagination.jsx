import React from "react";

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="mt-12 flex justify-center flex-wrap gap-2">
      {meta.links.map((link, idx) => (
        <button
          key={idx}
          disabled={!link.url || link.active}
          onClick={() => onPageChange(link.page)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all
                        ${
                          link.active
                            ? "bg-pink-800 text-white shadow-md"
                            : "bg-white text-gray-500 hover:bg-pink-50"
                        }
                        ${
                          !link.url
                            ? "opacity-30 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                    `}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  );
};

export default Pagination;
