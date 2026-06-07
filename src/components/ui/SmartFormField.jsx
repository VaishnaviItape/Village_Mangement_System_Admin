import React from "react";

export default function SmartFormField({ label, type = "text", value, onChange, options = [], placeholder = "Enter value", required = false, fullWidth = false }) {
    
    // Base classes for the input fields
    const baseClasses = "w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";

    const wrapperClasses = fullWidth ? "md:col-span-2" : "col-span-1";

    return (
        <div className={wrapperClasses}>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            {type === "select" ? (
                <select
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={baseClasses}
                >
                    <option value="" disabled>Select {label}</option>
                    {options.map((opt, idx) => {
                        // Options can be strings or objects {label, value}
                        const optVal = typeof opt === 'object' ? opt.value : opt;
                        const optLabel = typeof opt === 'object' ? opt.label : opt;
                        return (
                            <option key={idx} value={optVal}>{optLabel}</option>
                        );
                    })}
                </select>
            ) : type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    rows={4}
                    className={`${baseClasses} resize-none`}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={baseClasses}
                />
            )}
        </div>
    );
}
