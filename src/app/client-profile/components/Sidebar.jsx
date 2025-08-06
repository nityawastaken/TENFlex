
const Sidebar = ({ handleNav, refs }) =>{
  
  return (
    <nav
      className="sticky top-24 w-full sm:w-[80vw] md:w-[18vw] max-w-xs text-white bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-4 sm:px-4 md:p-4 border border-gray-700/50 z-30"
      style={{ minWidth: '200px' }}
    >
      <ul className="flex flex-col gap-1">
        {[
          // ["Profile", refs.profileRef],
          ["Projects", refs.projectsRef],
          ["Orders", refs.ordersRef],
          ["Reviews", refs.reviewsRef],
          ["Giglists", refs.giglistsRef],
        ].map(([label, ref], idx) => (
          <li key={label} className="w-full">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-left font-medium text-gray-300 hover:text-white cursor-pointer hover:bg-gray-800/60 focus:outline-none focus:ring-1 focus:ring-gray-500"
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
