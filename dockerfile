# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn-lock.json to the working directory
COPY package.json yarn.lock ./

# Install the application dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Add these for EVERY variable your app needs at build-time
ARG NODE_ENV
ARG PORT
ARG MONGODB_URL
ARG OTP_SECRET
ARG JWT_SECRET
ARG JWT_EXPIRES_IN

# Set them as environment variables for the build process
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV MONGODB_URL=$MONGODB_URL
ENV OTP_SECRET=$OTP_SECRET
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_EXPIRES_IN=$JWT_EXPIRES_IN


# Build the NestJS application
RUN yarn build

ENV NODE_ENV=production

# Expose the application port
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/main"]