import React, { useState } from 'react';
import styles from '../styles/Folder.module.css';
import { NFTCard } from '../index';
import { FaChevronRight } from "react-icons/fa";

const Folder = ({openComponent, title, callback}) => {
    const [status, setStatus] = useState(false);
    

    return (
        <div className='flex flex-col w-full mt-12 mb-4' onClick={() => setStatus(!status)}>
            <hr />
            <div className='flex flex-row justify-between pt-4 mb-6'>
                <p>{title}</p>
                <span className={`flex flex-col justify-center ${ status ? 'transition duration-500 transform rotate-90' : 'transition duration-500 transform -rotate-90'}`}>
                    <FaChevronRight />
                </span>
            </div>
                        
            <div className={`${ status ? '' : 'hidden'}`}>
                {openComponent}
            </div>


            {
            
            // this rerenders on every open

            /* { status ? (
                <>
                    {openComponent}
                </>
            ) : (
                <></>
            )} */}
        </div>
    )
}

export default Folder;