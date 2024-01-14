import Redis from "ioredis";

const client = new Redis(process.env.REDIS_URL!);

client.on("error", (err) => console.log(err));
// export default client;

const get = async (key: string) => {
    let data = null;

    try {
        data = await client.get(key);
    } catch (err) {
        console.warn(`redis get error: ${err}`);
    }

    return data;
};

const set = async (key: string, value: any, exType?: any, exValue?: any) => {
    try {
        if (!exType) {
            await client.set(key, value);
        } else {
            await client.set(key, value, exType, exValue);
        }
    } catch (err) {
        console.warn(`redis get error: ${err}`);
    }
};

export { client, get, set };
