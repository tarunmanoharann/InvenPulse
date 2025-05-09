/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.pravatar.cc'],
  },
  webpack: (config, { isServer, dev }) => {
    // Fix for private class fields in node_modules
    config.module.rules.push({
      test: /\.m?js$/,
      include: [
        /node_modules\/undici/,
        /node_modules\/@firebase/,
        /node_modules\/firebase/
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: "defaults" }]
          ],
          plugins: [
            '@babel/plugin-proposal-private-methods',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-private-property-in-object' // Add this plugin
          ]
        }
      }
    });
    
    // Rest of your config remains the same
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
        util: require.resolve('util/'),
      };
    }
    
    return config;
  },
}

module.exports = nextConfig