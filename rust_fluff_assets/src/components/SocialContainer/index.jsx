import React from 'react';

const SocialContainer = ({socials}) => {

    return (
        <>
            { socials ? (
                <div>
                    <p>{socials.discord}</p>
                    <p>{socials.twitter}</p>
                    <p>{socials.dscvr}</p>
                    <p>{socials.distrikt}</p>
                    <p>{socials.website}</p>
                </div>
            ) : (
                <>LOADING...</>
            )}
        </>
    )
}

export default SocialContainer;