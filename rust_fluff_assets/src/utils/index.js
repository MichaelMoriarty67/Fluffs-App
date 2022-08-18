import { TAILWIND_CODES, TAILWIND_COLORS, TAILWIND_DIRECTIONS } from "../constants";

export const miniPrincipal = (principal) => {
    return "".concat(principal.substr(0,5), "...", principal.substr(-3,3));
}


// takes an array of tokens from DAB and parses them into
// format that backend canister uses (colName, colId, tokens[])
export const parseLoadArray = (loadArray) => {

    let nftRecord = [];

    if (loadArray.length > 0) {
        
        for (let i = 0; i < loadArray.length; i++) { 

            let add = false;
            let j = 0;

            if (nftRecord.length == 0) {

                loadArray[i].id ? (nftRecord.push({
                    colName: loadArray[i].collection,
                    colId: loadArray[i].canister,
                    tokens: [loadArray[i].id],
                })) : (nftRecord.push({
                    colName: loadArray[i].collection,
                    colId: loadArray[i].canister,
                    tokens: [loadArray[i].index.toString()],
                }));
                // nftRecord.push({
                //     colName: loadArray[i].collection,
                //     colId: loadArray[i].canister,
                //     tokens: [loadArray[i].id],
                // });

            } else {
            
                while (j < nftRecord.length) {
                    if (loadArray[i].collection === nftRecord[j].colName) {
                        nftRecord[j].tokens.push(loadArray[i].id ? loadArray[i].id : loadArray[i].index.toString());
                        break;
                    }
    
                    if (j == nftRecord.length - 1) {
                        add = true;
                    }
    
                    j++;
                }
    
                if (add) {

                    loadArray[i].id ? (nftRecord.push({
                        colName: loadArray[i].collection,
                        colId: loadArray[i].canister,
                        tokens: [loadArray[i].id],
                    })) : (nftRecord.push({
                        colName: loadArray[i].collection,
                        colId: loadArray[i].canister,
                        tokens: [loadArray[i].index.toString()],
                    }));

                    // nftRecord.push({
                    //     colName: loadArray[i].collection,
                    //     colId: loadArray[i].canister,
                    //     tokens: [loadArray[i].id],
                    // })
                }
            }
        }
    } 

    return nftRecord;
}


export const matchProfileToDab = (profileList, dabList) => {
    let matchList = [];

    for (let i = 0; i < profileList.length; i++) {

        for (let j = 0; j < dabList.length; j++) {

            // true = collection in profile matches a collection in DAB
            if (profileList[i].colId == dabList[j].canisterId) {

                for (let k = 0; k < profileList[i].tokens.length; k++) {

                    for (let l = 0; l < dabList[j].tokens.length; l++) {

                        // true = tokenId in profile collection matches tokenId in dab collection
                        if (profileList[i].tokens[k] == (dabList[j].tokens[l].id || dabList[j].tokens[l].index)) {
                            matchList.push(dabList[j].tokens[l]);
                        }
                    }
                }
            }
        }
    }

    return matchList;
}

export const isTokenMP4 = (token) => {
    if (token.url.substr(-4,4) == '.mp4') {
        return true;
    }
    
    return false;
}


export const stringToJSON = (s) => {
    if (typeof s === "string") {
        return JSON.parse(s);
    } 
    console.error("tried to parse non-string data.");
    return s;
}


export const principalToGradient = (principal) => {
    console.log("principal: ", principal);
    let command = 'bg-gradient-to-';
    if (typeof principal == 'string' && principal != '') {
        command += TAILWIND_DIRECTIONS[principal.charCodeAt(0) % 6];
        command += ' from-'
        command += TAILWIND_COLORS[principal.charCodeAt(6) % 22];
        command += '-'+TAILWIND_CODES[principal.charCodeAt(12) % 3];
        // command += ' via-'+TAILWIND_COLORS[principal.charCodeAt(18) % 22]+'-'+TAILWIND_CODES[principal.charCodeAt(24) % 3];
        command += ' to-'+TAILWIND_COLORS[principal.charCodeAt(30) % 22]+'-'+TAILWIND_CODES[principal.charCodeAt(36) % 3];
        console.log(command);
        return command;

    } else {
        console.log("else statement happened.")
        return 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400';
    }
}

export function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
    return true;
  }


function isObject(object) {
    return object != null && typeof object === 'object';
  }


export const integerToStatus = (int) => {
   let nums_text = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE +"]

   if (int > 5) {
       return nums_text[5];
   }

   return nums_text[int];
}

export const kitToDisplayInt = (int) => {
    if (int > 5) {
        return 100
    }

    let kitMap = {
        0: 1,
        1: 5,
        2: 10,
        3: 20,
        4: 50,
        5: 100
    }

    return kitMap[int]
}

export const kitsuneCount = (nftList) => {
    for (let i = 0; i < nftList.length; i++) {
        if (nftList[i].canisterId == 'zqpvh-hqaaa-aaaah-qczfq-cai') {
            return nftList[i].tokens.length;
        }
    }
    return 0;
}