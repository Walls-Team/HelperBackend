# Usar imagen oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --force

# Opcional: Actualizar npm a la última versión
RUN npm install -g npm@10.8.2

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto que tu aplicación usará
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:dev"]