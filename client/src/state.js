import {
  getExerciseLists as fetchExerciseLists,
  getUser as fetchUser,
} from './service';


const EXERCISE_LISTS_LOADED = 'EXERCISE_LISTS_LOADED';
const USER_LOADED = 'USER_LOADED';
const LOGOUT = 'LOGOUT';

export function getUser() {
  return (dispatch, getState) => {
    const { token } = getState();

    if (!token) {
      return;
    }

    fetchUser(token).then((lists) =>
      dispatch({ type: USER_LOADED, payload: lists }),
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

const INITIAL_STATE = {
  user: null,
  token: window.localStorage.getItem('token'),
  exerciseLists: [],
  loginVisible: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case EXERCISE_LISTS_LOADED: {
      return { ...state, exerciseLists: action.payload };
    }
    case USER_LOADED: {
      return { ...state, user: action.payload };
    }
    case LOGOUT: {

      window.localStorage.removeItem('token');
      return { ...state, token: null, user: null };
    }
    default: {
      return state;
    }
  }
}
