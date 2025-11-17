import { useState, useEffect, useRef } from "react";
import {
  User,
  Search,
  Filter,
  Plus,
  RotateCw,
  Upload,
  Edit,
  Trash,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

export default function SmartDataTable({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  showSerial,
  showAddButton = true,
  showActions = true,
  headerContent = null,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data || []);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRow, setSelectedRow] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const tableRef = useRef(null);


  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // ✅ Update useEffect for filtering logic
  useEffect(() => {
    let filtered = Array.isArray(data) ? data : [];
    // 🔍 Search filter
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // ⚙️ Status filter (Active/Inactive)
    if (statusFilter !== "All") {
      filtered = filtered.filter((row) =>
        row.isActive === (statusFilter === "Active" ? true : false)
      );
    }
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, data]);

  // 🔢 Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      const valA = a[key]?.toString().toLowerCase() ?? "";
      const valB = b[key]?.toString().toLowerCase() ?? "";
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  // ⌨️ Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown")
        setSelectedRow((prev) => Math.min(prev + 1, filteredData.length - 1));
      if (e.key === "ArrowUp") setSelectedRow((prev) => Math.max(prev - 1, 0));
      if (e.key === "Enter" && filteredData[selectedRow])
        onEdit?.(filteredData[selectedRow]);
      if (e.key === "Delete" && filteredData[selectedRow])
        onDelete?.(filteredData[selectedRow].id);
      if (e.key === "Escape") setSelectedRow(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [filteredData, selectedRow, onEdit, onDelete]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="text-gray-400" />;
    if (sortConfig.direction === "asc")
      return <ArrowUp size={14} className="text-indigo-500" />;
    return <ArrowDown size={14} className="text-indigo-500" />;
  };
  const onUpload = () => {
    alert("Upload button clicked!");
    // You can add file input, modal, API upload, etc.
  };


  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-slate-200 transition-all">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <User className="text-white" size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-indigo-100 text-sm">Manage your data efficiently</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* <button
              onClick={onAdd}
              className=" group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus size={18} className="transition-transform duration-300 rotate-hover"/>  Add
            </button> */}

            {/* ✅ Add button optional */}
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Upload size={18} />
              Upload
            </button>

            {showAddButton && (

              <button
                onClick={onAdd}
                className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Plus size={18} className="transition-transform duration-300 rotate-hover" /> Add
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="group flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <RotateCw size={18} className="rotate-hover" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      {/* <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
        <div className="relative w-full lg:w-80">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full lg:w-60">
          <Filter
            size={18}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div> */}

      {headerContent ? (
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          {headerContent}
        </div>
      ) : (
        // Default Search + Filter (if no custom header passed)
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
          <div className="relative w-full lg:w-80">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full lg:w-60">
            <Filter
              size={18}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto" ref={tableRef}>
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              {showSerial && (
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  #
                </th>
              )}
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort(col.accessor)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {getSortIcon(col.accessor)}
                  </div>
                </th>
              ))}
              {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th> */}
              {showActions && (
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedData?.map((row, i) => (
              <tr
                key={row.id}
                tabIndex={0}
                className={`transition-all duration-200 ${selectedRow === i ? "bg-indigo-50" : "hover:bg-slate-50"
                  }`}
                onClick={() => setSelectedRow(i)}
              >
                {showSerial && (
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {(currentPage - 1) * rowsPerPage + i + 1}
                  </td>
                )}
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 text-sm text-slate-700">
                    {col.cell ? col.cell(row) : row[col.accessor]}  {/* {row[col.accessor]} */}
                  </td>
                ))}
                {/* <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-200 text-blue-600 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(row.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-200 text-red-600 transition"
                  >
                    <Trash size={18} />
                  </button>
                </td> */}
                {showActions && (
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => onEdit(row)}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-200 text-blue-600 transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(row.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-200 text-red-600 transition"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Numbered Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 gap-3">
          {/* Page info */}
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </div>

          {/* Pagination bar */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all ${currentPage === 1
                ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all ${currentPage === page
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "text-gray-700 border-gray-300 hover:bg-indigo-100"
                    }`}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all ${currentPage === totalPages
                ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              Next
            </button>
          </div>

          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
