import React, { useEffect, useState } from 'react';
import styles from './styles/User.module.css';
import { NFTCard, Folder, Profile } from '../../components/index';
import { getAllUserNFTs } from '@psychedelic/dab-js';
import { stringToJSON, matchProfileToDab, kitsuneCount, kitToDisplayInt } from '../../utils/index';
import { rust_fluff, idlFactory, canisterId } from "../../../../.dfx/local/canisters/rust_fluff/index";
import axios from 'axios';
import { KITSUNE_CAN_ID } from '../../constants';

const User = ({match, principalId, actor}) => {
    const [profile, setProfile] = useState();
    const [displayNFTs, setDisplayNFTs] = useState([]);
    const [kitsuneStat, setKitsuneStat] = useState();


    const loadUser = async (actor) => {
        const fetch_profile = await actor.get(match.params.username.toLowerCase());
        console.log(`Got ${match.params.username} username's profile: `, fetch_profile);


        let collections = await axios.get(`https://kyasshu-dev.fleek.co/dab/user/nfts/${fetch_profile.Ok.principal}`);
        console.log("from axios on user route: ", collections);

        return [fetch_profile.Ok, stringToJSON(collections.data)];
    }

    const countKits = (displayNFTs) => {
        let n = 0;
        for (let i = 0; i < displayNFTs.length; i++) {
            if (displayNFTs[i].canister === KITSUNE_CAN_ID) {
                n += 1;
            }
        }
        return n;
    }



    useEffect(async () => {
        // if (actor) {
        //     let [profile_data, nft_data] = await loadUser(actor);
            
        //     setDisplayNFTs(matchProfileToDab(profile_data.nfts, nft_data));
        //     setProfile(profile_data);
        //     setKitsuneStat(kitsuneCount(nft_data));
            
        // } else {
        //     let [profile_data, nft_data] = await loadUser(rust_fluff);
            
        //     setDisplayNFTs(matchProfileToDab(profile_data.nfts, nft_data));
        //     setProfile(profile_data);
        //     setKitsuneStat(kitsuneCount(nft_data));
        // }

        if (actor) {
            var [profile_data, nft_data] = await loadUser(actor);
        } else {
            var [profile_data, nft_data] = await loadUser(rust_fluff);
        }

        let matched_nfts = matchProfileToDab(profile_data.nfts, nft_data);
        let profKitCount = countKits(matched_nfts);
        let nftsFromStatus = kitToDisplayInt(kitsuneCount(nft_data));
        let surplus = nftsFromStatus - matched_nfts + profKitCount;

        console.log(matched_nfts);
        console.log(profKitCount);
        console.log(nftsFromStatus);
        console.log(surplus);
        
        if (surplus < 0) {
            for (let i=0; i < Math.abs(surplus); i++) {
                for (let i=0; i < matched_nfts.length; i--) {
                    if (matched_nfts[i].canister !== KITSUNE_CAN_ID) {
                        matched_nfts.splice(i, 1);
                    }
                }
            }
        }
        
        
        // setDisplayNFTs(matchProfileToDab(profile_data.nfts, nft_data));
        setDisplayNFTs(matched_nfts);
        setProfile(profile_data);
        setKitsuneStat(nftsFromStatus);
        
    }, [])

    const btnClick = () => {
        console.log("profile nfts: ", displayNFTs);
        console.log("profile: ", profile);
        console.log("kitsune count: ", kitsuneStat);
    }

    return (
        <div className='flex flex-col items-center'>
            { profile ? (
                <Profile 
                    profile={profile}
                    nftArray={displayNFTs}
                />
            ) : (
                <h2>LOADING...</h2>
            )}
            
            <div onClick={btnClick}>
                <h2>click meh</h2>
            </div>
        </div>
    )
}

export default User;