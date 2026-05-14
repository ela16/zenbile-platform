FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Force install all dependencies including devDependencies so tsc is available
RUN npm install --include=dev
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
