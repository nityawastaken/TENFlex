
const Sidebar = ({ handleNav, refs }) =>{
  
  return (
    <nav
      className="sticky top-24 w-full sm:w-[80vw] md:w-[18vw] max-w-xs text-white bg-gradient-to-br from-[#24194a] via-[#1a0d2b] to-[#28163a] rounded-b-xl rounded-t-lg shadow-2xl px-2 py-4 sm:px-4 md:p-6 border border-purple-900 z-30"
      style={{ minWidth: '200px' }}
    >
      <ul className="flex flex-col gap-2 sm:gap-3">
        {[
          // ["Profile", refs.profileRef],
          ["Projects", refs.projectsRef],
          ["Orders", refs.ordersRef],
          ["Reviews", refs.reviewsRef],
          ["Giglists", refs.giglistsRef],
        ].map(([label, ref], idx) => (
          <li key={label} className="w-full">
            <button
              className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 rounded-lg transition text-left font-semibold text-purple-100 hover:text-white cursor-pointer hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onClick={() => handleNav(ref)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default Sidebar;
