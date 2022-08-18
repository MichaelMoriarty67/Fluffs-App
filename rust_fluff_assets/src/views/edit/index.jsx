import React, { useState, useEffect, useContext } from 'react';
import styles from './styles/Edit.module.css';
import connectStyles from '../connect/styles/Connect.module.css';
import { Button, Form, CardDisplay, NFTCard, NavButton, Username, NFTIcon } from '../../components/index';
import { miniPrincipal, parseLoadArray, matchProfileToDab, stringToJSON, deepEqual, integerToStatus, kitToDisplayInt, kitsuneCount } from '../../utils/index';
import { DEFAULT_FORMARRAY, KITSUNE_STATUS } from '../../constants/index';
import { Principal } from '@dfinity/principal';
import { getAllUserNFTs, getCachedUserNFTs } from '@psychedelic/dab-js';
import axios from 'axios';
import { ToastContext } from '../../components/ToastProvider';


const Edit = ({principalId, actor, disconnect}) => {
    const [formArray, setFormArray] = useState(DEFAULT_FORMARRAY);
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState({});
    const [dabNfts, setDabNfts] = useState([]);
    const [showcase, setShowcase] = useState([]);
    const [showcaseView, setShowcaseView] = useState(true);
    const [profileExist, setProfileExist] = useState(true);
    const [status, setStatus] = useState();
    const [socialsView, setSocialsView] = useState(true);
    const [visibleSocial, setVisibleSocial] = useState([]);
    const [displayCol, setDisplayCol] = useState('');
    const dispatch = useContext(ToastContext);

    const formSubmit = async (e) => {
        e.preventDefault();
        const socials = createSocials(
            e.target.dscvr.value,
            e.target.distrikt.value,
            e.target.discord.value,
            e.target.twitter.value,
            e.target.website.value,
        );

        const nfts = parseLoadArray(showcase);

        const profile = createProfile(
            // e.target.username.value,
            username,
            principalId.toString(),
            socials,
            nfts,
            { Realm: null },
        )
        
        console.log("profile: ", profile);
        try {
            if (actor) {
                const new_profile = await actor.add(profile)
                console.log("profile submitted: ", new_profile);
                setProfile(new_profile);
                dispatch({
                    type: "ADD_TOAST",
                    payload: {
                        id: Math.floor(Math.random() * 100000),
                        color: 'bg-green-600',
                        message: 'Success! Profile Updated.'
                    }
                })
            } else {
                console.log("Actor needed to call add fn boss...");
                dispatch({
                    type: "ADD_TOAST",
                    payload: {
                        id: Math.floor(Math.random() * 100000),
                        color: 'bg-red-600',
                        message: 'Error! Please Sign In.'
                    }
                })
            }
        } catch (err) {
            console.error("Error from formSubmit: ", err);
            dispatch({
                type: "ADD_TOAST",
                payload: {
                    id: Math.floor(Math.random() * 100000),
                    color: 'bg-red-600',
                    message: 'Error! Profile Not Updated.'
                }
            })
        }

    }

    const createSocials = (dscvr, distrikt, discord, twitter, website) => {
        const socials = {
            "dscvr": dscvr,
            "distrikt": distrikt,
            "discord": discord,
            "twitter": twitter,
            "website": website,
        }

        return socials
    }

    const createProfile = (username, principal, socials, nfts, status) => {
        const profile = {
            "principal": principal,
            "username": username,
            "socials": socials,
            "nfts": nfts,
            "status": status,
        }
        
        return profile;
    }

    const checkUsername = async (name) => {
        if (actor) {
          try {
            const isUser = await actor.checkUsername(name);
            console.log(`Does ${name} exist in BE: `, isUser);
            return isUser;
          } catch (err) {
            console.error("Error from checkUsername: ", err);
          }
        } else {
            console.log("No actor, checkUsername method wont work.");
            dispatch({
                type: "ADD_TOAST",
                payload: {
                    id: Math.floor(Math.random() * 100000),
                    color: 'bg-red-600',
                    message: 'Error! Please Sign In.'
                }
            })
        }
    }


    const getNftCollections = async (principal) => {
        console.log("principal for getNftCollections: ", principal);

        const collections = await getAllUserNFTs(
            { user: principal }
        );
        return collections;
    }
    
    const addToShowcase = (tokenData) => {
        setShowcase([...showcase, tokenData]);
    }

    const removeFromShowcase = (tokenData) => {
        setShowcase(showcase.filter((token) => {
            return token != tokenData;
        }));
    }

    const toggleShowcase = (tokenData) => {
        console.log(tokenData);
        console.log(showcase.some((item) => item == tokenData));
        if (showcase.some((item) => item == tokenData)) {
            // item found, remove item
            setShowcase(showcase.filter((token) => {
                return token != tokenData;
            }));
        } else {
            // item not found, add item
            setShowcase([...showcase, tokenData]);
        }
    }

    const toggleShowcaseTwo = (tokenData) => {
        console.log(tokenData);        
        let n = showcase.length;
        let i = 0;

        while (i < showcase.length) {
            console.log("deep equal: ", deepEqual(showcase[i], tokenData));
            if (showcase[i].canister == tokenData.canister && showcase[i].index == tokenData.index) {
                // item found, remove it
                console.log("item found... removing");
                setShowcase(showcase.filter((token) => {
                    return token != tokenData;
                }));
                console.log("showcase after remove: ", showcase);
                break;
            }
            i++;
        }

        if (i == n) {
            // item not found, add item
            console.log("item not found... adding");
            // setShowcase([...showcase, tokenData]);
            let max = kitToDisplayInt(status)
            console.log("max: ", max);
            console.log("showcase n: ", showcase.length);
            if (showcase.length < max) {
                showcase.push(tokenData);
            } else {
                dispatch({
                    type: "ADD_TOAST",
                    payload: {
                        id: Math.floor(Math.random() * 100000),
                        color: 'bg-red-600',
                        message: 'NFT Limit Reached.'
                    }
                })
            }
            
        }
    }

    const toggleVisible = (value, array, setArray) => {
        if (array.includes(value)) {
            const new_arr = array.filter((el) => {
                return el.toLowerCase() !== value
            })
            setArray(new_arr);
        } else {
            setArray([...array, value]);
        }
    }

    const openProfile = () => {
        if (profile) {
            let path = window.location.href;
            console.log(path);
            path  = path.substr(0,path.length - 4) + profile[0].username;
            console.log(path);
            window.open(path);
        }
    }


    const btnClick = async () => {
        console.log("showcase: ", showcase);
        console.log("dab nfts: ", dabNfts);
        console.log("kitsune count: ", status);
        console.log("int to status: ", integerToStatus(status));
        dispatch({
            type: "ADD_TOAST",
            payload: {
                id: Math.floor(Math.random() * 100000),
                color: 'bg-green-600',
                message: 'Button Click!'
            }
        })
    }

    useEffect( async () => {
        if (actor) {

            // gets back an array with profile inside it, while get() returns an obj with Ok or Err
            // with either a profile or error enum inside
            let self_profile = await actor.getSelf();
            console.log("self_profile: ", self_profile);
            
            if (self_profile.length != 0) {
                console.log("Got profile from useEffect: ", self_profile);
                setProfile(self_profile);
                setUsername(self_profile[0].username);
            } else {
                console.log("No profile found from getSelf()");
                setProfileExist(false);
            }

            if (principalId) {
                console.log("principal found.. finding nfts");
                let collections = await axios.get(`https://kyasshu-dev.fleek.co/dab/user/nfts/${principalId.toString()}`);
                let dabNFTData = stringToJSON(collections.data);
                console.log(dabNFTData);
                setDabNfts(dabNFTData);
                
                // set the kitsune status here
                setShowcase(matchProfileToDab(self_profile[0].nfts, dabNFTData));
            }
        }
    }, [])

    useEffect(() => {
        setStatus(kitsuneCount(dabNfts));
    }, [dabNfts])

    return (
        <>
            <div className="flex flex-row h-screen">
                <div className="flex flex-col bg-zinc-200 w-72 h-screen py-4 px-4 justify-between">
                    <div>
                        {/* <Button 
                            value={ principalId ? miniPrincipal(principalId.toString()) : "Not Found"}
                            onClick={() => {}}
                            className="bg-gray-300 rounded-lg my-2 h-10 flex flex-row items-center px-2 w-56"
                        /> */}
                        <NavButton
                            principalId={principalId}
                            disconnect={disconnect}
                        />
                        <div className='flex flex-col mt-16'>
                            <div className="flex flex-col">
                                <Username 
                                checkUsername={checkUsername}
                                user={username}
                                setUser={setUsername}
                                />
                            </div>
                            <div className='flex flex-col my-2'>
                                <Button 
                                    value={<><p className='mr-2'>🦄</p><p>Socials</p></>}
                                    onClick={() => setSocialsView(true)}
                                    className="bg-gray-300 hover:bg-gray-400 rounded-lg my-2 h-10 flex flex-row items-center px-2 w-56"
                                />
                                <Button 
                                    value={<><p className='mr-2'>🎨</p><p>NFTs</p></>}
                                    onClick={() => setSocialsView(false)}
                                    className="bg-gray-300 hover:bg-gray-400 rounded-lg my-2 h-10 flex flex-row items-center px-2 w-56"
                                />
                            </div>
                            <Button 
                                value='Submit'
                                onClick={() => {document.getElementById("submit_button").click()}}
                                className="bg-gray-300 hover:bg-blue-300 hover:text-slate-50 rounded-lg my-2 h-10 flex flex-row items-center px-2 w-56"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col mt-4'>
                        <Button 
                            value='My Profile'
                            onClick={openProfile}
                            className="bg-gray-300 hover:bg-gray-400 rounded-lg my-2 h-10 flex flex-row items-center px-2 w-56"
                        />
                        <Button 
                            value='ICKitsune NFT'
                            onClick={() => {}}
                            className="bg-gray-300 hover:bg-gray-400 rounded-lg my-2 h-10 flex flex-row items-center px-2 w-56"
                        />
                    </div>
                </div>
                <div className="flex flex-col bg-slate-50 w-full h-screen items-center justify-center">
                    <Button
                        value={ status ? integerToStatus(status) : "Loading" }
                        className="bg-gray-300 rounded-lg my-2 h-10 flex flex-row items-center justify-center px-2 w-32 fixed top-4 right-4"
                    />
                    <div className={`${ socialsView ? '' : 'hidden'} bg-gray-100 rounded-2xl flex flex-col max-w-2xl`}>
                        <div className='px-4 py-4 flex flex-row overflow-scroll no-scrollbar'>
                            <Button
                                value='Twitter'
                                onClick={() => {toggleVisible("twitter", visibleSocial, setVisibleSocial)}}
                                className="bg-gray-300 rounded-3xl ml-px mr-4 h-10 flex flex-row items-center px-2 w-32"
                            />
                            <Button
                                value='Distrik'
                                onClick={() => {toggleVisible("distrikt", visibleSocial, setVisibleSocial)}}
                                className="bg-gray-300 rounded-3xl mx-4 h-10 flex flex-row items-center px-2 w-32"
                            />
                            <Button
                                value='DSCVR'
                                onClick={() => {toggleVisible("dscvr", visibleSocial, setVisibleSocial)}}
                                className="bg-gray-300 rounded-3xl mx-4 h-10 flex flex-row items-center px-2 w-32"
                            />
                            <Button
                                value='Discord'
                                onClick={() => {toggleVisible("discord", visibleSocial, setVisibleSocial)}}
                                className="bg-gray-300 rounded-3xl mx-4 h-10 flex flex-row items-center px-2 w-32"
                            />
                            <Button
                                value='Website'
                                onClick={() => {toggleVisible("website", visibleSocial, setVisibleSocial)}}
                                className="bg-gray-300 rounded-3xl mx-4 h-10 flex flex-row items-center px-2 w-32"
                            />
                        </div>
                        <div className='my-10 mx-10 h-52 relative'>
                            <div className={`absolute top-24 left-32 ${ visibleSocial.length == 0 ? '' : 'hidden'}`}>
                                <h3>Select the socials you'd like to add to your profile ✨</h3>
                            </div>
                            <Form
                                    formArray={formArray}
                                    onSubmit={formSubmit}
                                    visible={visibleSocial}
                                    hide={ visibleSocial.length == 0 ? 'hidden' : ''}
                            />
                        </div>
                    </div>
                    <div className={`${ socialsView ? 'hidden' : ''} bg-gray-100 rounded-2xl flex flex-col w-[42rem] max-w-2xl`}>
                        <div className='px-4 py-4 flex flex-row'>
                            <Button
                                value='🏆 Showcase'
                                className="bg-gray-300 rounded-3xl ml-px mr-4 h-10 flex flex-row items-center px-2 w-32"
                                onClick={() => {setShowcaseView(true)}}
                            />
                            <div className='flex flex-row overflow-scroll no-scrollbar justify-between'>
                                { dabNfts && dabNfts.map((item, index) => {
                                    return <Button 
                                        key={index}
                                        // value={<div className='flex flex-row items-center w-fit'><div className='h-6 rounded-sm mr-4 hidden'><img className='' src={item.icon}/></div><p className='whitespace-nowrap'>{item.name}</p></div>}
                                        value={<div className='flex flex-row items-center w-fit'><NFTIcon data={item} height={4} margin={2} /><p className='whitespace-nowrap'>{item.name}</p></div>}
                                        className='bg-gray-300 rounded-xl h-10 mx-2 px-2 w-fit'
                                        onClick={() => {setDisplayCol(item.name); setShowcaseView(false)}}
                                    />
                                }) }
                            </div>
                        </div>
                        <div className={`${showcaseView ? '' : 'hidden' } my-10 mx-10 h-52 relative overflow-y-scroll no-scrollbar`}>                
                            { showcase.length != 0 ? (
                                <div className={`grid gap-4 grid-cols-4 grid-rows-{${Math.ceil(showcase.length / 4)}}`}>
                                    { showcase.map((item, index) => {
                                        return <NFTCard 
                                            key={index}
                                            data={item}
                                            callback={toggleShowcaseTwo}
                                            height={'12'}
                                        />
                                    }) }
                                </div>
                            ) : (
                                <div className='absolute top-24 left-32'>
                                    <p>Select the NFTs you'd like to add to your profile ✨</p>
                                </div>
                            ) }
                        </div>
                        <div className={`${showcaseView ? 'hidden' : '' } my-10 mx-10 h-52 relative overflow-y-scroll no-scrollbar`}>
                            <CardDisplay 
                                nftData={dabNfts}
                                displayCol={displayCol}
                                cardCallback={toggleShowcaseTwo}
                            />
                        </div>                
                    </div>
                    {/* <button onClick={btnClick}>
                        click meh
                    </button>
                    <iframe loading='lazy' width={100} height={100} src="https://4fcza-biaaa-aaaah-abi4q-cai.raw.ic0.app/?type=thumbnail&tokenid=rohxy-gqkor-uwiaa-aaaaa-byakh-eaqca-aaaif-q">
                    </iframe> */}
                </div>
            </div>
        </>
    );
};

export default Edit;