FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json . 
RUN npm install

# Copy the entire project
COPY . .

# Expose the application port
EXPOSE 4000

# Start the backend service using npm run dev
CMD ["npm", "run", "dev"]
