# **flypedia-api**

An API for fly fishing flies

## Usage

<details>
  <summary>GET /flies</summary>

  <br />

  ```plaintext
  GET /flies?pageSize=20&pageNumber=1
  ```

  Supported attributes:

  | Attribute                | Type     | Required | Description            |
  |--------------------------|----------|----------|------------------------|
  | `pageSize`               | number   | Yes      | Number of items to get |
  | `pageNumber`             | number   | Yes      | Page to get            |

  If successful, returns:

  | Attribute                | Type          | Description           |
  |--------------------------|---------------|-----------------------|
  | `metadata`               | Metadata      | Metadata.             |
  | `results`                | Array         | Array of flies.       |

  Example request:

  ```shell
  curl --url "https://flypedia-api-a2cab70bc07d.herokuapp.com/api/v1/flies?pageNumber=1&pageSize=10"
  ```

  Example response:

  ```json
  {
    "metadata":{
        "totalItems":1,
        "pageNumber":1,
        "pageSize":20,
        "totalPages":1
    },
    "results":[
        {
          "id":"21ea7014-2177-4559-a1ac-200344fdea6f",
          "createdAt":"2023-09-12T20:05:12.000Z",
          "updatedAt":"2023-09-12T20:05:12.000Z",
          "name":"Adams",
          "description":"A very popular traditional dry fly...",
          "types":[
              {
                "id":"852ec0c4-9032-4ce0-b191-617802702b12",
                "createdAt":"2023-09-12T19:21:24.000Z",
                "updatedAt":"2023-09-12T19:21:24.000Z",
                "name":"Dry"
              }
          ],
          "imitatees":[
              {
                "id":"3bd7f0b7-802d-49c5-99c0-59212a83f17a",
                "createdAt":"2023-09-12T19:27:52.000Z",
                "updatedAt":"2023-09-12T19:27:52.000Z",
                "name":"Caddis",
                "description":"Caddis create their own “burrows” where they..."
              }
          ]
        }
    ]
  }
  ```

</details>

<details>
  <summary>GET /flies/{id}</summary>

  <br />

  ```plaintext
  GET /flies/{id}
  ```

  If successful, returns:

  | Attribute                | Type            | Description                                   |
  |--------------------------|-----------------|-----------------------------------------------|
  | `id`                     | string          | External fly id.                              |
  | `createdAt`              | string          | Date fly was created in ISO 8601 format       |
  | `updatedAt`              | string          | Date fly was last updated in ISO 8601 format  |
  | `name`                   | string          | Name of fly                                   |
  | `description`            | string          | Fly description                               |
  | `types`                  | Array           | Array of fly types                            |
  | `imitatees`              | Array           | Array of fly imitatees                        |

  Example request:

  ```shell
  curl --url "https://flypedia-api-a2cab70bc07d.herokuapp.com/api/v1/flies/21ea7014-2177-4559-a1ac-200344fdea6f"
  ```

  Example response:

  ```json
  {
    "id":"21ea7014-2177-4559-a1ac-200344fdea6f",
    "createdAt":"2023-09-12T20:05:12.000Z",
    "updatedAt":"2023-09-12T20:05:12.000Z",
    "name":"Adams",
    "description":"A very popular traditional dry fly...",
    "types":[
        {
          "id":"852ec0c4-9032-4ce0-b191-617802702b12",
          "createdAt":"2023-09-12T19:21:24.000Z",
          "updatedAt":"2023-09-12T19:21:24.000Z",
          "name":"Dry"
        }
    ],
    "imitatees":[
        {
          "id":"3bd7f0b7-802d-49c5-99c0-59212a83f17a",
          "createdAt":"2023-09-12T19:27:52.000Z",
          "updatedAt":"2023-09-12T19:27:52.000Z",
          "name":"Caddis",
          "description":"Caddis create their own “burrows” where..."
        }
    ]
  }
  ```

</details>

<details>
  <summary>GET /fly-types</summary>

  <br />

  ```plaintext
  GET /fly-types
  ```

  If successful, returns:

  | Attribute                | Type            | Description           |
  |--------------------------|-----------------|-----------------------|
  | `results`                | Array           | Array of fly types.   |

  Example request:

  ```shell
  curl --url "https://flypedia-api-a2cab70bc07d.herokuapp.com/api/v1/fly-types"
  ```

  Example response:

  ```json
  {
    "results":[
        {
          "id":"852ec0c4-9032-4ce0-b191-617802702b12",
          "createdAt":"2023-09-12T19:21:24.000Z",
          "updatedAt":"2023-09-12T19:21:24.000Z",
          "name":"Dry"
        },
        {
          "id":"9c183c89-6cd7-448a-aee8-b7c5bf192bb4",
          "createdAt":"2023-09-12T19:21:46.000Z",
          "updatedAt":"2023-09-12T19:21:46.000Z",
          "name":"Emerger"
        },
        {
          "id":"4aeb376b-c5ef-451d-8d1c-a685e0a4ad23",
          "createdAt":"2023-09-12T19:21:56.000Z",
          "updatedAt":"2023-09-12T19:21:56.000Z",
          "name":"Lure"
        }
    ]
  }
  ```

