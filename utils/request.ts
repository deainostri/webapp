//
import axios from "axios";
import querystring from "querystring";

// -----------------------
// create client
// -----------------------

const axios_client = axios.create({
    timeout: 10000,
});

axios_client.interceptors.response.use(async (response) => {
    await sleep();
    return response;
});

// -----------------------
// other utils
// -----------------------

const sleep = async (ms = 100) => {
    // console.log(`waiting ${ms}ms...`);
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// -----------------------
// request utils
// -----------------------

const get = async (...args: any[]) => {
    let ok = false;
    let counter = 1;
    let response = null;

    // console.log(args);

    while (!ok) {
        try {
            //@ts-ignore
            response = await axios_client.get(...args);

            ok = true;
            return response;
        } catch (error) {
            console.log(`retrying... (${counter++})`);

            if (counter > 100) {
                ok = true;
            }
            // console.log(error);
        }
    }

    return response;
};

const post = async (...args: any) => {
    let ok = false;
    let counter = 1;
    let response = null;

    while (!ok) {
        try {
            //@ts-ignore
            response = await axios_client.post(...args);
            ok = true;
            return response;
        } catch (error) {
            console.log(`retrying... (${counter++})`);

            if (counter > 100) {
                ok = true;
            }
            // console.warn(error);
        }
    }

    return response;
};

const qs_build = (object: any) => querystring.stringify(object);

export { get, post, sleep, qs_build };
