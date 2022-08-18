import React, { useState } from 'react';
import Button from '../Button';
import { miniPrincipal, principalToGradient } from '../../utils';


const NavButton = ({ principalId, connected, disconnect }) => {
    
    const [dropdown, setDropdown] = useState(false);


    const loggedOut = <>
        <div className={`rounded-full h-6 w-6 bg-gradient-to-t from-orange-400 to-sky-400 mr-12`} />
        <p>Sign In</p>
    </>

    const loggedIn = <>
        <span className={`rounded-full h-6 w-6 ${principalToGradient(principalId.toString())}`}/>
        <p>{miniPrincipal(principalId.toString())}</p>
    </>


    const copyPrincipalID = () => {
        if (principalId && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(principalId.toString())
        } else {
            return Promise.reject('The Clipboard API is not available.');
        }
    }


    return (
        <>
            <Button
                value={ principalId ? loggedIn : loggedOut}
                onClick={() => setDropdown(!dropdown)}
                className="bg-gray-300 rounded-lg my-2 h-10 flex flex-row items-center px-2 w-56"
            />
            <div className={`flex flex-col justify-between items-start absolute left-18 top-16 py-2 px-4 ${ dropdown ? '' : 'hidden'}`}>
                    <Button
                        value='Copy Principal'
                        onClick={copyPrincipalID}
                        className="my-1"
                    />
                    <Button
                        value='Disconnect'
                        onClick={disconnect}
                        className="my-1"
                    />
            </div>
        </>
    )
}


export default NavButton;