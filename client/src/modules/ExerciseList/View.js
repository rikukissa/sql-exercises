import React, { Component } from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import { getExerciseList, createSession, submitAnswer } from '../../service';
import Exercise from '../../components/Exercise';
import Button from '../../components/Button';
import { showLogin, getExampleAnswers, clearExampleAnswers } from '../../state';

const ShowAnswerButton = styled(Button)`
  margin-right: 1em;
`;

const ExceededAction = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
`;

const ExampleAnswer = styled.div`
  margin: 1em 0;
`;

const StartButton = styled(Button)`
  width: 400px;
`;

const NextTaskButton = styled(Button)`
  width: 100%;
`;

const ExerciseTitle = styled.h2`
  margin-bottom: 0;
`;

const CurrentTry = styled.span`
  font-size: 14px;
  color: #6d6d6d;
`;

const SuccessMessage = styled.div`
  margin-bottom: 1em;
  color: #3bbf9d;
`;

class ExerciseListView extends Component {
  state = {
    exerciseList: null,
    currentTry: 1,
    session: null,
    result: [],
    correct: false,
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
    this.props.clearExampleAnswers();
    this.setState({
      currentExercise: this.state.exerciseList.exercises[0],
      currentExerciseStartedAt: new Date(),
    });
  };
  toNextExercise = () => {
    const exercises = this.state.exerciseList.exercises;
    const currentExerciseIndex = exercises.indexOf(this.state.currentExercise);

    this.props.clearExampleAnswers();

    if (currentExerciseIndex + 1 === exercises.length) {
      // TODO
      window.alert('ALL DONE!');
      return;
    }

    this.setState({
      error: null,
      currentTry: 1,
      correct: false,
      result: [],
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

    this.setState({
      error: null,
      result: [],
      currentTry: currentTry + 1,
    });

    submitAnswer(code, currentExercise, session, currentExerciseStartedAt, this.props.token)
      .then(({ correct, result }) => {
        if (!correct) {
          this.setState(() => ({
            result,
            error: {
              type: 'incorrect',
            },
          }));
        } else {
          this.setState(() => ({ result, correct: true }));
        }
      })
      .catch((err) => {
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
  };
  showAnswer = () => {
    this.props.getExampleAnswers(this.state.currentExercise.id);
  };
  render() {
    const { exampleAnswers } = this.props;

    if (this.state.currentExercise) {
      const { exercises } = this.state.exerciseList;
      const triesExceeded = this.state.currentTry > this.state.session.maxTries;
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
            disabled={triesExceeded || this.state.correct}
            error={this.state.error}
            result={this.state.result}
            correct={this.state.correct}
            exercise={this.state.currentExercise}
            onSubmit={this.submitAnswer}
          />

          {exampleAnswers.map((answer) => (
            <ExampleAnswer key={answer}>
              <strong>Esimerkkivastaus</strong><br />
              <span>{answer}</span>
            </ExampleAnswer>
          ))}

          {this.state.correct &&
            <div>
              <SuccessMessage>Oikea vastaus!</SuccessMessage>
              <NextTaskButton onClick={this.toNextExercise}>Seuraava tehtävä</NextTaskButton>
            </div>}

          {triesExceeded &&
            <ExceededAction>
              <ShowAnswerButton onClick={this.showAnswer}>Näytä oikea vastaus</ShowAnswerButton>
              <NextTaskButton onClick={this.toNextExercise}>Seuraava tehtävä</NextTaskButton>
            </ExceededAction>}
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

function mapStateToProps({ user, token, exampleAnswers }) {
  return {
    exampleAnswers,
    loggedIn: user !== null,
    token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showLogin: () => dispatch(showLogin()),
    getExampleAnswers: (exerciseId) => dispatch(getExampleAnswers(exerciseId)),
    clearExampleAnswers: () => dispatch(clearExampleAnswers()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseListView);
