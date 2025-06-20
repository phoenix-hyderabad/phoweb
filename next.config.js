/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/home",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "phoenix-bphc.vercel.app",
      },
      {
        hostname: "upload.wikimedia.org",
      },
      {
        hostname: "researchgate.net",
      },
      {
        hostname: "i.ytimg.com",
      },
      {
        hostname: "circuitstate.com",
      },
    ],
  },
};

export default config;
