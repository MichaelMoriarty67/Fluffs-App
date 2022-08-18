import React from 'react';
import styles from '../styles/Button.module.css';

const Button = ({ className, onClick, value, disabled = false}) => {

    const handleClick = () => {
        if (!disabled) {
            onClick();
        }
    }

    return (
        <button className={className} onClick={handleClick}>
            {/* <div className={className}>
                {value}
            </div> */}
            {value}
        </button>
    )
}

export default Button;