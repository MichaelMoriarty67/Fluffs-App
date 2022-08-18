use crate::types::*;


pub use ic_cdk::storage;
use std::collections::HashMap;

#[derive(CandidType, Clone, Default, Deserialize)]
pub struct Ledger {
    user_store: HashMap<String, Principal>,
    profiles: HashMap<Principal, Profile>,
}

impl Ledger {
    pub fn add(&mut self, mut payload: Profile) -> ProfileReceipt {

        // let caller = ic_cdk::caller();
        // let ledger = storage::get_mut::<Ledger>();
        // payload.username = payload.username.to_lowercase();
        // let user_name = &payload.username;

        // // check for valid username
        // if let true = ledger.check_username(user_name.to_string()) {
        //     return ProfileReceipt::Err(ProfileError::UnauthorizedUsername);
        // }

        // match ledger.profiles.insert(caller.clone(), payload.clone()) {
        //     Some(old_profile) => {

        //         // username has changed 
        //         if old_profile.username.ne(user_name) {

        //             // delete old username from user_store
        //             ledger.user_store.remove_entry(user_name);
                    
        //             // add new username to user_store
        //             ledger.user_store.insert(user_name.to_string(), caller.clone());
        //         } 
        //     },
        //     None => {
        //         // add new username to user_store
        //         ledger.user_store.insert(user_name.to_string(), caller.clone());
        //     }
        // }

        // ProfileReceipt::Ok(payload)

        let caller = ic_cdk::caller();
        let ledger = storage::get_mut::<Ledger>();
        payload.username = payload.username.to_lowercase();
        let user_name = &payload.username;


        // check if username is already used
        if let true = ledger.user_store.contains_key(user_name) {
            // check if the username is the caller's username
            if caller.to_string() == ledger.user_store.get(user_name).unwrap().to_string() {
                // if it is, update the profile
                ledger.profiles.insert(caller.clone(), payload.clone());

                return ProfileReceipt::Ok(payload.clone());
            } else {
                // if not callers user, return error
                return ProfileReceipt::Err(ProfileError::UnauthorizedUsername);
            }
        } else {
            // username is not used already
            // update the profile to get the old profile back
            match ledger.profiles.insert(caller.clone(), payload.clone()) {
                Some(old_profile) => {
                    // old profile found, remove old username and add new username
                    ledger.user_store.remove_entry(&old_profile.username);
                    ledger.user_store.insert(user_name.clone(), caller.clone());
                },
                None => {
                    // no profile found, add new username
                    ledger.user_store.insert(user_name.clone(), caller.clone());
                },
            }

            return ProfileReceipt::Ok(payload);
        }

    }

    pub fn get_self(&self) -> Option<Profile> {
        let id = ic_cdk::caller();

        let ledger = storage::get::<Ledger>();


        let result = match ledger.profiles.contains_key(&id) {
            true => {
                Some(ledger.profiles
                    .get(&id)
                    .cloned()
                    .unwrap()
                )
            },
            false => {
                None
            },
        };

        result
    }

    
    pub fn check_username(&self, username: String) -> bool {
        let ledger = storage::get::<Ledger>();

        ledger.user_store.contains_key(&username)
    }


    pub fn get(&self, username: String) -> ProfileReceipt {
        let ledger = storage::get::<Ledger>();

        // find canister, if not, return blackhole canister principal obj
        let result = ledger.user_store.get(&username)
            .unwrap_or(&Principal::from_text("e3mmv-5qaaa-aaaah-aadma-cai").unwrap())
            .clone();
        
        match ledger.profiles.get(&result) {
            Some(profile) => {
                return ProfileReceipt::Ok(profile.clone());
            },
            None => {
                // found no profile
                return ProfileReceipt::Err(ProfileError::NotFound);
            }
        }
    }
}