# base node image
FROM --platform=linux/amd64 node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /drakenfruit-portaal

ADD package.json package-lock.json .npmrc postinstall.js ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /drakenfruit-portaal

COPY --from=deps /drakenfruit-portaal/node_modules /drakenfruit-portaal/node_modules
ADD package.json package-lock.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /drakenfruit-portaal

COPY --from=deps /drakenfruit-portaal/node_modules /drakenfruit-portaal/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /drakenfruit-portaal

COPY --from=production-deps /drakenfruit-portaal/node_modules /drakenfruit-portaal/node_modules
COPY --from=build /drakenfruit-portaal/node_modules/.prisma /drakenfruit-portaal/node_modules/.prisma

COPY --from=build /drakenfruit-portaal/build /drakenfruit-portaal/build
COPY --from=build /drakenfruit-portaal/public /drakenfruit-portaal/public
COPY --from=deps /drakenfruit-portaal/public/tinymce /drakenfruit-portaal/public/tinymce
ADD . .

RUN --mount=type=secret,id=PROD_DATABASE_URL \
  DATABASE_URL=$(cat /run/secrets/PROD_DATABASE_URL)

RUN npx prisma generate
RUN npx prisma migrate deploy

CMD ["npm", "start"]
