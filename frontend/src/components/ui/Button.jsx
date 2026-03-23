import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    icon: Icon,
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${className} ${loading ? 'loading' : ''}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && <div className="spinner"></div>}
            {!loading && Icon && <Icon size={18} />}
            <span>{children}</span>
        </button>
    );
};

export default Button;
