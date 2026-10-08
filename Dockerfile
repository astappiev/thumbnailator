# Thumbnailator with all external tools it requires.
#   docker build -t thumbnailator .
#   docker run --rm -v "$PWD:/data" thumbnailator --width 400 file.docx preview.jpg
#
# Test image, extends the above with dev dependencies and tests:
#   docker build --target test -t thumbnailator-test .
#   docker run --rm thumbnailator-test npm test
FROM node:24-trixie-slim AS base

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ffmpeg \
        graphicsmagick \
        ghostscript \
        libreoffice-writer \
        libreoffice-calc \
        libreoffice-impress \
        libreoffice-draw \
        fonts-dejavu \
        fonts-liberation \
        procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY LICENSE README.md ./
COPY src ./src

FROM base AS test

RUN npm ci

COPY test ./test

FROM base

WORKDIR /data
ENTRYPOINT ["node", "/app/src/cli.js"]
