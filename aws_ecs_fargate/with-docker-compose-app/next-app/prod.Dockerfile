# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=20

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Copy package.json and package-lock.json files.
COPY package.json package-lock.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm install --production

################################################################################
# Create a stage for building the application.
FROM deps as build

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Copy package.json and the production dependencies from the deps stage.
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy the built application from the build stage into the image.
COPY --from=build /usr/src/app/.next ./.next
COPY ./public ./public

# Run the application.
CMD ["npm", "start"]
