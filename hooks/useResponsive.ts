//
import { useMediaQuery } from "react-responsive";

export function useIsMobile() {
    return useMediaQuery({ query: `(max-width: 425px)` });
}

export function useIsNotDesktop() {
    return useMediaQuery({ query: `(max-width: 768px)` });
}

export function useIsTablet() {
    return useMediaQuery({
        query: `(min-width: 769px) and (max-width: 1023px)`,
    });
}

export function useIsDesktop() {
    return useMediaQuery({ query: `(min-width: 1024px)` });
}
