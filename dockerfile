# Use the official Node.js image as the base image
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn-lock.json to the working directory
COPY package*.json yarn.lock ./

# Install the application dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the application port
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/main"]