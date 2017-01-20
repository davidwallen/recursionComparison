// The toCamelCase function does three things *recursively* to a JSON object:
// 1. Remaps explicitly defined keys from a target response (bad) name, to an expected (good) proper name.
// 2. Remaps all UpperCase keys to camelCase
// 3. Remaps all hyphenated keys (e.g. user-id or Profile_Summary) and remaps them to camelCase


var objToCamelCase = function (o) {
    var newKeys = {
        "displayname": "displayName",
        "authoriseduser": "authorisedUser",
        "firstname": "firstName",
        "lastname": "lastName",
        "isover18": "isOver18",
        "allowpersonalisation": "allowPersonalisation",
        "isstoreuser": "isStoreUser",
        "user-id": "userId",
        "userid": "userId",
        "access_token": "accessToken",
        "token_type": "tokenType",
        "ID": "ID"
    };
    return _objToCamelCase(o, newKeys);
}

function _objToCamelCase(o, newKeys) {
    // Define variables we need for output
    var objectToReturn, originalKey, replacementKey, value;

    if (o instanceof Array) {
        objectToReturn = [];
        for (originalKey in o) {
            value = o[originalKey];
            if (typeof value === "object") {
                value = _objToCamelCase(value, newKeys);
            }
            objectToReturn.push(value);
        }
    } else {
        objectToReturn = {};
        for (originalKey in o) {
            if (originalKey in newKeys) {
                replacementKey = newKeys[originalKey];
            } else {
                replacementKey = (originalKey.charAt(0).toLowerCase() + originalKey.slice(1) || originalKey).toString();
                var arr = replacementKey.split(/[_-]/);
                if (arr.length > 1) {
                    replacementKey = arr[0];
                    // Loop through starting with index 1 (the second segment)
                    for (var i = 1; i < arr.length; i++) {
                        // strip the - or _, uppercase the next character, and append to newStr
                        replacementKey += arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                    }
                }
            }
            value = o[originalKey];
            if (typeof value === "object") {
                value = _objToCamelCase(value, newKeys);
            }
            objectToReturn[replacementKey] = value;
        }
    }
    return objectToReturn;
};

if (typeof module != 'undefined') {
    module.exports = {
        objToCamelCase: objToCamelCase
    }
}