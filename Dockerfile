# Use the official Node.js image as the base image
FROM node:18 as builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Rebuild bcrypt for the Linux environment
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Use a lightweight image for the production stage
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependencies and built files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Copy the TypeScript configuration
COPY tsconfig*.json ./

# Copy .env file
COPY .env .env

# Expose port 3000 to the host
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]