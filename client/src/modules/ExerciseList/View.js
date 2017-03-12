import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { getExerciseList, createSession, submitAnswer, login } from '../../service';
import Exercise from '../../components/Exercise';
import Button from '../../components/Button';

const StartButton = styled(Button)`
  width: 400px;
`;

const SubmitButton = styled(Button)``;

const ExerciseTitle = styled.h2`
  margin-bottom: 0;
`;

const CurrentTry = styled.span`
  font-size: 14px;
  color: #6d6d6d;
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
    currentTry: 1,
    session: null,
    currentExercise: null,
    currentExerciseStartedAt: null,
    incorrect: false,
  }
  componentDidMount = () => {
    this.getExerciseList(this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getExerciseList(nextProps.match.params.id);
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
      currentTry: 1,
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
    const {
      currentTry,
      currentExercise,
      session,
      currentExerciseStartedAt,
      authorizationToken,
    } = this.state;

    submitAnswer(
      code,
      currentExercise,
      session,
      currentExerciseStartedAt,
      authorizationToken,
    ).then(({ correct }) => {
      if (correct) {
        this.toNextExercise();
      } else if (currentTry === session.maxTries) {
        this.toNextExercise();
      } else {
        this.setState({ incorrect: true });
      }
    });

    this.setState({
      incorrect: false,
      currentTry: currentTry + 1,
    });
  }
  render() {
    if (this.state.currentExercise) {
      const { exercises } = this.state.exerciseList;
      return (
        <div>
          <ExerciseTitle>
            Tehtävä {exercises.indexOf(this.state.currentExercise) + 1} / {exercises.length}
          </ExerciseTitle>
          <CurrentTry>
            Yrityksiä jäljellä: <strong>{this.state.session.maxTries - this.state.currentTry + 1}</strong>
          </CurrentTry>
          <Exercise
            incorrect={this.state.incorrect}
            exercise={this.state.currentExercise}
            onSubmit={this.submitAnswer}
          />
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

        <StartButton onClick={this.start}>Aloita harjoitukset</StartButton>
      </div>
    );
  }
}

