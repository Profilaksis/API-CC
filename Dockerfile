# Gunakan image Node.js versi 18.19.0
FROM node:18.19.0

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependensi npm
RUN npm install

# Copy seluruh proyek ke dalam container
COPY . .

# Expose port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Copy folder tfjs ke dalam container
COPY src/tfjs ./src/tfjs

# Command untuk menjalankan aplikasi ketika container dijalankan
CMD ["node", "src/app.js"]
