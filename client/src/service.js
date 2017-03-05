import axios from 'axios';

export function getExerciseLists() {
  return axios.get('http://localhost:4567/exercise-lists').then(({ data }) => data);
}

export function getExerciseList(id) {
  return axios.get(`http://localhost:4567/exercise-lists/${id}`).then(({ data }) => data);
}
export function login(studentNumber) {
  return axios.post('http://localhost:4567/login', { student_number: studentNumber }).then(({ data }) => data);
}
