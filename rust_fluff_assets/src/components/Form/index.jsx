import React, { useState } from 'react';
import { Button } from '../index';

const Form = ({ formArray, onSubmit, title, onChange, visible, form_id, hide }) => {


    return (
        <form id={form_id} onSubmit={onSubmit} className={`flex flex-row flex-wrap justify-between ${hide}`}>
            { title ? <h1>{title}</h1> : <></>}
            {
                formArray && formArray.map((item, i) => {
                    if (onChange && item.name === onChange.name) {
                        return <label key={i}> 
                        <input
                            type={item.type}
                            placeholder={item.placeholder}
                            name={item.name}
                            onChange={onChange.func}
                        />
                    </label>

                    } else {
                        return <label className={`${ visible && visible.includes(item.name) ? '' : 'hidden'}`} key={i}>
                        <input
                            className={`${ visible && visible.includes(item.name) ? '' : 'hidden'} bg-gray-300 rounded-lg my-4 h-10 flex flex-row items-center px-2 w-56`}
                            type={item.type}
                            placeholder={item.placeholder}
                            name={item.name}
                        />
                        </label>

                    }
                    
                })
            }
            <button id='submit_button' type='submit' />
        </form>
    )
}

export default Form;