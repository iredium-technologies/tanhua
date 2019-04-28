# API Gateway and Auth Server

## Description

Nothing special, just an API Gateway with a built-in Auth Server

## Development Guide
- Install dependencies

    ```
    yarn
    ```

- Create your own env and apis.yml file or copy from the sample

    ```
    cp env-sample .env
    cp apis.yml-sample apis.yml
    ```

- start proxy server

    ```
    yarn dev
    ```
    
## Endpoints
- GET `/users/login`:
  Login page
  
- GET `/users/register`:
  Register page
  
- GET `/oauth/applications`:
  Oauth2 applications dashboard

- GET `/oauth/authorize`:
  Authorization Code flow code issuer

- POST `/oauth/token`:
  Credential issuer
  
