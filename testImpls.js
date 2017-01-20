var impls = ["toCamelCaseRecursive", "toCamelCaseStackImpl"], testObj = [],
    nestLevel = 10, arrayElements = 10, loops = 10000, monitors = {}, envMem;

function monitor(n) {
    if (!n) {
        n = "default";
    }
    if (monitors[n]) {
        var elapsed = Date.now() - monitors[n].startTime,
            mem = monitors[n].startMem - myFreeMemory(),
            label = " bytes";
        if (mem > 1024) {
            mem = mem / 1024;
            label = " kb";
        }
        if (mem > 1024) {
            mem = mem / 1024;
            label = " mb";
        }
        if (mem > 1024) {
            mem = mem / 1024;
            label = " gb";
        }
        var result = {
            implementation: n,
            milliseconds: elapsed,
            memory: mem.toFixed(2) + label
        };
        delete monitors[n];
        return result;
    } else {
        monitors[n] = {
            startTime: Date.now(),
            startMem: myFreeMemory()
        };
    }
};

function nestInsideSelf(o, ct) {
    var ptr = o, copy = JSON.parse(JSON.stringify(o));
    while (--ct > 0) {
        var newO = JSON.parse(JSON.stringify(copy));
        ptr["RelatedTitle"] = newO;
        ptr = newO;
    }
    return o;
}

for (var j = 0; j < impls.length; j++) {
    testObj[j] = {
        "Member-ID": "1209-8238-30987",
        Renewal_Date: "01/10/2017",
        FirstName: "John",
        LastName: "Doe",
        "date-of-birth": "09/09/1980",
        "resourceType": "Customer",
        "identifier": [
            {
                "comments": [
                    "   MRN assigned on 6-May 2001   "
                ],
                "use": "usual",
                "type": {
                    "coding": [
                        {
                            "system": "http://hl7.org/fhir/v2/0203",
                            "code": "MR"
                        }
                    ]
                },
                "system": "urn:oid:1.2.36.146.595.217.0.1",
                "value": "12345",
                "period": {
                    "start": "2001-05-06"
                },
                "assigner": {
                    "display": "Acme"
                }
            }
        ],
        "active": true,
        "name": [
            {
                "fhir_comments": [
                    "   Peter James Chalmers, but called \"Jim\"   "
                ],
                "use": "official",
                "family": [
                    "Chalmers"
                ],
                "given": [
                    "Peter",
                    "James"
                ]
            },
            {
                "use": "usual",
                "given": [
                    "Jim"
                ]
            }
        ],
        "telecom": [
            {
                "fhir_comments": [
                    "   home communication details aren't known   "
                ],
                "use": "home"
            },
            {
                "system": "phone",
                "value": "(03) 5555 6473",
                "use": "work"
            }
        ],
        "gender": "male",
        "birth-Date": "1974-12-25",
        "deceasedBoolean": false,
        "address": [
            {
                "use": "home",
                "type": "both",
                "line": [
                    "534 Erewhon St"
                ],
                "city": "PleasantVille",
                "district": "Rainbow",
                "state": "Vic",
                "postalCode": "3999",
                "period": {
                    "start": "1974-12-25"
                }
            }
        ],
        "contact": [
            {
                "relationship": [
                    {
                        "coding": [
                            {
                                "system": "http://hl7.org/fhir/patient-contact-relationship",
                                "code": "partner"
                            }
                        ]
                    }
                ],
                "name": {
                    "family": [
                        "du",
                        "Marché"
                    ],
                    "given": [
                        "Bénédicte"
                    ]
                },
                "telecom": [
                    {
                        "system": "phone",
                        "value": "+33 (237) 998327"
                    }
                ],
                "gender": "female",
                "period": {
                    "start": "2012",
                }
            }
        ],
        "managingOrganization": {
            "reference": "Organization/1"
        },
        Entitlements: [{ ID: "123-098-7654", Title: "Space 1999", ReleaseDate: "03/03/1981", ContentRating: "G", Genre: "Science Fiction" }]
    };
    for (var i = 0; i < arrayElements; i++) {
        testObj[j].Entitlements.push(testObj[j].Entitlements[0]);
    }
    testObj[j].RelatedTitle = nestInsideSelf({ ID: "123-098-7654", Title: "Space 1999", ReleaseDate: "03/03/1981", ContentRating: "G", Genre: "Science Fiction" }, nestLevel);
}


for (var i = 0; i < impls.length; i++) {
    myGC();
    monitor(impls[i]);
    var resultObj;
    myLoad('./' + impls[i] + '.js');

    try {
        for (var j = 0; j < loops; j++) {
            resultObj = objToCamelCase(testObj[i]);
        }
        resultObj = 'success';
    }
    catch (e) {
        resultObj = e;
    }
    var m = monitor(impls[i]);
    m.result = resultObj;
    m.kTPS = Math.floor(60 / (m.milliseconds / loops));
    myConsole(JSON.stringify(m));
}

function myGC() {
    if (typeof java != 'undefined') {
        java.lang.System.gc();
    } else {
        global.gc();
    }
}

function myConsole(arg) {
    if (typeof java != 'undefined') {
        java.lang.System.out.println(arg);
    } else {
        console.log(arg);
    }
}

function myFreeMemory() {
    if (typeof java != 'undefined') {
        return java.lang.Runtime.getRuntime().freeMemory();
    } else {
        var mem = process.memoryUsage();
        return mem.heapTotal - mem.heapUsed;
    }
}

function myLoad(scriptFile) {
    if (typeof java != 'undefined') {
        load(scriptFile);
    } else {
        var module = require(scriptFile);
        objToCamelCase = module.objToCamelCase;
    }
}


if (typeof java === 'undefined') { process.exit(); }