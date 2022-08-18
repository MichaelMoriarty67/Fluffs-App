mod tests;
mod ledger;
mod types;
mod service;

// #[derive(CandidType, Clone, Default, Deserialize)]
// pub struct Ledger {
//     user_store: HashMap<String, Principal>,
//     profiles: HashMap<Principal, Profile>,
// }




// // add can work as edit too, add logic to edit if profile already exists in storage
// #[update]
// fn add(payload: Profile) -> ProfileReceipt {

//     let caller = ic_cdk::caller();
//     let ledger = storage::get_mut::<Ledger>();
//     let user_name = &payload.username;

//     // check for valid username
//     if let true = check_username(user_name.to_string()) {
//         return ProfileReceipt::Err(ProfileError::UnauthorizedUsername);
//     }

//     match ledger.profiles.insert(caller.clone(), payload.clone()) {
//         Some(old_profile) => {

//             // username has changed 
//             if old_profile.username.ne(user_name) {

//                 // delete old username from user_store
//                 ledger.user_store.remove_entry(user_name);
                
//                 // add new username to user_store
//                 ledger.user_store.insert(user_name.to_string(), caller.clone());
//             } 
//         },
//         None => {
//             // add new username to user_store
//             ledger.user_store.insert(user_name.to_string(), caller.clone());
//         }
//     }

//     ProfileReceipt::Ok(payload)


//     // steps:
//     // (1) check if caller (principal) has a profile, edit if does and add if doesnt
//     // (2) figure out what the payload object looks like and can if I can just do
//     //      payload.attribute to access info, or maybe I can just put the payload right into
//     //      storage.
//     // (3) if add, check if username is valid and then add to Ledger
//     // (4) if edit, get obj from mutable storage and then edit and send back to storage. Will
//     //      also need to check if username is changed, and if so, check if valid and then make
//     //      edit to Ledger.user_store (including removing old username)
//     // (5) if all goes well, return the profile object
//     // (6) check what happens if the object (Profile) sent is formatted wrong from client end

// }

// #[query(name = "getSelf")]
// fn get_self() -> Option<Profile> {
//     let id = ic_cdk::caller();

//     let ledger = storage::get::<Ledger>();


//     let result = match ledger.profiles.contains_key(&id) {
//         true => {
//             Some(ledger.profiles
//                 .get(&id)
//                 .cloned()
//                 .unwrap()
//             )
//         },
//         false => {
//             None
//         },
//     };

//     result
// }

// #[query(name = "returnString")]
// fn return_string(s: String) -> String {
//     s
// }

// #[query(name = "checkUsername")]
// fn check_username(username: String) -> bool {
//     let ledger = storage::get::<Ledger>();

//     ledger.user_store.contains_key(&username)
// }
