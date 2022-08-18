import React from 'react';
import { isTokenMP4 } from '../../utils/index';

const NFTIcon = ({ height, data, margin }) => {

    return (
        <div className={`flex justify-center items-center m-${margin}`}>
            <div className={`w-${height} rounded overflow-hidden`} >
                {/* { isTokenMP4(data) ? (
                    <video loop autoPlay>
                        <source src={data.icon} type="video/mp4" />
                    </video>
                ) : (
                    <img className='object-contain h-full w-full' src={data.icon} />
                )} */}
                <img className='object-scale-down h-full w-full' src={data.icon} />
            </div>
        </div>
    )
}

export default NFTIcon;