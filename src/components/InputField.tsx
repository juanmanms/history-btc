import React from 'react';

import { InputFieldProps } from '../interfaces/types';

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, placeholder, step, min, icon }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={placeholder}
                    step={step}
                    min={min}
                    required
                />
                {icon}
            </div>
        </div>
    );
};

export default InputField;