import React from "react";

const MadeonTenflex = () => {
  return (
    <>
      <div className="mb-20 mt-20">
        <h2 className="text-3xl font-bold text-center mb-6">Made on TENFLEX</h2>

        <div className="columns-1 sm:columns-2 md:columns-4 gap-4 max-w-[1200px] mx-auto">
          {[
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
            "https://images.unsplash.com/photo-1519985176271-adb1088fa94c",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99",
            "https://images.unsplash.com/photo-1465101053361-763ab02bced9",
            "https://images.unsplash.com/photo-1465101053361-763ab02bced9",
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
            "https://images.unsplash.com/photo-1519985176271-adb1088fa94c",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
          ].map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Gallery ${idx}`}
              className="w-full mb-4 rounded-xl block break-inside-avoid shadow-md"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MadeonTenflex;
