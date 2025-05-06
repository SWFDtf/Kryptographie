// let plainText = "abcde";
// let key = "edcba";
const ALPHABETH = "abcdefghijklmnopqrstuvwxyz";
let ans = "";
let iX = 0;
let UpperCase = false;

//for function encrypt()
let rowNumber = 0;
let columnNumber = 0;

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
            console.log("X:"+iX);
            console.log("shift:"+xshift);
            if (plainText.toUpperCase()[iX] == plainText[iX+xshift]) {
                UpperCase = true;
            } else {
                UpperCase = false;
            }
            if (iX+xshift == plainText.length) {
                done == true;
                break;
            } else {
                if (plainText[iX+xshift] == "." || plainText[iX+xshift] == "," || plainText[iX+xshift] == " " || plainText[iX+xshift] == "?" || plainText[iX+xshift] == "!") {
                    ans = ans + plainText[iX+xshift];
                    xshift = xshift + 1;
                } else {
                    ans = ans + encrypt(key[iX%key.length], plainText.toLowerCase()[iX+xshift]);
                    iX++;
                }
                console.log(ans);
                
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
function encrypt(row, column) {
    //einzelnd
    //resetting number values
    rowNumber = 0;
    columnNumber = 0;

    //logging
    console.log("row " + row);
    console.log("alphabeth.length " + ALPHABETH.length);
    console.log("column " + column);

    //finding index number for current symnbol
    console.log("finding for columb and row a number...");
    
    try {
        rowNumber = index(row); 
    } catch (error) {
        logError(error);
        errorx = error;
        console.error(errorx);
        console.error("error because of invalid row (" + row + ")");
        console.error("row: " + row + ";");
        console.error("rowNumber: " + rowNumber + ";");
    } finally {
        console.log("row_number:" + rowNumber);
        console.debug("row: " + row + ";");
        console.debug("rowNumber: " + rowNumber + ";");
    }

    try {
        columnNumber = index(column); 
    } catch (error) {
        logError(error);
        errorx = error
        console.error(errorx);
        console.error("error because of invalid colimn (" + column + ")");
        console.error("column: " + column + ";");
        console.error("columnNumber: " + columnNumber + ";");
    } finally {
        console.log("column_number: " + columnNumber)
        console.debug("column: " + column + ";");
        console.debug("columnNumber: " + columnNumber + ";");
    }
    
    /*finding the encrypted symbol
            this can be done by using a specific formula

            (row+col)%alphabeth.length


        for e.g. alphabeth length = 4
        | A     | B     | C     | D     |
        _________________________________
        | A     | B     | C     | D     |
    A   | 0     | 1     | 2     | 3     | // as indexes
        | 0%4   | 1%4   | 2%4   | 3%4   | // as encrypted identifiyers & alphabeth length
        _________________________________
        | B     | C     | D     | A     |
    B   | 1     | 2     | 3     | 0     | 
        | 1%4   | 2%4   | 3%4   | 4%4   |
        _________________________________
        | C     | D     | A     | B     |
    C   | 2     | 3     | 0     | 1     | 
        | 2%4   | 3%4   | 4%4   | 5%4   |
        _________________________________
        | D     | A     | B     | C     |
    D   | 3     | 0     | 1     | 2     | 
        | 3%4   | 4%4   | 5%4   | 6%4   |
        _________________________________

        man sieht, dass wenn man an der gewünchten verschiebung kommen will die reihe addiert 
        und um dann den 'plain text' einzufügen addiert man deren index mit der davoringen rechnung

        -> (reihe + spalte)% al.length
    */
    if ((( rowNumber + columnNumber ) % ALPHABETH.length) == null) {
        window.alert("Letter encryption failed. Please check Dev-Console for more Information.")
        throw new Error("Letter encryption failed because encryption isn't a number (" + (( rowNumber + columnNumber ) % ALPHABETH.length) + ")");
        
    } else {
        console.log("the encrypted letter is: " + ALPHABETH[(( rowNumber + columnNumber ) % ALPHABETH.length)]);
        if (UpperCase == true) {
            console.log("it is uppercase");
            return ALPHABETH[(( rowNumber + columnNumber ) % ALPHABETH.length)].toUpperCase();
        } else {
            return ALPHABETH[(( rowNumber + columnNumber ) % ALPHABETH.length)];
        }
    }
    
}

function index(xstring) {
    i = 0;
    done = false;
    while (done == false) {
        console.log(i);
        if (xstring == ALPHABETH[i%ALPHABETH.length]) {
            console.info("Index is " + i%26);
            
            return i%26;
        } else if (xstring == null || xstring == "." || xstring == "," || xstring == " " || xstring == "?" || xstring == "!") {
            throw new Error(xstring + " is NOT an string");
            break;
        } else {
            i++;
        }
    }
}



function logError(error) {
    console.debug("log error triggered");
}