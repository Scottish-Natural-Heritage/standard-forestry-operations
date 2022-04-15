################################################################################
# Builder Stage
################################################################################

# we're deploying to the node:16-alpine image, so do our building on it too
FROM node:16-alpine as builder

# node-gyp runs as part of the npm install, so we need to install dependencies
# we need git for cypress as it's using a custom version of requests that
# they're maintaining now that the npm one's deprecated
USER root
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    git

# by default, we want to do everything in a non-privileged user, so go to their
# home dir and drop to their account
WORKDIR /home/node
USER node

# copy in the package files so that we can install and build the project
# dependencies
COPY --chown=node:node package*.json ./

# install all the node modules required
RUN npm ci && npm prune --production

################################################################################
# Deployable Image
################################################################################

# we built on the node:16-alpine image, so we need to deploy on it too
FROM node:16-alpine

# drop back to the non-privileged user for run-time
WORKDIR /home/node
USER node

# copy the assets form the builder stage
COPY --chown=node:node --from=builder /home/node/node_modules ./node_modules

# copy the code from the project
COPY --chown=node:node package*.json ./
COPY --chown=node:node ./src ./src
RUN mkdir -p ./dist

# these variables are for overriding but keep them consistent between image and
# run
ENV SFO_PORT 3002
ENV SFO_PATH_PREFIX standard-forestry-operations

# these variables are for overriding and they only matter during run
ENV SFO_SESSION_SECRET override_this_value
ENV SFO_API_URL override_this_value

# let docker know about our listening port
EXPOSE $SFO_PORT

# run the default start script, which kicks off a few pre-start things too
CMD ["npm", "start"]
