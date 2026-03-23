import React from 'react';

const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <div className={`input-wrapper ${error ? 'error' : ''}`}>
                {Icon && <Icon size={18} className="input-icon" />}
                <input {...props} />
            </div>
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default Input;
