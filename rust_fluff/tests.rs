#[cfg(test)]
mod tests {

    use crate::ledger::*;
    use crate::types::*;

    use ic_kit::{mock_principals::*, MockContext};

    fn setup_ledger() -> Ledger {
        MockContext::new().inject();
        let mut ledger = Ledger::default();
        ledger
    }

    #[test]
    fn test_add() {
        let mut ledger = setup_ledger();
        let alice = alice();

        let profile = Profile {
            principal: alice.to_string(),
            username: "Mike".to_string(),
            socials: Socials {
                dscvr: "sherlock".to_string(),
                distrikt: "sherlock".to_string(),
                discord: "sherlock".to_string(),
                twitter: "sherlock".to_string(),
                website: "sherlock".to_string(),
            },
            nfts: vec!("nft1".to_string(), "nft2".to_string(), "nft2".to_string()),
            status: Status::Realm,
        };

        assert_eq!(ledger.add(profile.clone()).unwrap(), profile);
    }


}