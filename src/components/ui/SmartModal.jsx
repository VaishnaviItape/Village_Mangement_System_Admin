import React from "react";
import { X } from "lucide-react";

export default function SmartModal({ isOpen, onClose, title, onSave, children, isSaving = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full border border-slate-200 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100">
                
                {/* HEADER */}
                <div className="flex justify-between items-center border-b border-slate-200 px-6 py-4 bg-slate-50/80">
                    <h2 className="text-xl font-bold text-slate-800">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* SCROLLABLE FORM BODY */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {children}
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/80">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
