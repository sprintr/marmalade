# Marmalade

OAuth 2.0 boilerplate for microservices

## Getting Started

Install the prerequisites and the required node modules.

### Install the prerequisites

- Node.js: v20.x.x
- MySQL: MySQL 8+ or MariaDB 10+ or SQLite 3.44.x+

### Clone the repository

Clone the repository to start.

```bash
git clone https://github.com/sprintr/marmalade.git
```

Once the cloning is complete, you can install the dependencies.

```bash
cd marmalade
npm install
```

Create a file named `.env` using the provided `.env.example`.

```bash
cp .env.example .env
```

Set the properties for your development environment in the `.env`.

Then, we need to generate public/private keys to generate JWT access tokens.

```bash
mkdir certs && cd certs
openssl genrsa -out PRIVATE.pem 2048
openssl rsa -in PRIVATE.pem -pubout -out PUBLIC.pem
cd ..
```

Now, you're ready to build and launch the serve.

```bash
npm run build
npm start
```

Check out the [docs](docs/api.md) to use the API.

## Linting

Run the command below to lint the code. Make sure you lint and test your code before submitting a PR.

```bash
npm run lint
```

## Testing

Run the command below to test the code. Make sure you test your code before before submitting a PR.

```bash
npm run test
```

## One final thing

[Катя Лель - Мой мармеладный](https://www.youtube.com/watch?v=Tn-z95ev64s)
