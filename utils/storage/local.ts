import moment from "moment";

type ExpiresType = number | false;

export const setItem = ({
    key,
    data,
    expires,
}: {
    key:
        | "nonce"
        | "walletconnect"
        | "loginMethod"
        | "address"
        | "ledgerLogin"
        | "sentTransactions";
    data: any;
    expires: ExpiresType;
}) => {
    if (typeof window == "undefined") {
        return;
    }

    window.localStorage.setItem(
        String(key),
        JSON.stringify({
            expires,
            data,
        })
    );
};

export const getItem = (
    key:
        | "nonce"
        | "walletconnect"
        | "loginMethod"
        | "address"
        | "ledgerLogin"
        | "sentTransactions"
): any => {
    if (typeof window == "undefined") {
        return;
    }

    const item = window.localStorage.getItem(String(key));
    if (!item) {
        return null;
    }

    const deserializedItem = JSON.parse(item);
    if (!deserializedItem) {
        return null;
    }

    if (
        !deserializedItem.hasOwnProperty("expires") ||
        !deserializedItem.hasOwnProperty("data")
    ) {
        return null;
    }

    const expired = moment().unix() >= deserializedItem.expires;
    if (expired) {
        window.localStorage.removeItem(String(key));
        return null;
    }

    return deserializedItem.data;
};

export const removeItem = (
    key: "nonce" | "walletconnect" | "loginMethod" | "address" | "ledgerLogin"
) => {
    if (typeof window == "undefined") {
        return;
    }

    window.localStorage.removeItem(String(key));
};

export const successDescription = "successDescription";
