## Overview
This project is a User and Blog Management System built using Node.js, Express.js, PostgreSQL, and JWT for authentication. It allows users to register, log in, manage blog posts, and perform CRUD operations with pagination and filtering features. Admin users can manage the system, including user management and role-based access control.

## Features
User registration and login with JWT authentication.
CRUD operations for blog posts.
Admin panel for managing users.
Pagination and filtering for blog posts.
Role-based access control for different users.
Validation of user input using Joi or Express Validator.
Prerequisites
Before running the project, you need to create a .env file in the root directory of the project. This file stores environment variables necessary for the application to function correctly.
.env File Configuration
## Create a file named .env in the root of your project with the following content:
makefile
Copy code
PORT="enter your port"
SECRET_KEY="enter your secret key"
DB_HOST="enter your host"
DB_PORT="enter your port"
DB_USER="enter your postgres username"
DB_PASSWORD="enter your postgres password"
DB_NAME="enter your database name"

## Explanation of Variables:
PORT: The port number on which the application will run (e.g., 3000, 8080).
SECRET_KEY: A secret key for generating JWT tokens for authentication.
DB_HOST: The host where your PostgreSQL database is located (e.g., localhost, 127.0.0.1).
DB_PORT: The port number of your PostgreSQL database (default is usually 5432).
DB_USER: The PostgreSQL username that has access to the database.
DB_PASSWORD: The password associated with the PostgreSQL user.
DB_NAME: The name of your PostgreSQL database.

## Example .env file:
makefile
Copy code
PORT=5000
SECRET_KEY=mysecretkey123
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase

## Project Setup
Clone the project repository to your local machine.
bash
Copy code
git clone <repository_url>
Navigate to the project directory:
bash
Copy code
cd <project_name>
Create a .env file in the root directory and add the necessary values (as explained above).
Install the required dependencies:
bash
Copy code
npm install
Start the project:
bash
Copy code
npm start
The application should now be running on the port specified in the .env file.

## API Endpoints

### **Admin Panel**
| Method | Endpoint                       | Description                               |
|--------|--------------------------------|-------------------------------------------|
| POST   | `/api/admin/register`          | Register a new user (admin only)          |
| POST   | `/api/admin/login`             | Login for users                           |
| GET    | `/api/admin/users`             | Retrieve the list of users                |
| GET    | `/api/admin/blogs`             | Retrieve the list of blogs (posts)        |
| DELETE | `/api/admin/blogs/{id}`        | Delete a specific blog (post)             |
| DELETE | `/api/admin/users/{id}`        | Delete a specific user                    |

### **User Panel**
| Method | Endpoint                       | Description                               |
|--------|--------------------------------|-------------------------------------------|
| POST   | `/api/user/register`           | Register a new user                       |
| POST   | `/api/user/login`              | Login a user                              |
| GET    | `/api/user/profile`            | Retrieve the profile of the logged-in user |
| PATCH  | `/api/user/profile`            | Update the profile of the logged-in user  |
| DELETE | `/api/user/profile`            | Delete the profile of the logged-in user  |

### **Blog**
| Method | Endpoint                       | Description                               |
|--------|--------------------------------|-------------------------------------------|
| POST   | `/api/blogs`                   | Create a new blog post                    |
| GET    | `/api/blogs`                   | Retrieve a list of blogs with optional search and pagination |
| GET    | `/api/blogs/{id}`              | Get a specific blog post                  |
| PUT    | `/api/blogs/{id}`              | Update a blog post                        |
| DELETE | `/api/blogs/{id}`              | Delete a blog post                        |

### **Comments**
| Method | Endpoint                       | Description                               |
|--------|--------------------------------|-------------------------------------------|
| POST   | `/api/blogs/comments/{blogId}` | Add a new comment to a specific blog      |
| GET    | `/api/blogs/comments/{blogId}` | Retrieve all comments for a specific blog |
| PUT    | `/api/blogs/comments/{blogId}/{commentId}` | Update a specific comment for a blog  |
| DELETE | `/api/blogs/comments/{blogId}/{commentId}` | Delete a specific comment for a blog |


## Technologies Used
Node.js
Express.js
PostgreSQL
JWT (JSON Web Tokens)
Joi or Express Validator (for data validation)
