import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  // ...
  routes: [
    {
      path: "/sign-in",
      page: "/sign-in",
    },
  ],
};

export default nextConfig;
