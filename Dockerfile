# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt for the Linux environment
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port 3000 to the host
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]