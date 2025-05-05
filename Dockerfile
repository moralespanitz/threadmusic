# Usar una imagen base de Node.js
FROM node:16-alpine

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto en el que NestJS estará escuchando (default 3000)
EXPOSE 8001

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
