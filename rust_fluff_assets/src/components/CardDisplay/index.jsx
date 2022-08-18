import React, { useState, useEffect } from 'react';
import NFTCard from '../NFTCard';


const CardDisplay = ({nftData, displayCol, cardCallback}) => {
    const [displayCards, setDisplayCards] = useState([]);

    const createCards = () => {
        var found = false;
        var i = 0;
        while (found == false && i < nftData.length) {
            if (nftData[i].name == displayCol) {
                const display_arr = nftData[i].tokens.map((item, index) => {
                    return <NFTCard
                        key={index} 
                        data={item}
                        callback={cardCallback}
                        height={'12'}
                    />
                })
                console.log("display arr: ", display_arr);
                setDisplayCards(display_arr);
                found = true;
            }

            i++;
        }
    }

    useEffect(() => {
        createCards();
        console.log("Create Cards was called");
    }, [displayCol, nftData])

    return (
        <>
            <div className={`grid gap-4 grid-cols-4 grid-rows-{${Math.ceil(displayCards.length / 4)}}`}>
                {displayCards}
            </div>
            {/* flex flex-row flex-wrap h-full overflow-y-scroll no-scrollbar justify-between */}
        </>
    )
}

export default CardDisplay;