# Menggunakan image Node.js versi terbaru
FROM node:latest

# Set working directory di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Menginstal dependensi
RUN npm install

# Menyalin seluruh kode sumber aplikasi
COPY . .

# Menjalankan perintah untuk memulai aplikasi
CMD [ "npm", "start" ]
