## Notes Management Application

## Description

This is a notes management application, developed by using MERN Stack (MongoDB, Express.js, React.js, Node.js). We can create, read, update and delete notes in this application. This application provides a clean and well structured pattern to handle the various functions.

## Features

-- User authentication (sign up, login, logout)
-- Notes management (create, read, update, delete)


## Model Structure

## User Model

-- name
-- email
-- password

## Notes Model

-- content
-- userId

## End Points

/auth
    - POST "/register" - Register a new user
    - POST "/verifyotp" - OTP verification for registering new user
    - POST "/login" - Login a user
    - POST "/logout" - Logout a user
    - GET "/me" - Get user profile

/notes
    - POST "/new" - Create a new note
    - GET "/view" - View all notes of particular user
    - GET "/view/:id" - View one particular note of particular user
    - PUT "/update/:id" - Update one particular note of particular user
    - DELETE "/delete/:id" - Delete one particular note of particular user
   