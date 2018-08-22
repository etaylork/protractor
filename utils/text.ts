// Converts a string containing a comma-separated list of values to a list of values
export function listOf(commaSeparatedValues: string): string[] {
    return commaSeparatedValues.replace(/'/g, '').split(',').map(i => i.trim());
};

/**
 * A trim function that takes in a string and searches for special charaters. If
 * a special charater is found we take the substring from the 0 index all the way
 * up to but not including the special character.
 * 
 * Examples:  
 * 
 *  " /"   Randomize /Screening Data = Randomize
 *  "/"    Randomize/Screening = Randomize
 *  ":"    Column Headers: = Column Headers
 *  "#"    Number# = Number
 *  "?"    Is 4g?  = Is 4g
 *  "("    Window(+/=) = Window
 * 
 **/
export function trimFilterColumn(column): string {

    let x;

    if (column.indexOf(" /") !== -1) {
        x = column.indexOf(" /");
        return column.substring(0, x);
    } else if (column.indexOf("/") !== -1) {
        x = column.indexOf("/");
        return column.substring(0, x);
    } else if (column.indexOf("?") !== -1) {
        x = column.indexOf("?");
        return column.substring(0, x);
    } else if (column.indexOf(" (") !== -1) {
        x = column.indexOf(" (");
        return column.substring(0, x);
    } else if (column.indexOf(":") !== -1) {
        x = column.indexOf(":");
        column = column.substring(0, x);
    } else if (column.indexOf(" #") !== -1) {
        x = column.indexOf(" #");
        column = column.substring(0, x);
    }

    return column;
}

export function parseMetaData(data: string): string[] {
    if(data.indexOf(" : ") !== -1){
        return data.split(" : ");
    } else if (data.indexOf(" :") !== -1) {
        return data.split(" :")
    } else {
        return [data, ""];
    }
}

export function strToNumArray(strArr: string[]): number[] {
    let numArr: number[];
    for(let i = 0; i < strArr.length; i++){
        numArr.push(Number(strArr[i]));
    }
    return numArr;
}
