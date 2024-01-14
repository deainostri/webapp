import useSWR from "swr";
import axios from "axios";

const useSCSWR = (url: string) => {
    let { data, error } = useSWR(url, async (url: string) => {
        const { data } = await axios.get(url);
        return data;
    });

    if (data && data.data) {
        data = data.data;
    }

    return { data, error };
};

export default useSCSWR;
