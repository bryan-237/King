FROM node:18-bullseye

# Install git + deps pour canvas, sharp, ffmpeg
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json first pour cache npm
COPY package*.json ./

# Install deps - enlève --omit=dev si t’as des devDeps utiles
RUN npm install

# Copy tout le code
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
