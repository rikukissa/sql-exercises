import { reducer as formReducer } from 'redux-form';
import { keys } from 'lodash';
import {
  getExerciseList as fetchExerciseList,
  getExerciseLists as fetchExerciseLists,
  getUser as fetchUser,
  login as doLogin,
  getSessions as fetchSessions,
  getUsers as fetchUsers,
  getExampleAnswers as fetchExampleAnswers,
  getExercises as fetchExercises,
  createExerciseList as createExerciseListRequest,
  createExercise as createExerciseRequest,
  addExerciseToExerciseList as addExerciseToExerciseListRequest,
  addExampleAnswerToExercise as addExampleAnswerToExerciseRequest,
  updateExercise as updateExerciseRequest,
  updateExampleAnswerInExercise as updateExampleAnswerInExerciseRequest,
  updateExerciseList as updateExerciseListRequest,
  deleteExerciseFromExerciseList as deleteExerciseFromExerciseListRequest,
  deleteExercise as deleteExerciseRequest,
  deleteExerciseList as deleteExerciseListRequest,
} from './service';

const EXERCISE_LISTS_LOADED = 'EXERCISE_LISTS_LOADED';
const LOGOUT = 'LOGOUT';
const LOGIN_STARTED = 'LOGIN_STARTED';
const SHOW_LOGIN = 'SHOW_LOGIN';
const STORE_TOKEN = 'STORE_TOKEN';
const LOGIN_FAILED = 'LOGIN_FAILED';
const LOGGED_IN = 'LOGGED_IN';
const SESSIONS_LOADED = 'SESSIONS_LOADED';
const USERS_LOADED = 'USERS_LOADED';
const EXAMPLE_ANSWERS_LOADED = 'EXAMPLE_ANSWERS_LOADED';
const CLEAR_EXAMPLE_ANSWERS = 'CLEAR_EXAMPLE_ANSWERS';
const EXERCISES_LOADED = 'EXERCISES_LOADED';
const EXERCISE_LIST_CREATED = 'EXERCISE_LIST_CREATED';
const EXERCISE_CREATED = 'EXERCISE_CREATED';
const EXERCISE_UPDATED = 'EXERCISE_UPDATED';
const EXERCISE_LIST_LOADED = 'EXERCISE_LIST_LOADED';
const EXERCISE_LIST_UPDATED = 'EXERCISE_LIST_UPDATED';
const EXERCISE_DELETED = 'EXERCISE_DELETED';
const EXERCISE_LIST_DELETED = 'EXERCISE_LIST_DELETED';

export function createExercise() {
  return async (dispatch, getState) => {
    const { token, form } = getState();
    const values = form.exercise.values;

    const updating = values.id !== undefined;

    if (updating) {
      const exercise = await updateExerciseRequest(form.exercise.values, token);
      await updateExampleAnswerInExerciseRequest(exercise.id, values.answer, token);
      dispatch({ type: EXERCISE_UPDATED, payload: exercise });
    } else {
      const exercise = await createExerciseRequest(form.exercise.values, token);
      await addExampleAnswerToExerciseRequest(exercise.id, values.answer, token);
      dispatch({ type: EXERCISE_CREATED, payload: exercise });
    }
  };
}

export function deleteExercise(id) {
  return async (dispatch, getState) => {
    const { token } = getState();
    await deleteExerciseRequest(id, token);
    dispatch({ type: EXERCISE_DELETED, payload: id });
  };
}

export function deleteExerciseList(id) {
  return async (dispatch, getState) => {
    const { token } = getState();
    await deleteExerciseListRequest(id, token);
    dispatch({ type: EXERCISE_LIST_DELETED, payload: id });
  };
}

export function createExerciseList() {
  return async (dispatch, getState) => {
    const { token, form } = getState();
    const values = form.exerciseList.values;
    const updating = values.id !== undefined;


    let exerciseList = updating ?
      await updateExerciseListRequest(values, token) :
      await createExerciseListRequest(values, token);

    if (updating) {
      const storedExerciseList = await fetchExerciseList(values.id);

      // Remove all existing exercises that weren't selected
      for (const exercise of storedExerciseList.exercises) {
        if (!values.exercise[exercise.id]) {
          await deleteExerciseFromExerciseListRequest(exerciseList, exercise, token);
        }
      }

      // Create all exercises that the list doesn't already have
      for (const exerciseId of keys(values.exercise)) {
        const alreadyExists = find(storedExerciseList.exercises, (exr) => exr.id === exerciseId);
        const isSelected = values.exercise[exerciseId];
        if (isSelected && !alreadyExists) {
          exerciseList = await addExerciseToExerciseListRequest(exerciseList.id, exerciseId, token);
        }
      }
      dispatch({ type: EXERCISE_LIST_UPDATED, payload: exerciseList });
    } else {
      for (const exerciseId of keys(values.exercise)) {
        const isSelected = values.exercise[exerciseId];
        if (isSelected) {
          exerciseList = await addExerciseToExerciseListRequest(exerciseList.id, exerciseId, token);
        }
      }
      dispatch({ type: EXERCISE_LIST_CREATED, payload: exerciseList });
    }
  };
}

