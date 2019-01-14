/**
 * Convert a decimal integer to html hex color string
 * @param {Number} decimal must be integer in range [0, 16777215]
 * @returns {String} html hex color string
 */
export const toHexColor = decimal => {
    // input validation
    if (!Number.isInteger(decimal)) {
        console.error(`Input ${decimal} for toHexColor() is invalid`);
        return "#ffffff";
    }
    // boundary checking
    if (decimal < 0 || decimal > 16777215) {
        console.warn(`Input ${decimal} for toHexColor() is out of bound`);
        return "#ffffff";
    }
    // convert decimal to hex color
    let hexColor = decimal.toString(16);
    // fill '0' until length === 6
    while (hexColor.length < 6) {
        hexColor = "0" + hexColor;
    }
    // html hex color string has '#' prefix
    return "#" + hexColor;
};

/**
 * Convert a html hex color string to decimal integer value
 * @param {String} hexColor html hex color string
 * @returns {Number} html color decimal integer
 */
export const toDecimal = hexColor => {
    // input validation
    if (
        typeof hexColor !== "string" ||
        hexColor.length !== 7 ||
        hexColor.charAt(0) !== "#"
    ) {
        console.error(`Input ${hexColor} for toDecimal() is invalid`);
        return 0;
    }
    // get rid of '#' prefix and parse to integer
    const value = parseInt(hexColor.slice(1), 16);
    // check if value is NaN, which indicates given input is not a hex color string
    if (Number.isNaN(value)) {
        console.warn(
            `Input ${hexColor} for toDecimal() is not a valid hex color string`
        );
        return 16777215;
    }
    return value;
};
