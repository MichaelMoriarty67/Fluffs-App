import React from 'react';
import { Folder, NFTContainer, SocialContainer } from '../index';
import { miniPrincipal } from '../../utils/index';

const Profile = ({profile, nftArray}) => {


    return (
        <div className='flex flex-col max-w-5xl w-full px-8'>
            <div className='flex flex-row mt-12'>
                <div className='w-3/12'>
                    <span>IMG HERE</span>
                </div>
                <div className='flex flex-col w-9/12'>
                    <h3>{profile.username.toLowerCase()}</h3>
                    <p>Principal ID: {miniPrincipal(profile.principal)}</p>
                </div>
            </div>
            <Folder 
                title='SOCIALS'
                openComponent={<SocialContainer socials={profile.socials}/>}
            />
            <Folder 
                title='NFTs'                
                openComponent={<NFTContainer dataArray={nftArray}/>}
            />
        </div>
    )
}


export default Profile;