export function getUser() {
  return (dispatch, getState) => {
    const { token } = getState();

    fetchUser(token).then((user) => dispatch({ type: LOGGED_IN, payload: user }));
  };
}

export function getUsers() {
  return (dispatch, getState) => {
    const { token } = getState();

    fetchUsers(token).then((users) => dispatch({ type: USERS_LOADED, payload: users }));
  };
}

export function getExercises() {
  return (dispatch, getState) => {
    const { token } = getState();

    fetchExercises(token).then((exercises) =>
      dispatch({ type: EXERCISES_LOADED, payload: exercises }),
    );
  };
}

export function getExerciseList(id) {
  return (dispatch) => {
    fetchExerciseList(id).then((list) =>
      dispatch({ type: EXERCISE_LIST_LOADED, payload: list }),
    );
  };
}

export function getExerciseLists() {
  return (dispatch) => {
    fetchExerciseLists().then((lists) => dispatch({ type: EXERCISE_LISTS_LOADED, payload: lists }));
  };
}

export function getSessions(userId) {
  return async (dispatch, getState) => {
    const { token } = getState();
    const sessions = await fetchSessions(userId, token);
    dispatch({ type: SESSIONS_LOADED, payload: sessions });
  };
}

export function getExampleAnswers(exerciseId) {
  return async (dispatch) => {
    const answers = await fetchExampleAnswers(exerciseId);
    dispatch({
      type: EXAMPLE_ANSWERS_LOADED,
      payload: answers,
    });
  };
}

export function clearExampleAnswers() {
  return { type: CLEAR_EXAMPLE_ANSWERS };
}

export function logout() {
  return { type: LOGOUT };
}

export function login(studentNumber) {
  return async (dispatch) => {
    dispatch({ type: LOGIN_STARTED });
    try {
      const { token } = await doLogin(studentNumber);
      const user = await fetchUser(token);
      dispatch({ type: STORE_TOKEN, payload: token });
      dispatch({ type: LOGGED_IN, payload: user });
    } catch (err) {
      dispatch({ type: LOGIN_FAILED });
    }
  };
}
export function showLogin() {
  return { type: SHOW_LOGIN };
}

const INITIAL_STATE = {
  user: null,
  users: [],
  loggingIn: false,
  token: window.localStorage.getItem('token'),
  exerciseLists: [],
  exerciseList: null,
  sessions: [],
  loginVisible: false,
  exampleAnswers: [],
  exercises: [],
};

function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case EXERCISE_CREATED: {
      return { ...state, exercises: state.exercises.concat(action.payload) };
    }
    case EXERCISE_UPDATED: {
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.payload.id ? action.payload : exercise,
        ),
      };
    }
    case EXERCISE_LIST_CREATED: {
      return { ...state, exerciseLists: state.exerciseLists.concat(action.payload) };
    }
    case EXERCISE_LIST_UPDATED: {
      return {
        ...state,
        exerciseList: action.payload,
        exerciseLists: state.exerciseLists.map((list) =>
          list.id === action.payload.id ? action.payload : list,
        ),
      };
    }
    case EXERCISE_LIST_DELETED: {
      return {
        ...state,
        exerciseList: state.exerciseList && state.exerciseList.id === action.payload ?
          null :
          state.exerciseList,
        exerciseLists: state.exerciseLists.filter((list) =>
          list.id !== action.payload,
        ),
      };
    }
    case EXERCISE_DELETED: {
      return {
        ...state,
        exerciseList: state.exerciseList && state.exerciseList.exercises
          .filter((exer) => exer.id !== action.payload),
        exercises: state.exercises.filter((exer) =>
          exer.id !== action.payload,
        ),
      };
    }
    case EXERCISE_LISTS_LOADED: {
      return { ...state, exerciseLists: action.payload };
    }
    case EXERCISE_LIST_LOADED: {
      return { ...state, exerciseList: action.payload };
    }
    case EXERCISES_LOADED: {
      return { ...state, exercises: action.payload };
    }
    case LOGGED_IN: {
      return { ...state, user: action.payload, loggingIn: false };
    }
    case LOGOUT: {
      window.localStorage.removeItem('token');
      return { ...state, token: null, user: null };
    }
    case STORE_TOKEN: {
      window.localStorage.setItem('token', action.payload);
      return { ...state, token: action.payload };
    }
    case SHOW_LOGIN: {
      return { ...state, loggingIn: true };
    }
    case LOGIN_STARTED: {
      return { ...state, loginFailed: false };
    }
    case LOGIN_FAILED: {
      return { ...state, loginFailed: true };
    }
    case SESSIONS_LOADED: {
      return { ...state, sessions: action.payload };
    }
    case USERS_LOADED: {
      return { ...state, users: action.payload };
    }
    case EXAMPLE_ANSWERS_LOADED: {
      return { ...state, exampleAnswers: action.payload };
    }
    case CLEAR_EXAMPLE_ANSWERS: {
      return { ...state, exampleAnswers: [] };
    }
    default: {
      return state;
    }
  }
}

export default function (state, action) {
  const newState = reducer(state, action);
  return {
    ...newState,
    form: formReducer(newState.form, action),
  };
}
