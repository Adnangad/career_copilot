# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files
COPY . .

# Build React app
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

# Expose port for production
EXPOSE 3000

# Serve built React app
CMD ["serve", "-s", "dist", "-l", "3000"]
