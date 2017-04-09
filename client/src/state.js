import {
  getExerciseLists as fetchExerciseLists,
  getUser as fetchUser,
  login as doLogin,
} from './service';


const EXERCISE_LISTS_LOADED = 'EXERCISE_LISTS_LOADED';
const LOGOUT = 'LOGOUT';
const LOGIN_STARTED = 'LOGIN_STARTED';
const SHOW_LOGIN = 'SHOW_LOGIN';
const STORE_TOKEN = 'STORE_TOKEN';
const LOGIN_FAILED = 'LOGIN_FAILED';
const LOGGED_IN = 'LOGGED_IN';


export function getUser() {
  return (dispatch, getState) => {
    const { token } = getState();

    if (!token) {
      return;
    }

    fetchUser(token).then((user) =>
      dispatch({ type: LOGGED_IN, payload: user }),
    );
  };
}

export function getExerciseLists() {
  return (dispatch) => {
    fetchExerciseLists().then((lists) =>
      dispatch({ type: EXERCISE_LISTS_LOADED, payload: lists }),
    );
  };
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
  loggingIn: false,
  token: window.localStorage.getItem('token'),
  exerciseLists: [],
  loginVisible: false,
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
    default: {
      return state;
    }
  }
}
