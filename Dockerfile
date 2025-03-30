# Stage 1: Build - Utiliser Node.js pour installer les dépendances et construire le projet
FROM node:lts-alpine as build

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application
RUN npm run build

# Stage 2: Production - Utiliser Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers de build de l'étape précédente vers le dossier de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