</details>

<details>
  <summary>GET /fly-types/{id}</summary>

  <br />

  ```plaintext
  GET /fly-types/{id}
  ```

  If successful, returns:

  | Attribute                | Type            | Description                                        |
  |--------------------------|-----------------|----------------------------------------------------|
  | `id`                     | string          | External fly type id.                              |
  | `createdAt`              | string          | Date fly type was created in ISO 8601 format       |
  | `updatedAt`              | string          | Date fly type was last updated in ISO 8601 format  |
  | `name`                   | string          | Name of fly type                                   |

  Example request:

  ```shell
  curl --url "https://flypedia-api-a2cab70bc07d.herokuapp.com/api/v1/fly-types/852ec0c4-9032-4ce0-b191-617802702b12"
  ```

  Example response:

  ```json
  {
    "id":"852ec0c4-9032-4ce0-b191-617802702b12",
    "createdAt":"2023-09-12T19:21:24.000Z",
    "updatedAt":"2023-09-12T19:21:24.000Z",
    "name":"Dry"
  }
  ```

</details>

<details>
  <summary>GET /fly-types/{id}/flies</summary>

  <br />

  ```plaintext
  GET /fly-types/{id}/flies?pageSize=20&pageNumber=1
  ```

  Supported attributes:

  | Attribute                | Type     | Required | Description            |
  |--------------------------|----------|----------|------------------------|
  | `pageSize`               | number   | Yes      | Number of items to get |
  | `pageNumber`             | number   | Yes      | Page to get            |

  If successful, returns:

  | Attribute                | Type          | Description           |
  |--------------------------|---------------|-----------------------|
  | `metadata`               | Metadata      | Metadata.             |
  | `results`                | Array         | Array of flies.       |

  Example request:

  ```shell
  curl --url "http://localhost:3000/api/v1/fly-types/744902b8-ed8b-4a11-b173-e1dae33b6ddf/flies?pageNumber=1&pageSize=20"
  ```

  Example response:

  ```json
  {
    "metadata":{
        "totalItems":1,
        "pageNumber":1,
        "pageSize":20,
        "totalPages":1
    },
    "results":[
        {
          "id":"21ea7014-2177-4559-a1ac-200344fdea6f",
          "createdAt":"2023-09-12T20:05:12.000Z",
          "updatedAt":"2023-09-12T20:05:12.000Z",
          "name":"Adams",
          "description":"A very popular traditional dry fly...",
          "types":[
              {
                "id":"852ec0c4-9032-4ce0-b191-617802702b12",
                "createdAt":"2023-09-12T19:21:24.000Z",
                "updatedAt":"2023-09-12T19:21:24.000Z",
                "name":"Dry"
              }
          ],
          "imitatees":[
              {
                "id":"3bd7f0b7-802d-49c5-99c0-59212a83f17a",
                "createdAt":"2023-09-12T19:27:52.000Z",
                "updatedAt":"2023-09-12T19:27:52.000Z",
                "name":"Caddis",
                "description":"Caddis create their own “burrows” where they..."
              }
          ]
        }
    ]
  }
  ```

</details>

<details>
  <summary>GET /imitatees</summary>

  <br />

  ```plaintext
  GET /imitatees?pageSize=20&pageNumber=1
  ```

  Supported attributes:

  | Attribute                | Type     | Required | Description            |
  |--------------------------|----------|----------|------------------------|
  | `pageSize`               | number   | Yes      | Number of items to get |
  | `pageNumber`             | number   | Yes      | Page to get            |

  If successful, returns:

  | Attribute                | Type            | Description               |
  |--------------------------|-----------------|---------------------------|
  | `metadata`               | Metadata        | Metadata.                 |
  | `results`                | Array           | Array of imitatees.       |

  Example request:

  ```shell
  curl --url "https://flypedia-api-a2cab70bc07d.herokuapp.com/api/v1/imitatees?pageNumber=1&pageSize=10"
  ```

  Example response:

  ```json
  {
    "metadata":{
      "totalItems":1,
      "pageNumber":1,
      "pageSize":20,
      "totalPages":1
    },
    "results":[
      {
        "id":"85830d8b-4cf9-41f6-b5e4-7b190dcf4556",
        "createdAt":"2023-09-12T20:44:42.000Z",
        "updatedAt":"2023-09-12T20:44:42.000Z",
        "name":"Ant",
        "description":"There are over 12,000 species of ant in the world. They are invertebrates and span from one tenth of an inch to one inch."
      }
    ]
  }
  ```

