import { useEffect, useState } from "react";

const calculateTimeLeft = (endTime: number) => {
    const difference = endTime - Date.now();

    return difference;
};

const useCountDown = (targetTime: number) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(Math.max(calculateTimeLeft(targetTime), 0));
        }, 1002);

        return () => clearInterval(interval);
    }, [targetTime]);

    return timeLeft;
};

export default useCountDown;
