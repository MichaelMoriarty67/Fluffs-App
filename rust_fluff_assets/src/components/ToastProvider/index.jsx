import React, { useReducer, createContext } from 'react';
import Toast from '../Toast';

export const ToastContext = createContext();

const ToastProvider = (props) => {

    const [state, dispatch] = useReducer((state, action) => {
        switch(action.type) {
            case "ADD_TOAST":
                return [...state, {...action.payload}];
            case "RM_TOAST":
                return state.filter((item) => {
                    item.id !== action.id;
                })
            default: 
                return state;
        }
    }, [])




    return (
        <ToastContext.Provider value={dispatch}>
            <div className='absolute bottom-8 left-1/2'>
                {
                    state.map((item) => {
                        return <Toast 
                            key={item.id}
                            color={item.color}
                            message={item.message}
                            dispatch={dispatch}
                            id={item.id}
                        />
                    })
                }
            </div>
            {props.children}
        </ToastContext.Provider>
    )
}

export default ToastProvider;