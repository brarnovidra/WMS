FROM node:22.2.0-alpine

# Install 'serve' untuk menjalankan static site
RUN npm install -g serve

# Set workdir
WORKDIR /app

# Salin folder hasil export
COPY out .

# Jalankan server di port 3001
EXPOSE 3001
CMD ["serve", "-s", ".", "-l", "3001"]
