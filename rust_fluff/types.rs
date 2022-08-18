pub use ic_cdk::export::{candid::{CandidType, Deserialize}, Principal};
use std::default::Default;

#[derive(Clone, Debug, CandidType, Deserialize, Default)]
pub struct Socials {
    pub dscvr: String,
    pub distrikt: String,
    pub discord: String,
    pub twitter: String,
    pub website: String,
}
#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum Status {
    Zero,
    One,
    Two,
    Three,
    Four,
    Five,
    Realm,    
}

impl Default for Status {
    fn default() -> Self { Status::Zero }
}

#[derive(Clone, Debug, CandidType, Deserialize, Default)]
pub struct Profile {
    pub principal: String,
    pub username: String,
    pub socials: Socials,
    pub nfts: Vec<NFTRecord>,
    pub status: Status,
}

impl Profile {
    fn  new(principal: Principal) -> Profile {
        Profile {
            principal: principal.to_string(),
            username: "mike".to_string(),
            socials: Socials { 
                dscvr: "sherlocked".to_string(),
                distrikt: "sherlocked".to_string(),
                discord: "sherlocked".to_string(),
                twitter: "sherlocked".to_string(),
                website: "sherlocked.com".to_string(),
            },
            nfts: vec![NFTRecord {
                colName: "testCol".to_string(),
                colId: "test-id-here".to_string(),
                tokens: vec!["nft-id-here".to_string()],
            }],
            status: Status::Realm,
        }
    }
}

// will it be a prob that this doesnt have the #[derive] like structs and enums?
pub type ProfileReceipt = Result<Profile, ProfileError>;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum ProfileError {
    UnauthorizedUsername,
    BadParams,
    NotFound,
    Other(String),
}

#[derive(Clone, Debug, CandidType, Deserialize, Default)]
pub struct NFTRecord {
    pub colName: String,
    pub colId: String,
    pub tokens: Vec<String>,
}