</details>

<details>
  <summary>GET /imitatees/{id}</summary>

  <br />

  ```plaintext
  GET /imitatees/{id}
  ```

  If successful, returns:

  | Attribute                | Type            | Description                                        |
  |--------------------------|-----------------|----------------------------------------------------|
  | `id`                     | string          | External imitatee id.                              |
  | `createdAt`              | string          | Date imitatee was created in ISO 8601 format       |
  | `updatedAt`              | string          | Date imitatee was last updated in ISO 8601 format  |
  | `name`                   | string          | Name of imitatee                                   |
  | `description`            | string          | Imitatee description                               |

  Example request:

  ```shell
  curl --url "https://flypedia-api-a2cab70bc07d.herokuapp.com/api/v1/imitatees/85830d8b-4cf9-41f6-b5e4-7b190dcf4556"
  ```

  Example response:

  ```json
  {
    "id": "85830d8b-4cf9-41f6-b5e4-7b190dcf4556",
    "createdAt":"2023-09-12T20:05:12.000Z",
    "updatedAt":"2023-09-12T20:05:12.000Z",
    "name":"Ant",
    "description":"There are over 12,000 species of ant in the world...",
  }
  ```

  </details>

  <details>
  <summary>GET /imitatees/{id}/flies</summary>

  <br />

  ```plaintext
  GET /imitatees/{id}/flies
  ```

  Supported attributes:

  | Attribute                | Type     | Required | Description            |
  |--------------------------|----------|----------|------------------------|
  | `pageSize`               | number   | Yes      | Number of items to get |
  | `pageNumber`             | number   | Yes      | Page to get            |

  If successful, returns:

  | Attribute                | Type            | Description               |
  |--------------------------|-----------------|---------------------------|
  | `metadata`               | Metadata        | Metadata.                 |
  | `results`                | Array           | Array of flies.           |

  Example request:

  ```shell
  curl --url "https://flypedia-api-a2cab70bc07d.herokuapp.com/api/v1/imitatees/3bd7f0b7-802d-49c5-99c0-59212a83f17a/flies"
  ```

  Example response:

  ```json
  {
    "metadata":{
        "totalItems":1,
        "pageNumber":1,
        "pageSize":20,
        "totalPages":1
    },
    "results":[
        {
          "id":"21ea7014-2177-4559-a1ac-200344fdea6f",
          "createdAt":"2023-09-12T20:05:12.000Z",
          "updatedAt":"2023-09-12T20:05:12.000Z",
          "name":"Adams",
          "description":"A very popular traditional dry fly...",
          "types":[
              {
                "id":"852ec0c4-9032-4ce0-b191-617802702b12",
                "createdAt":"2023-09-12T19:21:24.000Z",
                "updatedAt":"2023-09-12T19:21:24.000Z",
                "name":"Dry"
              }
          ],
          "imitatees":[
              {
                "id":"3bd7f0b7-802d-49c5-99c0-59212a83f17a",
                "createdAt":"2023-09-12T19:27:52.000Z",
                "updatedAt":"2023-09-12T19:27:52.000Z",
                "name":"Caddis",
                "description":"Caddis create their own “burrows” where they..."
              }
          ]
        }
    ]
  }
  ```

</details>

## Contributing

### **Setting up the development environment**

#### Pre-requisites

- npm >=8.0.0
- yarn >=1
- node >=18.0.0

1. **Clone the repository**

`git clone https://github.com/palmer-h/flypedia-api`

2. **Create a new postgres database**

https://www.postgresql.org/docs/current/tutorial-createdb.html

3. **Add database URL to a `.env` file in project root, as well as a random key for refresh and access tokens**

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

4. **Install project dependencies**

`yarn install`

5. **Create database schema**

`yarn mikro-orm-cli schema:create --run`

6. **Seed the database with sample data**

`yarn mikro-orm-cli seeder:run`

7. **Start the local server**

`yarn mikro-orm-cli seeder:run`
