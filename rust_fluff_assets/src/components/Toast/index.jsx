import React, { useState, useEffect } from 'react';


const Toast = ({ message, color, dispatch, id }) => {

    const [exit, setExit] = useState(false);


    const handleCloseNotif = () => {
        dispatch({
            type: "RM_TOAST",
            id: id
        })
    }

    useEffect(() => {
        setTimeout(() => {
            handleCloseNotif()
        }, 4000)
    })

    return (
        <>
            <div className={`flex flex-row items-center px-4 h-16 my-2 ${color} rounded-xl`}> 
               <h3 className='text-zinc-50'>{message}</h3>
            </div>
        </>
    )
}

export default Toast;