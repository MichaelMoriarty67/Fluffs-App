import React, { useState} from 'react';
import { Button } from '../../components/index';
import styles from './styles/Connect.module.css';

const Connect = ({connection}) => {
    const [value, setValue] = useState("CONNECT VIA 🔌");
    const [disabled, setDisabled] = useState(false);

    return (
        <div className="h-screen items-center justify-center flex">
            <Button
            disabled={disabled}
            value={value}
            onClick={connection}
            // className='bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 h-20 w-64 rounded-3xl px-8'
            className='h-20 w-64 rounded-3xl px-8 plug-gradient'
            />
            {/* <Button
            disabled={disabled}
            value={value}
            onClick={connection}
            className={styles.plugButton}
            /> */}
        </div>
    );
};

export default Connect;