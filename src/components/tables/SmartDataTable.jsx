import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RotateCw,
} from "lucide-react";

export default function SimpleProfessionalTable({
  title = "Village Management System",
  columns = [],
  data = [],
  onAdd,
  onEdit,
  onDelete,
  showAddButton = true,
  showActions = true,
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search Filter
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  // Reset page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  return (
    <div className="w-full bg-transparent">

      {/* Main Card */}
      <div className="w-full bg-transparent overflow-hidden">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-2 py-5 bg-transparent mb-4">

          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {title}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage all records easily
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[250px] border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Add Button */}
            {showAddButton && (
              <button
                onClick={onAdd}
                className="px-4 py-2.5 bg-emerald-700 text-white rounded-xl flex items-center gap-2 hover:bg-emerald-800 shadow-sm transition"
              >
                <Plus size={18} />
                Add
              </button>
            )}

            {/* Refresh */}
            <button
               onClick={() => window.location.reload()}
              className="px-4 py-2.5 bg-white shadow-sm border-transparent rounded-xl flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition"
            >
              <RotateCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto overflow-y-hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <table className="w-full min-w-[900px] border-separate border-spacing-y-3">

            {/* Table Head */}
            <thead className="bg-transparent">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  #
                </th>

                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
                  >
                    {col.header}
                  </th>
                ))}

                {showActions && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className="bg-white shadow-sm hover:shadow-md transition-all group"
                  >
                    <td className="px-6 py-4 text-sm text-slate-600 rounded-l-2xl border-l-4 border-transparent group-hover:border-emerald-500">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>

                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 text-sm text-slate-700"
                      >
                        {col.cell
                          ? col.cell(row)
                          : row[col.accessor]}
                      </td>
                    ))}

                    {showActions && (
                      <td className="px-6 py-4 rounded-r-2xl">
                        <div className="flex items-center gap-2">

                          {/* Edit */}
                          <button
                            onClick={() => onEdit?.(row)}
                            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                          >
                            <Edit size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDelete?.(row.id)}
                            className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length + (showActions ? 2 : 1)
                    }
                    className="text-center py-14 text-slate-400"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4 py-4 border-t border-slate-100 bg-white rounded-b-2xl shadow-sm">
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-semibold text-slate-700">{Math.min(currentPage * rowsPerPage, filteredData.length)}</span> of <span className="font-semibold text-slate-700">{filteredData.length}</span> entries
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Rows:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
              >
                {[5, 10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm transition"
              >
                Prev
              </button>
              
              <span className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white rounded-md shadow-sm">
                {currentPage} / {Math.max(1, totalPages)}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}