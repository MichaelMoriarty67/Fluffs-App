use crate::types::*;
use crate::ledger::*;

use ic_cdk_macros::*;

// LEDGER FUNCTIONS

#[update]
fn add(profile: Profile) -> ProfileReceipt {
    let mut ledger = storage::get_mut::<Ledger>();

    ledger.add(profile)
}

#[query(name = "getSelf")]
fn get_self() -> Option<Profile> {
    let ledger = storage::get::<Ledger>();

    ledger.get_self()
}

#[query(name = "checkUsername")]
fn check_username(username: String) -> bool {
    let ledger = storage::get::<Ledger>();

    ledger.check_username(username)
}

#[query]
fn get(username: String) -> ProfileReceipt {
    let ledger = storage::get::<Ledger>();

    ledger.get(username)
}

