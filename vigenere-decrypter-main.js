const ALPHABETH = "abcdefghijklmnopqrstuvwxyz";
let ans = "";
let iX = 0;
let UpperCase = false;

//for function encrypt()
let encryptNumber = 0;
let rowNumber = 0;

//for function index()
let i = 0;
let done = false;

let errorx = "";

function main(keyTemp, plainText) {
    let key = keyTemp.toLowerCase();
    done = false;
    ans = "";
    iX = 0;
    let xshift =0;
    
    try {
        while (done == false) {
            if (plainText.toUpperCase()[iX] == plainText[iX+xshift]) {
                UpperCase = true;
            } else {
                UpperCase = false;
            }
            if (iX+xshift == plainText.length) {
                done = true;
                break;
            } else {
                if (plainText[iX+xshift] == "." || plainText[iX+xshift] == "," || plainText[iX+xshift] == " " || plainText[iX+xshift] == "?" || plainText[iX+xshift] == "!") {
                    ans = ans + plainText[iX+xshift];
                    xshift = xshift + 1;
                } else {
                    ans = ans + encrypt(key[iX%key.length], plainText.toLowerCase()[iX+xshift]);
                    iX++;
                }
            }
        }
    } catch (error) {
        errorx = error;
        console.error(errorx);
        logError(error);
        logError("Wont work");
        throw new Error("Wont work");
    } finally {
        document.getElementById("output").innerHTML = "<p>" + ans + "</p>";
    }
}

// encrypt(key[iX], plainText[iX])
function encrypt(row, encrypt) {
    encryptNumber = 0;
    rowNumber = 0;

    try {
        encryptNumber = index(encrypt); 
    } catch (error) {
        logError(error);
        errorx = error;
        console.error(errorx);
    }

    try {
        rowNumber = index(row); 
    } catch (error) {
        logError(error);
        errorx = error
        console.error(errorx);
    }
    
    // Modulo immer positiv
    let idx = (encryptNumber - rowNumber + ALPHABETH.length) % ALPHABETH.length;

    if (isNaN(idx)) {
        window.alert("Letter encryption failed. Please check Dev-Console for more Information.")
        throw new Error("Letter encryption failed because encryption isn't a number (" + idx + ")");
    } else {
        if (UpperCase == true) {
            return ALPHABETH[idx].toUpperCase();
        } else {
            return ALPHABETH[idx];
        }
    }
}

function index(xstring) {
    i = 0;
    done = false;
    while (done == false) {
        if (xstring == ALPHABETH[i%ALPHABETH.length]) {
            return i%26;
        } else if (xstring == null || xstring == "." || xstring == "," || xstring == " " || xstring == "?" || xstring == "!") {
            throw new Error(xstring + " is NOT an string");
        } else {
            i++;
        }
    }
}

function logError(error) {
    console.debug("log error triggered");
}
