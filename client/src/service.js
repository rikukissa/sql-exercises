import axios from 'axios';
import { camelCase, snakeCase } from 'change-case-object';
import { isObject } from 'lodash';

const ROOT = process.env.NODE_ENV === 'production'
  ? 'https://shrouded-bayou-72543.herokuapp.com'
  : 'http://localhost:4567';

const api = axios.create({
  transformRequest: [(data) => JSON.stringify(snakeCase(data))],
  transformResponse: [
    (data) => {
      const responseData = JSON.parse(data);
      return Array.isArray(responseData)
        ? responseData.map((item) => isObject(item) ? camelCase(item) : item)
        : camelCase(responseData);
    },
  ],
});

export function getExerciseLists() {
  return api.get(`${ROOT}/exercise-lists`).then(({ data }) => data);
}

export function getUser(token) {
  return api
    .get(`${ROOT}/users/me`, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => data);
}

export function getUsers(token) {
  return api
    .get(`${ROOT}/users`, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => data);
}

export function getSessions(userId, token) {
  return api
    .get(`${ROOT}/sessions?user=${userId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => data);
}

export function getExerciseList(id) {
  return api.get(`${ROOT}/exercise-lists/${id}`).then(({ data }) => data);
}

export function getExampleAnswers(id) {
  return api.get(`${ROOT}/exercises/${id}/example-answers`).then(({ data }) => data);
}

export function login(studentNumber) {
  return api.post(`${ROOT}/login`, { studentNumber }).then(({ data }) => data);
}

export function createSession(exerciseList, token) {
  return api
    .post(
      `${ROOT}/sessions`,
    {
      exerciseList: exerciseList.id,
      startedAt: new Date().toISOString(),
    },
    {
      headers: {
        Authorization: token,
      },
    },
    )
    .then(({ data }) => data);
}

export function submitAnswer(code, exercise, session, startedAt, token) {
  return api
    .post(
      `${ROOT}/session-tries`,
    {
      exercise: exercise.id,
      session: session.id,
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      answer: code,
    },
    {
      headers: {
        Authorization: token,
      },
    },
    )
    .then(({ data }) => data);
}
