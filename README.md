# **flypedia-api**

An API for fly fishing flies

## **Setting up the development environment**

### Pre-requisites

- npm >=8.0.0
- yarn >=1
- node >=18.0.0

#### 1. **Clone the repository**

`git clone https://github.com/palmer-h/flypedia-api`

#### 2. **Create a new postgres database**

https://www.postgresql.org/docs/current/tutorial-createdb.html

#### 3. **Add database URL to a `.env` file in project root, as well as a random key for refresh and access tokens**

E.g:

```
ENVIRONMENT=DEVELOPMENT

PORT=3000

# Database
DATABASE_URL=postgres://{DB_USER}:{DB_PASSWORD}@localhost:{DB_PORT}/{DB_NAME}

# Auth
REFRESH_TOKEN_SECRET={RANDOM_SECRET_KEY}
ACCESS_TOKEN_SECRET={RANDOM_SECRET_KEY}
```

#### 4. **Install project dependencies**

`yarn install`

#### 5. **Create database schema**

`yarn mikro-orm-cli schema:create --run`

#### 6. **Seed the database with sample data**

`yarn mikro-orm-cli seeder:run`

#### 7. **Start the local server**

`yarn mikro-orm-cli seeder:run`
