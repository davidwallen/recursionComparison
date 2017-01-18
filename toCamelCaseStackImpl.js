// The toCamelCase function does three things *recursively* to a JSON object:
// 1. Remaps explicitly defined keys from a target response (bad) name, to an expected (good) proper name.
// 2. Remaps all UpperCase keys to camelCase
// 3. Remaps all hyphenated keys (e.g. user-id or Profile_Summary) and remaps them to camelCase


var objToCamelCase = function (obj) {
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
    }, oKey, nKey, stack = [obj], arrayKey;

    while (stack.length > 0) {
        var o = stack.pop();
        for (oKey in o) {
            if (oKey in newKeys) {
                nKey = newKeys[oKey];
            } else {
                nKey = (oKey.charAt(0).toLowerCase() + oKey.slice(1) || oKey).toString();
                var arr = nKey.split(/[_-]/);
                if (arr.length > 1) {
                    nKey = arr[0];
                    // Loop through starting with index 1 (the second segment)
                    for (var i = 1; i < arr.length; i++) {
                        // strip the - or _, uppercase the next character, and append to newStr
                        nKey += arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                    }
                }
            }
            var value = o[oKey];
            if (value instanceof Array) {
                for (arrayKey in value) {
                    if (typeof value[arrayKey] === "object") {
                        stack.push(value[arrayKey]);
                    }
                }
            } else {
                if (typeof value === "object") {
                    stack.push(value);
                }
            }
            if (oKey !== nKey) {
                o[nKey] = value;
                delete o[oKey];
            }
        }
    }
    return obj;
}