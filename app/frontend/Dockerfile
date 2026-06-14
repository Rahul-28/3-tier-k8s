# Use the official Node.js latest(26.3.0) image as a build image
FROM node:current-alpine3.22 AS builder

# Set the working directory in the container
WORKDIR /app
# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application's dependencies inside the container
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application for deployment
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:1.25-alpine

# Copy the build files from the builder stage to the nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Updating the nginx configuration to proxy API requests to the backend service. 
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposing port 80 for the nginx server
EXPOSE 80

# Specify the command to run when the container starts
CMD ["nginx", "-g", "daemon off;"]
