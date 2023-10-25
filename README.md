# **flypedia-api**

An API for fly fishing flies

## **Setting up the development environment**

#### 1. **Clone the repository**

#### 2. **Create a new postgres database**

#### 3. **Add database URL to a `.env` file in project root, as well as a random key for refresh and access tokens**

E.g:

```
ENVIRONMENT=DEVELOPMENT

PORT=3000

# Database
DATABASE_URL=postgres://{DB_USER}:{DB_PASSWORD}@localhost:{DB_PORT}/fly

# Auth
REFRESH_TOKEN_SECRET={RANDOM_SECRET_KEY}
ACCESS_TOKEN_SECRET={RANDOM_SECRET_KEY}
```

#### 4. **Install dependencies**

`yarn install`

#### 5. **Create database schema based on entity metadata**

`yarn mikro-orm-cli schema:create --run`

#### 6. **Seed the database with sample data**

`yarn mikro-orm-cli seeder:run`
