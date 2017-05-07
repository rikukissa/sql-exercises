import axios from 'axios';
import { camelCase, snakeCase } from 'change-case-object';
import { isObject } from 'lodash';

let ROOT = 'http://localhost:4567';

if (process.env.NODE_ENV === 'production') {
  ROOT = 'https://shrouded-bayou-72543.herokuapp.com';
}

if (process.env.PUBLIC_URL === '') {
  ROOT = '';
}

const api = axios.create({
  transformRequest: [(data) => JSON.stringify(snakeCase(data))],
  transformResponse: [
    (data) => {
      if (data === '') {
        return null;
      }

      const responseData = JSON.parse(data);
      return Array.isArray(responseData)
        ? responseData.map((item) => (isObject(item) ? camelCase(item) : item))
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

export function getExercises(token) {
  return api
    .get(`${ROOT}/exercises`, {
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

export function createExerciseList(exerciseList, token) {
  return api
    .post(`${ROOT}/exercise-lists`, exerciseList, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => data);
}

export function deleteExerciseList(exerciseListId, token) {
  return api
    .delete(`${ROOT}/exercise-lists/${exerciseListId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => data);
}

export function updateExerciseList(exerciseList, token) {
  return api
    .put(`${ROOT}/exercise-lists/${exerciseList.id}`, exerciseList, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => data);
}

export function updateExercise(exercise, token) {
  return api
    .put(`${ROOT}/exercises/${exercise.id}`, exercise, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => data);
}

export function createExercise(exercise, token) {
  return api
    .post(`${ROOT}/exercises`, exercise, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => data);
}

export function deleteExercise(exerciseId, token) {
  return api
    .delete(`${ROOT}/exercises/${exerciseId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => data);
}

export function updateExampleAnswerInExercise(exerciseId, answer, token) {
  return api
    .put(
      `${ROOT}/exercises/${exerciseId}/example-answers`,
      { answer },
    {
      headers: {
        Authorization: token,
      },
    },
    )
    .then(({ data }) => data);
}

export function addExampleAnswerToExercise(exerciseId, answer, token) {
  return api
    .post(
      `${ROOT}/exercises/${exerciseId}/example-answers`,
      { answer },
    {
      headers: {
        Authorization: token,
      },
    },
    )
    .then(({ data }) => data);
}

export function addExerciseToExerciseList(exerciseListId, exerciseId, token) {
  return api
    .post(
      `${ROOT}/exercise-lists/${exerciseListId}/exercises`,
    {
      id: exerciseId,
    },
    {
      headers: {
        Authorization: token,
      },
    },
    )
    .then(({ data }) => data);
}
export function deleteExerciseFromExerciseList(exerciseList, exercise, token) {
  return api
    .delete(
      `${ROOT}/exercise-lists/${exerciseList.id}/exercises/${exercise.id}`,
    {
      headers: {
        Authorization: token,
      },
    },
    )
    .then(({ data }) => data);
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

export function getExerciseListReport(exerciseListId) {
  return `${ROOT}/exercise-lists/${exerciseListId}/report`;
}

export function getExerciseReport() {
  return `${ROOT}/exercises/report`;
}

export function getExerciseTypeReport() {
  return `${ROOT}/exercises/report-by-type`;
}

export function getUsersReport() {
  return `${ROOT}/users/report`;
}
