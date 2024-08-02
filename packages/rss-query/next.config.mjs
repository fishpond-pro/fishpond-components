import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack (config) {
    console.log('config.externals: ', config.externals);
    config.externals.push(
      function ({ context, request }, callback) {
        if (/scripts\/server\//.test(request)) {
          console.log('context, request: ', context, request);
          // Externalize to a commonjs module using the request path
          const absoluteRequest = request.replace('@', __dirname.replace(/\/$/, ''))
          return callback(null, 'commonjs ' + absoluteRequest);
        }
  
        // Continue without externalizing the import
        callback();
      },
    )
    return config
  }
};

export default nextConfig;
