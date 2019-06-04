# API Gateway and Auth Server

## Description

API Gateway with a built-in Auth Server

## Features
- Rate Limit
- Cache (WIP)
- Monitoring (WIP)
- Applications Dashboard
- Yaml Config File

## Development Guide
### Installing Tanhua

#### Setup Git

1. Register to [Github.com](http://github.com/).

2. Install Git

    ```sh
    sudo apt-get install git
    ```

3. Configure Git

    ```sh
    git config --global user.name "Your Name Here"
    git config --global user.email "your-github-email@example.com"
    ```

4. Generate Public Key

    ```sh
    ssh-keygen # then, just press enter
    ```

5. [Add key to Github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)

    ```sh
    cat ~/.ssh/id_rsa.pub # copy the content to github
    ```

#### Setup Hosts

Add the following lines to `/etc/hosts`:

```
127.0.0.1 iredium.local
127.0.0.1 www.iredium.local
127.0.0.1 accounts.iredium.local
127.0.0.1 api.iredium.local
```

#### Setup Tanhua Services

1. Clone Tanhua

    ```sh
    git clone git@github.com:iredium-technologies/tanhua.git
    cd tanhua
    ```

2. Install Dependencies

    ```sh
    yarn
    ```

3. Copy `env` file

    ```sh
    cp env-sample .env
    ```

    Then make any changes if required.
    
4. Copy config file
  
    ```
    cp apis.yml-sample apis.yml
    ```

5. [Create API Client](http://accounts.iredium.local:3039/oauth/applications)

#### Build & Run Tanhua Services
1. Run 

    ```sh
    yarn dev
    ```

2. Access it at `http://api.iredium.local:3039`
    
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
  
