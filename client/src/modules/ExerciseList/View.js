import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { getExerciseList, createSession, submitAnswer, login } from '../../service';
import Exercise from '../../components/Exercise';
import Button from '../../components/Button';

const StartButton = styled(Button)`
  width: 400px;
`;

const SubmitButton = styled(Button)`

`;

const storedToken = window.localStorage.getItem('token');

export default class ExerciseListView extends Component {
  state = {
    exerciseList: null,
    loginModalVisible: false,
    studentNumber: '',

    // Authentication stuff
    authorizationToken: storedToken,
    loginFailed: false,

    // Exercise related stuff
    session: null,
    currentExercise: null,
    currentExerciseStartedAt: null,
    incorrect: false,
  }
  componentDidMount = () => {
    this.getExerciseList(this.props.params.id);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.getExerciseList(nextProps.params.id);
    }
  }
  onLogin = (token) => {
    window.localStorage.setItem('token', token);

    this.setState({
      loginModalVisible: false,
      authorizationToken: token,
    });
    this.createSession(token).then(this.startExercises);
  }
  getExerciseList = (id) => {
    getExerciseList(id).then((exerciseList) =>
      this.setState(() => ({ exerciseList }),
    ));
  }
  start = () => {
    const loggedIn = this.state.authorizationToken !== null;

    if (!loggedIn) {
      this.setState({ loginModalVisible: true });
      return;
    }
    this.onLogin(this.state.authorizationToken);
  }
  startExercises = () => {
    this.setState({
      currentExercise: this.state.exerciseList.exercises[0],
      currentExerciseStartedAt: new Date(),
    });
  }
  toNextExercise = () => {
    const exercises = this.state.exerciseList.exercises;
    const currentExerciseIndex =
      exercises.indexOf(this.state.currentExercise);

    if (currentExerciseIndex + 1 === exercises.length) {
      // TODO
      window.alert('ALL DONE!');
      return;
    }

    this.setState({
      currentExercise: exercises[currentExerciseIndex + 1],
      currentExerciseStartedAt: new Date(),
    });
  }
  createSession = (token) => {
    return createSession(this.state.exerciseList, token).then((session) => {
      this.setState({ session });
    });
  }
  storeStudentNumber = (event) => {
    this.setState({ studentNumber: event.target.value });
  }
  login = () => {
    // Reset current login state
    this.setState({ loginFailed: false });

    login(this.state.studentNumber)
      .then(({ token }) => this.onLogin(token))
      .catch(() => this.setState({ loginFailed: true }));
  }
  submitAnswer = (code) => {
    this.setState({ incorrect: false });

    submitAnswer(
      code,
      this.state.currentExercise,
      this.state.session,
      this.state.currentExerciseStartedAt,
      this.state.authorizationToken,
    ).then(({ correct }) => {
      if (correct) {
        this.toNextExercise();
      } else {
        this.setState({ incorrect: true });
      }
    });
  }
  render() {
    if (this.state.currentExercise) {
      const { exercises } = this.state.exerciseList;
      return (
        <div>
          <h2>Tehtävä {exercises.indexOf(this.state.currentExercise) + 1} / {exercises.length}</h2>
          <Exercise incorrect={this.state.incorrect} onSubmit={this.submitAnswer} exercise={this.state.currentExercise} />
        </div>
      );
    }

    return (
      <div>
        <Modal
          isOpen={this.state.loginModalVisible}
          contentLabel="Modal"
        >
          <h2>Kirjaudu sisään</h2>
          <div>
            <label>Opiskelijanumero</label>
            <input onChange={this.storeStudentNumber} type="text" />
          </div>
          <SubmitButton onClick={this.login}>Kirjaudu sisään</SubmitButton>
        </Modal>
        <p>
          {this.state.exerciseList && this.state.exerciseList.description}
        </p>

        <StartButton onClick={this.start}>Aloita</StartButton>
      </div>
    );
  }
}

