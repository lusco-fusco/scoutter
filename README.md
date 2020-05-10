# scouter ![CD/CI](https://github.com/lusco-fusco/scoutter/workflows/CD/CI/badge.svg?branch=master)
scouter ecommerce price 💸👀

## 🚀 Deployment notes
Generate docker image
```sh
docker build -t scouter . --no-cache
```

Deploy docker container
```sh
docker run -e "X_API_KEY=SECRET_KEY" -p 8080:8080 --name scouter --restart always scouter
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
Validate the project:
```
npm run test
```

## 🛠 Development requirements
* node == 12.14.1
* npm == 6.13.7
* Docker
* Postman, cURL, etc

## 🛍 Ecommerce available
* Amazon
* Ebay
