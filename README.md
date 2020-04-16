# scouter ![CD/CI](https://github.com/lusco-fusco/scoutter/workflows/CD/CI/badge.svg?branch=master)
scouter ecommerce price 💸👀

## 🚀 Deployment notes
Generate docker image
```sh
docker build -t scouter . --no-cache
```

Deploy docker container
```sh
docker run -p 8080:8080 --name scouter --restart always scouter
```

## 👩‍💻👨‍💻 Development notes
For deploy this service in development mode just run:
```sh
npm run dev
```
Checkout your potential mistakes:
```
npm run linter
```

## 🛠 Development requirements
* node == 12.14.1
* npm == 6.13.7
* Docker
* Postman, cURL, etc

## 🛍 Ecommerce available
* Amazon
* Ebay
