# Use the official Node.js latest(26.3.0) image as a base image
FROM node:current-alpine3.22

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application's dependencies inside the container
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Specify the command to run when the container starts
ENTRYPOINT [ "node", "index.js" ]
