# SQL Exercises

## Installation

**Prerequirements:**

Install Java 8 JDK, [Maven](https://maven.apache.org/), [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/docs/install).
Make sure you are able to run `node`, `yarn` and `npm` commands from the command line.


**Installation & running the app:**

1. Clone this repository
2. Run `mvn clean install` to install dependencies
3. Run `mvn exec:java -Dexec.mainClass="Main"` to start the app
4. Start the client by going into frontend directory and running `yarn install && npm start`


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