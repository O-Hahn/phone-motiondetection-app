# phone-motiondetection-app
This next.js App builds an Web-Application for detecting digit motions with your smartphone. I uses the accelarator sensor to get the motions. 
To run properly, the web-app must be deployed with an https - because of the security rules of smartphones only to publish accelartor data based on trusted websides where also the use has granted access. 

## Installation of the base package 

This package is created with: 
```bash
npx create-next-app --example with-docker phone-motiondetection-app

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

npm install @headlessui/react @heroicons/react

```
## Adopt .dockerignore file
Recommended to have .dockerignore file with the following content

Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
.git


## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
1. Build your container: `docker build -t phone-md-app .`.
1. Run your container: `docker run -p 3000:3000 phone-md-app`.

You can view your images created with `docker images`.

### In existing projects

To add support for Docker to an existing project, just copy the `Dockerfile` into the root of the project and add the following to the `next.config.js` file:

```js
// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: 'standalone',
}
```

This will build the project as a standalone app inside the Docker image.

## Running Locally

First, run the development server:

```bash
npm run dev
```

## Docker build 

Build image:
`docker build . -t phone-md-app`

Run image:
`docker rm phone-md-app`
`docker run -p 3000:3000 --name phone-md-app phone-md-app`

## Deploy build into registry
`docker tag sensor-app:latest de.icr.io/fh-bgld/sensor-app:latest` 
`docker push de.icr.io/fh-bgld/sensor-app:latest`

##


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
