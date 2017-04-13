import {
  getExerciseLists as fetchExerciseLists,
  getUser as fetchUser,
  login as doLogin,
  getSessions as fetchSessions,
  getUsers as fetchUsers,
  getExampleAnswers as fetchExampleAnswers,
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
  sessions: [],
  loginVisible: false,
  exampleAnswers: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case EXERCISE_LISTS_LOADED: {
      return { ...state, exerciseLists: action.payload };
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
