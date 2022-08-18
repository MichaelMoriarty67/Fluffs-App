import React, { useState } from 'react';
import styles from '../styles/NFTCard.module.css';
import { isTokenMP4 } from '../../utils/index';

const NFTCard = ({data, callback, height}) => {
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        callback(data);
        setSelected(!selected);
    }

    return (
        <div className='flex justify-center items-center m-2' onClick={handleClick}>
            <div className={`w-${height} h-${height} rounded overflow-hidden`} >
                { isTokenMP4(data) ? (
                    <video loop autoPlay>
                        <source src={data.url} type="video/mp4" />
                    </video>
                ) : (
                    <img className='object-contain h-full w-full' src={data.url} />
                )}
            </div>
        </div>
    )
}

export default NFTCard;