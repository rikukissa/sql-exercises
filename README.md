# SQL Exercises

## Installation

**Prerequirements:**

Install Java 8 JDK, PostgreSQL, [Maven](https://maven.apache.org/), [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/docs/install).
Make sure you are able to run `node`, `yarn` and `npm` commands from the command line.


**Database**

```
CREATE USER exercises WITH PASSWORD "super_secret_database_password";
CREATE DATABASE exercises;
GRANT ALL PRIVILEGES ON DATABASE "exercises" to exercises;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO exercises;
GRANT ALL PRIVILEGES ON ALL SEQUENCES in schema public to exercises;
```

**Installation & running the app:**

1. Clone this repository
2. Run `mvn clean install` to install dependencies
3. Run `mvn exec:java -Dexec.mainClass="Main"` to start the app
4. Start the client by going into frontend directory and running `yarn install && npm start`


### Building a release version

1. Run `yarn build:jar` in `client` directory

This builds the frontend assets and copies them under `src/main/resources/build`.
After this the client can be accessed through the running API's root path e.g. `http://localhost:4567/`.

2. Build `.jar` file by running `mvn assembly:assembly`. `target/` directory should now contain a file named `sql-exercises.jar`

3. The jar can be run with `java -jar target/sql-exercises.jar`
Following optional environment parameters can be used to override the default database connection url, user and password

```
JDBC_DATABASE_URL=jdbc:postgresql://localhost:5432/exercises
JDBC_DATABASE_USERNAME=exercises
JDBC_DATABASE_PASSWORD=super_secret_database_password
```

### Test users

Initial database seed contains the following users
* **Opettaja**
  * student number: 12345
  * role: teacher

* **Admin**
  * student number: 00000
  * role: admin

* **Juha Sipilä**
  * student number: 0001
  * role: student

* **Alexander Stubb**
  * student number: 0002
  * role: student

* **Timo Soini**
  * student number: 0003
  * role: student


## API endspoints

### Users
##### Create a new user
`POST /users`
##### List all users
`GET /users`

##### Get specific user
`GET /users/:id`

##### Get currently logged in user
`GET /users/me`

##### Login
`POST /login`

**Example body**:
```
{
  "studentNumber": "123456"
}
```

**Example response**:

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInN0dWRlbnROdW1iZXIiOiI5NjQxMiJ9.e30.5tek_58eNqJDDowNsq3RsyUUySWaBC_dfeGeSsK9wi8"
}
```

After this you can use this token to access restricted routes by including it to your request headers

```
Authorization: "eyJhbGciOiJIUzI1NiIsInN0dWRlbnROdW1iZXIiOiI5NjQxMiJ9.e30.5tek_58eNqJDDowNsq3RsyUUySWaBC_dfeGeSsK9wi8"
```

### Sessions
##### Create session
`POST /sessions`

##### Find specific session
`GET /sessions/:id`

### Exercises
##### Create new exercise
`POST /exercises`

##### List all exercises
`GET /exercises`

##### Get specific exercise
`GET /exercises/:id`

### Exercise lists

##### Create new exercise list
`POST /exercise-lists`

##### List all exercise lists
`GET /exercise-lists`

##### Get specific exercise list
`GET /exercise-lists/:id`