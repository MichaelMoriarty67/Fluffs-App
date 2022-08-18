import React, { useEffect, useState } from 'react';
import { Button } from '../index';
import { miniPrincipal, principalToGradient } from '../../utils';

const Navigation = ({status, principalId, disconnect}) => {

    const [profileDiv, setProfileDiv] = useState(<></>);
    const [ddStatus, setDdStatus] = useState(false);

    // console.log(principalId.toString());
    // console.log(princiaplToGradient(principalId.toString()));

    const generateProfileDiv = () => {
        console.log("gen div called");
        const genDiv = (
            <>
                <div className={`rounded-full h-6 w-6 ${ principalId ? principalToGradient(principalId.toString()) : 'bg-gradient-to-t from-orange-400 to-sky-400'}`}/>
                <p>
                    { principalId ? miniPrincipal(principalId.toString()) : 'Not Connected'}
                </p>
            </>
        )
        return genDiv;
    }

    const toggleDropdown = () => {
        setDdStatus(!ddStatus)
    }

    const copyPrincipalID = () => {
        if (principalId && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(principalId.toString())
        } else {
            return Promise.reject('The Clipboard API is not available.');
        }
    }

    useEffect( async () => {
        console.log("use effect triggered..")
        setProfileDiv(generateProfileDiv())
    }, []);

    return (
        <div className="h-14 bg-slate-500 flex flex-row items-center justify-between">
            <div className='flex flex-col'>
                <Button
                    value={profileDiv} 
                    onClick={toggleDropdown}
                    className="flex justify-center items-center border border-lime-400 px-4 py-2 rounded-md space-x-2"
                />
                <div className={`flex flex-col justify-between items-start absolute left-18 top-16 py-2 px-4 bg-purple-800 ${ ddStatus ? 'flex' : 'hidden'}`}>
                    <Button
                        value='Copy Principal'
                        onClick={copyPrincipalID}
                    />
                    <Button
                        value='Disconnect'
                        onClick={disconnect}
                    />
                </div>
            </div>
            <Button 
                value={<p className='text-blue-400 text-md'>{'REALM'}</p>}
                onClick={() => {}}
                className="flex justify-center items-center border border-lime-400 px-4 py-2 rounded-md"
            />
        </div>
    )
}

export default Navigation;