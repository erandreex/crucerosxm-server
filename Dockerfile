FROM node:22-alpine3.20

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo package.json y package-lock.json para instalar dependencias primero
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Iniciar la aplicación Node.js
CMD ["npm", "start"]
