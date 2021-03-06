FROM node:12.14.1-stretch
LABEL maintainers="Andrea Magan <andrea.magan@outlook.com>, Luis Lorenzo <luis.lorenzom@outlook.com>"

# Arguments
ARG PORT
ARG X_API_KEY

# Environment
ENV PORT=${PORT}
ENV X_API_KEY=${X_API_KEY}
ENV HOME /home/scouter

# Create workdir and copy content
WORKDIR ${HOME}
COPY . ${HOME}

# Install system dependencies
RUN apt update && apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \\
libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \\ 
libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \\
libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \\
libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Install node dependencies
RUN npm install

# Set run command
CMD ["npm", "run", "start"]
