/** @type {import('next').NextConfig} */
module.exports = {
  // Will be available on both server and client
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SEND_ORIENTATION: process.env.NEXT_PUBLIC_SEND_ORIENTATION, 

    NEXT_PUBLIC_CLOUDANT_HOST_URL: process.env.NEXT_PUBLIC_CLOUDANT_HOST_URL,
    NEXT_PUBLIC_CLOUDANT_USER: process.env.NEXT_PUBLIC_CLOUDANT_USER,
    NEXT_PUBLIC_CLOUDANT_PASSWORD: process.env.NEXT_PUBLIC_CLOUDANT_PASSWORD
  },
  output: 'standalone'
}
