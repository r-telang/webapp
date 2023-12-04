# webapp

##test

## Overview

This project implements a REST API to manage assignments. The API allows authenticated users to create, update, and delete assignments. Additionally, it enforces certain constraints on assignment points, user permissions, and ensures secure storage of user account information.

## User Requirements

    - Users can create an account by providing email, password, first name, and last name.
    - The account_created field is set to the current time upon successful user creation.
    - Users cannot set values for account_created and account_updated; any provided values for these fields are ignored. Passwords are  never returned in the response payload.
    - Users should use their email as their username. Attempting to create an account with an existing email results in a 400 Bad    request response.
    - Passwords are securely stored using the BCrypt password hashing scheme with salt.
    - Users can update their account information, including first name, last name, and password. Attempting to update other fields results in a 400 Bad Request response.
    - The account_updated field is updated upon successful user update.
    - Users can only update their own account information.
    - Retrieve user information, excluding the password.
    - Users can retrieve their account information, excluding the password.

### Prerequisites

    - VSCode (IDE)
    - POSTMAN
    - MySQL Database
    - Node.js
    - Digital Ocean
    - Dependencies to be Installed
    - Scripts
    - npm i : to install the node modules
    - node index.js: Start the development server.
    - npx test: Run the test suite.

## Endpoints

### The following endpoints are available for operations:

    GET - http://localhost:3000/healthz/
    GET - http://localhost:3000/v1/assignments/
    POST - http://localhost:3000/v1/assignments/
    GET - http://localhost:3000/v1/assignments/:id
    DELETE - http://localhost:3000/v1/assignments/:id
    PUT - http://localhost:3000/v1/assignments/:id

## Response HTTP Messages

    "200 OK": The request succeeded.
    "201 Created": The request succeeded, and a new resource was created.
    "204 No Content": The request succeeded, and no further action is required.
    "400 Bad Request": The server could not understand the request due to invalid syntax.
    "401 Unauthorized": The client needs to authenticate itself.
    "403 Forbidden": The server understood the request but refuses to fulfill it.
    "500 Internal Server Error": The server encountered a situation it does not know how to handle.
    "503 Service Unavailable": The server is not ready to handle the request.

## Instructions

    Clone or download the repository.
    Set up files in your IDE and write the code.
    Download node modules and install dependencies. Start the server with the command npm start.
    Test APIs using Postman. Check the database status after each API call.
    Verify returned status codes against requirements.
    Test the Service

## Ensure the service is operational by checking the following endpoints:

    http://localhost:3000/healthz/: Should return "200 OK".
