import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';

export default function MarketplaceAdmin() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axiosInstance.get('/api/sv/marketplace');
                setItems(res.data.data);
            } catch (err) {
                toast.error("Failed to load marketplace items");
            }
        };
        fetchItems();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">E-Marketplace Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((i) => (
                    <div key={i.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold uppercase">{i.item_type}</span>
                            <span className="text-lg font-black text-slate-800">₹{i.price}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{i.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">{i.description}</p>
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm font-semibold text-slate-700">Seller: {i.seller_name}</p>
                            <p className="text-sm text-slate-500">Contact: {i.contact_number}</p>
                        </div>
                    </div>
                ))}
            </div>
            {items.length === 0 && <p className="text-slate-500 text-center mt-10">No items in the marketplace.</p>}
        </div>
    );
}
