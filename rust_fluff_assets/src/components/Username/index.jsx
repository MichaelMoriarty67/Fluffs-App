import React, { useState } from 'react';

const Username = ({value, checkUsername, user, setUser}) => {
    // const [user, setUser] = useState(value);
    const [edit, setEdit] = useState(false);
    const [userCheck, setUserCheck] = useState(false);


    const handleChange = (e) => {
        e.preventDefault();
        setUser(e.target.value);
    }

    const setAndSubmit = async () => {
        setEdit(false);
        if (user !== '') {
            const userExists = await checkUsername(user);
            if (userExists) {
                console.log(`${user} already exists in BE - setAndSubmit`);
                setUserCheck(true);
            }
        }
    }

    // checkUser which is a timed function to check if username is valid

    return (
        <div className={`bg-gray-300 rounded-lg my-2 h-10 flex flex-row items-center px-2 ${userCheck ? 'border border-rose-400'  : ''}`}>
            { edit ? (
                <form className="h-full flex items-center">
                    <label>
                        <input 
                        className="w-11/12 bg-slate-300"
                        type='text' 
                        name='user' 
                        onChange={handleChange}
                        autoFocus/>
                    </label>
                </form>
            ) : (
                <h2 className='w-11/12'>{user}</h2>
            )}
            { edit == true ? (
                <p className='w-1/12' onClick={setAndSubmit}>✅</p>
            ) : (
                <p className='w-1/12' onClick={() => setEdit(true)}>✏</p>
            )}

            
        </div>
    )
}

export default Username;