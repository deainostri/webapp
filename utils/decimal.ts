//
import decimal from "decimal.js";

const config = {
    precision: 64,
    number: "BigNumber",
};

decimal.config(config);

export default decimal;
