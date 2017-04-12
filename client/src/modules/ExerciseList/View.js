import React, { Component } from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import { getExerciseList, createSession, submitAnswer } from '../../service';
import Exercise from '../../components/Exercise';
import Button from '../../components/Button';
import { showLogin } from '../../state';

const StartButton = styled(Button)`
  width: 400px;
`;

const ExerciseTitle = styled.h2`
  margin-bottom: 0;
`;

const CurrentTry = styled.span`
  font-size: 14px;
  color: #6d6d6d;
`;

class ExerciseListView extends Component {
  state = {
    exerciseList: null,
    currentTry: 1,
    session: null,
    currentExercise: null,
    currentExerciseStartedAt: null,
    error: null,
  };
  componentDidMount = () => {
    this.getExerciseList(this.props.match.params.id);
  };
  componentWillReceiveProps(nextProps) {
    const exerciseIdChanged = this.props.match.params.id !== nextProps.match.params.id;
    const justLoggedIn = !this.props.loggedIn && nextProps.loggedIn;

    if (exerciseIdChanged) {
      this.getExerciseList(nextProps.match.params.id);
    }

    if (justLoggedIn && this.state.exerciseList) {
      this.startExercises();
    }
  }
  getExerciseList = (id) => {
    getExerciseList(id).then((exerciseList) =>
      this.setState(() => ({ exerciseList, currentExercise: null })));
  };
  start = () => {
    const loggedIn = this.props.loggedIn;

    if (!loggedIn) {
      this.props.showLogin();
      return;
    }
    this.startExercises();
  };
  startExercises = async () => {
    await this.createSession();
    this.setState({
      currentExercise: this.state.exerciseList.exercises[0],
      currentExerciseStartedAt: new Date(),
    });
  };
  toNextExercise = () => {
    const exercises = this.state.exerciseList.exercises;
    const currentExerciseIndex = exercises.indexOf(this.state.currentExercise);

    if (currentExerciseIndex + 1 === exercises.length) {
      // TODO
      window.alert('ALL DONE!');
      return;
    }

    this.setState({
      error: null,
      currentTry: 1,
      currentExercise: exercises[currentExerciseIndex + 1],
      currentExerciseStartedAt: new Date(),
    });
  };
  createSession = () => {
    return createSession(this.state.exerciseList, this.props.token).then((session) => {
      this.setState({ session });
    });
  };

  submitAnswer = (code) => {
    const {
      currentTry,
      currentExercise,
      session,
      currentExerciseStartedAt,
    } = this.state;

    submitAnswer(code, currentExercise, session, currentExerciseStartedAt, this.props.token)
      .then(() => this.toNextExercise())
      .catch((err) => {
        if (currentTry === this.state.session.maxTries) {
          this.toNextExercise();
          return;
        }
        if (err.response.status === 400) {
          this.setState(() => ({
            error: err.response.data,
          }));
        } else {
          this.setState(() => ({
            error: {
              type: 'unexpected',
            },
          }));
        }
      });

    this.setState({
      error: null,
      currentTry: currentTry + 1,
    });
  };
  render() {
    if (this.state.currentExercise) {
      const { exercises } = this.state.exerciseList;
      return (
        <div>
          <ExerciseTitle>
            Tehtävä {exercises.indexOf(this.state.currentExercise) + 1} / {exercises.length}
          </ExerciseTitle>
          <CurrentTry>
            Yrityksiä jäljellä:
            {' '}
            <strong>{this.state.session.maxTries - this.state.currentTry + 1}</strong>
          </CurrentTry>
          <Exercise
            error={this.state.error}
            exercise={this.state.currentExercise}
            onSubmit={this.submitAnswer}
          />
        </div>
      );
    }

    return (
      <div>
        <p>
          {this.state.exerciseList && this.state.exerciseList.description}
        </p>

        <StartButton onClick={this.start}>Aloita harjoitukset</StartButton>
      </div>
    );
  }
}

function mapStateToProps({ user, token }) {
  return {
    loggedIn: user !== null,
    token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showLogin: () => dispatch(showLogin()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseListView);
