import React from 'react';

const Logo = ({ className = "h-10", imgClassName = "h-full w-auto object-contain" }) => {
    return (
        <div className={`overflow-hidden ${className}`}>
            <img
                src="/logo.png"
                alt="Clinixa Logo"
                className={imgClassName}
            />
        </div>
    );
};

export default Logo;
