// import { useEffect, useState } from "react";
// import { getCountries, addCountry, updateCountry, deleteCountry } from "../services/countryService";
// import toast from "react-hot-toast";

// export default function CountryList() {
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCountry, setEditingCountry] = useState(null);
//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");

//   const fetchCountries = async () => {
//     try {
//       setLoading(true);
//       const res = await getCountries();
//       setCountries(res.data);
//     } catch {
//       toast.error("Failed to fetch countries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCountries();
//   }, []);

//   const openAddModal = () => {
//     setEditingCountry(null);
//     setName("");
//     setCode("");
//     setShowModal(true);
//   };

//   const openEditModal = (country) => {
//     setEditingCountry(country);
//     setName(country.name);
//     setCode(country.code);
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       setLoading(true);
//       await deleteCountry(id);
//       toast.success("Deleted successfully");
//       fetchCountries();
//     } catch {
//       toast.error("Delete failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       if (editingCountry) {
//         await updateCountry(editingCountry.id, { name, code });
//         toast.success("Updated successfully");
//       } else {
//         await addCountry({ name, code });
//         toast.success("Added successfully");
//       }
//       setShowModal(false);
//       fetchCountries();
//     } catch {
//       toast.error("Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="p-6 border-b border-slate-200 flex justify-between items-center">
//           <h3 className="text-lg font-bold text-slate-800">Countries</h3>
//           <button
//             onClick={openAddModal}
//             className="hidden lg:flex items-center space-x-2 py-2 px-4 bg-gradient-to-r
//             from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-a"
//           >
//             Add Country
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-slate-50">
//                 <th className="text-left p-4 text-sm font-semibold text-slate-600">Name</th>
//                 <th className="text-left p-4 text-sm font-semibold text-slate-600">Code</th>
//                 <th className="text-left p-4 text-sm font-semibold text-slate-600">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {countries.map((c) => (
//                 <tr key={c.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
//                   <td className="p-4 text-sm font-medium text-slate-800">{c.name}</td>
//                   <td className="p-4 text-sm text-slate-800">{c.code}</td>
//                   <td className="p-4 space-x-2">
//                     <button
//                       onClick={() => openEditModal(c)}
//                       className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition text-sm"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(c.id)}
//                       className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition text-sm"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal (slide-in without black overlay) */}
//       {showModal && (
//         <div className="fixed inset-0 flex justify-center items-center z-50">
//           <div
//             className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-lg transform transition-transform duration-300"
//           >
//             <h3 className="text-lg font-bold mb-4">
//               {editingCountry ? "Edit Country" : "Add Country"}
//             </h3>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
//                   Code
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                   value={code}
//                   onChange={(e) => setCode(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
//                 >
//                   {editingCountry ? "Update" : "Add"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





///-----------------------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
  getCountries,
  addCountry,
  updateCountry,
  deleteCountry,
} from "../services/countryService"
import toast, { Toaster } from "react-hot-toast";

export default function CountryPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formData, setFormData] = useState({ name: "", code: "" });

  // 🔄 Fetch Countries
  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await getCountries();
      setCountries(res.data);
    } catch (err) {
      toast.error("Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // 🧾 Handle Add Button Click
  const handleAdd = () => {
    setEditingCountry(null);
    setFormData({ name: "", code: "" });
    setIsModalOpen(true);
  };

  // ✏️ Handle Edit Button Click
  const handleEdit = (country) => {
    setEditingCountry(country);
    setFormData({ name: country.name, code: country.code });
    setIsModalOpen(true);
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this country?")) return;
    try {
      await deleteCountry(id);
      toast.success("Country deleted!");
      fetchCountries();
    } catch {
      toast.error("Failed to delete country");
    }
  };

  // 💾 Save (Add or Update)
  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingCountry) {
        await updateCountry(editingCountry.id, formData);
        toast.success("Country updated successfully!");
      } else {
        await addCountry(formData);
        toast.success("Country added successfully!");
      }
      setIsModalOpen(false);
      fetchCountries();
    } catch {
      toast.error("Failed to save country");
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Country Name", accessor: "name" },
    { header: "Country Code", accessor: "code" },
  ];

  return (
    <div className="p-8 space-y-6">
       <Toaster
                position="top-center"  // top-right → top-center
                toastOptions={{
                    style: {minWidth: '400px', fontSize: '25px', padding: '18px 26px'},
                }}
            />

      <SmartDataTable
        title="Country Management"
        columns={columns}
        data={countries}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showSerial={true}
      />

      {/* Loader Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ✨ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[400px] p-6 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {editingCountry ? "Edit Country" : "Add New Country"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Country Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter country name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Country Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter country code"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {editingCountry ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
