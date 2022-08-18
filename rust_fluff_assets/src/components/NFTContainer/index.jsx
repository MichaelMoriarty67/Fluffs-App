import React, { useEffect } from 'react';
import NFTCard from '../NFTCard';


const NFTContainer = ({dataArray}) => {

    return (
        <>
            { dataArray ? (
                <div className='grid gap-4 grid-cols-4 grid-rows-2'>
                    {
                        dataArray.map((item, index) => {
                            return <NFTCard 
                                key={index}
                                data={item}
                            />
                        })
                    }
                </div>
                
            ) : (
                <span>
                    <p>No NFTs found 😑</p>
                </span>
            )}
        </>
    )
}


export default NFTContainer;