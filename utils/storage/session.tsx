import moment from "moment";

export type SessionKeyType =
    | "walletLogin"
    | "walletConnectLogin"
    | "ledgerAccountIndex"
    | "extensionLogin"
    | "tokenLogin";
type ExpiresType = number | false;

export const setItem = ({
    key,
    data,
    expires,
}: {
    key: SessionKeyType;
    data: any;
    expires: ExpiresType;
}) => {
    if (typeof sessionStorage === "undefined") {
        return;
    }

    sessionStorage.setItem(
        String(key),
        JSON.stringify({
            expires,
            data,
        })
    );
};

export const getItem = (key: SessionKeyType): any => {
    if (typeof sessionStorage === "undefined") {
        return;
    }

    const item = sessionStorage.getItem(String(key));
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
        sessionStorage.removeItem(String(key));
        return null;
    }

    return deserializedItem.data;
};

export const removeItem = (key: SessionKeyType) => {
    if (typeof sessionStorage === "undefined") {
        return;
    }

    sessionStorage.removeItem(String(key));
};

export const clear = () => sessionStorage.clear();
