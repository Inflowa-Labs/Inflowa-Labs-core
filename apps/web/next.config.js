/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@inflowa-labs/ui", "@inflowa-labs/types", "@inflowa-labs/config"],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
