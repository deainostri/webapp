/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        // Fixes npm packages that depend on `fs` module
        // if (!isServer) {
        //     config.resolve.fallback = {
        //         fs: require.resolve("browserify-fs"),
        //         crypto: require.resolve("crypto-browserify"),
        //         stream: require.resolve("stream-browserify"),
        //         path: require.resolve("path-browserify"),
        //         process: false,
        //     };
        // }

        return config;
    },
};
