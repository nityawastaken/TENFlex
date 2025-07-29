import React from "react";
import Section from "../Section";

const FreelancersSection = ({ refProp, freelancers }) => {
  return (
    <Section ref={refProp} id="saved_freelancers" title="Saved Freelancers">
      {freelancers.length === 0 ? (
        <div className="text-gray-400 text-center py-8 text-lg">No freelancers saved yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl mx-auto justify-center">
          {freelancers.map((f) => (
            <div
              key={f.id}
              className="bg-gradient-to-br from-[#24194a] via-[#1a0d2b] to-[#28163a] p-6 rounded-2xl flex flex-col items-center shadow-lg border border-purple-900 transition-transform hover:scale-[1.03] hover:shadow-2xl min-w-[180px] max-w-xs mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-purple-700 flex items-center justify-center text-2xl font-bold mb-3 text-white shadow-md">
                {f.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="font-semibold text-lg text-white mb-1 text-center truncate w-full" title={f.name}>{f.name}</div>
              <div className="text-purple-300 text-sm mb-2 text-center w-full truncate" title={f.skill}>{f.skill}</div>
              {/* Add more info here if needed */}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
};

export default FreelancersSection;
