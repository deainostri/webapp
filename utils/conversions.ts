//
import decimal from "./decimal";

// -----------------------
// strings
// -----------------------

const string_to_hex = (str: string) => Buffer.from(str).toString("hex");

const hex_to_string = (hex: string) => Buffer.from(hex, "hex").toString();

// -----------------------
// decimals
// -----------------------

const decimal_to_hex = (decimal: decimal) => {
  let hex = decimal.toHexadecimal().split("0x")[1];
  return hex.length % 2 === 0 ? hex : "0" + hex;
};

const hex_to_decimal = (hex: string) => {
  try {
    return new decimal(`0x${hex}`);
  } catch (error) {
    return null;
  }
};

// -----------------------
// numbers
// -----------------------

const number_to_hex = (num: number) => {
  const hex = num.toString(16);
  return hex.length % 2 === 0 ? hex : "0" + hex;
};

const hex_to_number = (hex: string) => parseInt(hex, 16);

export {
  string_to_hex,
  hex_to_string,
  decimal_to_hex,
  hex_to_decimal,
  number_to_hex,
  hex_to_number,
};
