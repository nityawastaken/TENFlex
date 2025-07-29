import React from "react";

const Section = React.forwardRef(({ title, children, id }, ref) => (
  <div
    ref={ref}
    id={id}
    className="mb-10 bg-[#1a1333] rounded-2xl shadow-xl p-6 w-full max-w-3xl mx-auto border border-purple-900"
  >
    <h2 className="text-2xl font-bold text-purple-300 mb-6 tracking-wide text-center md:text-left">
      {title}
    </h2>
    {children}
  </div>
));
Section.displayName = "Section";
export default Section;