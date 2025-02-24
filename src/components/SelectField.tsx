import React from 'react';

import { SelectFieldProps } from '../interfaces/types';

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <select
                    value={value || ''}
                    onChange={onChange}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="" disabled>
                        Selecciona un activo
                    </option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name} ({option.symbol})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SelectField;