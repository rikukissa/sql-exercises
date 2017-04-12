import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { round, sum, uniq, keys, values, groupBy, range, sortBy } from 'lodash';

import differenceInSeconds from 'date-fns/difference_in_seconds';
import format from 'date-fns/format';

import { getSessions } from '../../state';

const ExerciseLists = styled.div`
`;

const ExerciseList = styled.ul`
  border: 1px solid #ccc;
  list-style: none;
  margin-bottom: 1em;
`;

const ExerciseListHeader = styled.div`
  background: #f5e6d0;
  display: flex;
  justify-content: space-between;
  padding: 1em;
`;

const ExerciseListTitle = styled.div`
  display: flex;
  margin-left: 0.5em;
  align-items: center;
`;

const Success = styled.span`
  margin-right: 0.5em;
`;

const Tasks = styled.div`
  display: flex;
  float: right;
`;

const Task = styled.div`
  display: flex;
  font-weight: bold;
  margin: 0 3px;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  background-color: #fff;
`;

const CorrectTask = styled(Task)`
  color: white;
  border: 1px solid #30b330;
  background-color: #2acc2a;
  position: relative;
`;
const IncorrectTask = styled(Task)`
  color: white;
  border: 1px solid #c70a2d;
  background-color: #ec0933;
`;

const Sessions = styled.div``;
const Session = styled.div`
  border-top: 1px solid #ccc;
  padding: 0.5em;
`;

const SessionHeader = styled.div`
  font-weight: bold;
  margin-bottom: 0.5em;
`;

const SessionResults = styled.table`
  width: 100%;
`;

const Result = styled.td`
  font-weight: bold;
  text-align: right;
`;

function isCorrect(exerciseTries) {
  return exerciseTries.some((sessionTry) => sessionTry.correct);
}

function isCompleted(exerciseTries, maxTries) {
  return isCorrect(exerciseTries) || exerciseTries.length === maxTries;
}

function sortTriesByStart(tries) {
  return sortBy(tries, ({ startedAt }) => new Date(startedAt));
}

function finishedExercises(session) {
  const triesPerExercise = values(groupBy(session.sessionTries, 'exercise'));
  return triesPerExercise.filter((tries) => isCorrect(tries));
}

function fastestExerciseTime(session) {
  const triesPerExercise = groupBy(session.sessionTries, 'exercise');

  return values(triesPerExercise).reduce(
    (memo, tries) => {
      const sortedTries = sortTriesByStart(tries);
      const start = sortedTries[0].startedAt;
      const end = sortedTries[sortedTries.length - 1].finishedAt;

      const time = differenceInSeconds(end, start);
      if (memo === null || time < memo) {
        return time;
      }
      return memo;
    },
    null,
  );
}

function slowestExerciseTime(session) {
  const triesPerExercise = groupBy(session.sessionTries, 'exercise');

  return values(triesPerExercise).reduce(
    (memo, tries) => {
      const sortedTries = sortTriesByStart(tries);
      const start = sortedTries[0].startedAt;
      const end = sortedTries[sortedTries.length - 1].finishedAt;

      const time = differenceInSeconds(end, start);
      if (memo === null || time > memo) {
        return time;
      }
      return memo;
    },
    null,
  );
}

function averageExerciseTime(session) {
  const triesPerExercise = values(groupBy(session.sessionTries, 'exercise'));

  const times = triesPerExercise.map((tries) => {
    const sortedTries = sortTriesByStart(tries);
    const start = sortedTries[0].startedAt;
    const end = sortedTries[sortedTries.length - 1].finishedAt;
    return differenceInSeconds(end, start);
  });

  return round(sum(times) / times.length, 2);
}

function getLatestSessionForExerciseList(exerciseList, sessions) {
  const sessionsForExerciseList = sessions.filter(
    (session) => session.exerciseList === exerciseList.id,
  );

  if (sessionsForExerciseList.length === 0) {
    return null;
  }

  const sessionsSortedByTime = sortBy(
    sessionsForExerciseList,
    ({ startedAt }) => new Date(startedAt),
  );

  return sessionsSortedByTime[sessionsSortedByTime.length - 1];
}

function getTriesForNthExercise(exerciseN, session) {
  const triesPerExercise = groupBy(session.sessionTries, 'exercise');
  const exerciseIds = uniq(values(triesPerExercise).map((tries) => tries[0].exercise));

  if (exerciseIds[exerciseN] === undefined) {
    return [];
  }

  return triesPerExercise[exerciseIds[exerciseN]];
}

class UserView extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getSessions(parseInt(this.props.match.params.id, 10));
      return;
    }

    if (this.props.user) {
      this.props.getSessions(this.props.user.id);
    }
  }
  componentWillReceiveProps(nextProps) {
    const userLoaded = !this.props.user && nextProps.user;
    const idChanged = this.props.match.params.id !== nextProps.match.params.id;

    if (userLoaded || idChanged) {
      if (this.props.match.params.id) {
        this.props.getSessions(parseInt(nextProps.match.params.id, 10));
        return;
      }
      this.props.getSessions(nextProps.user.id);
    }
  }
  getSessionsForExerciseList(exerciseList) {
    return this.props.sessions.filter((session) => session.exerciseList === exerciseList.id);
  }
  getUser = () => {
    if (!this.props.match.params.id) {
      return this.props.user;
    }

    const id = parseInt(this.props.match.params.id, 10);
    return this.props.users.find((user) => user.id === id);
  };
  isExerciseCompleted(exerciseN, exerciseList) {
    const latestSession = getLatestSessionForExerciseList(exerciseList, this.props.sessions);
    if (!latestSession) {
      return false;
    }
    const tries = getTriesForNthExercise(exerciseN, latestSession);
    return isCompleted(tries, latestSession.maxTries);
  }
  isExerciseCorrect(exerciseN, exerciseList) {
    const latestSession = getLatestSessionForExerciseList(exerciseList, this.props.sessions);
    if (!latestSession) {
      return false;
    }
    const tries = getTriesForNthExercise(exerciseN, latestSession);
    return isCorrect(tries);
  }
  isExerciseListCompleted(list) {
    return this.props.sessions.some((session) => {
      const isRightList = session.exerciseList === list.id;
      if (!isRightList) {
        return false;
      }

      const triesPerExercise = groupBy(session.sessionTries, 'exercise');

      if (keys(triesPerExercise).length < list.exerciseAmount) {
        return false;
      }

      const finished = values(triesPerExercise).filter((tries) =>
        isCompleted(tries, session.maxTries));

      return finished.length === list.exerciseAmount;
    });
  }

  render() {
    const user = this.getUser();
    const isMe = !user || !this.props.user || user.id === this.props.user.id;

    return (
      <div>
        {isMe ? <h2>Omat suorituksesi</h2> : <h2>Käyttäjän {user.name} suoritukset</h2>}
        <ExerciseLists>

          {this.props.exerciseLists.map((exerciseList) => {
            const completed = this.isExerciseListCompleted(exerciseList);

            return (
              <ExerciseList key={exerciseList.id}>
                <ExerciseListHeader key={exerciseList.id}>
                  <ExerciseListTitle>
                    {completed && <Success>✅</Success>}
                    {exerciseList.description}
                  </ExerciseListTitle>
                  <Tasks>
                    {range(exerciseList.exerciseAmount).map((i) => {
                      const taskNum = i + 1;

                      const taskCompleted = this.isExerciseCompleted(i, exerciseList);
                      const taskCorrect = this.isExerciseCorrect(i, exerciseList);

                      if (!taskCompleted) {
                        return <Task key={i}>{taskNum}</Task>;
                      }

                      if (taskCorrect) {
                        return <CorrectTask key={i}>{taskNum}</CorrectTask>;
                      }
                      return <IncorrectTask key={i}>{taskNum}</IncorrectTask>;
                    })}
                  </Tasks>
                </ExerciseListHeader>
                <Sessions>
                  {this.getSessionsForExerciseList(exerciseList).map((session) => (
                    <Session key={session.id}>
                      <SessionHeader>
                        {format(session.startedAt, 'DD.MM.YYYY HH:mm')}
                      </SessionHeader>
                      {session.sessionTries.length === 0 &&
                        <span>Ei suoritettuja yrityskertoja</span>}
                      {session.sessionTries.length > 0 &&
                        <SessionResults>
                          <tbody>
                            <tr>
                              <td>Onnistuneiden tehtävien lukumäärä</td>
                              <Result>
                                {finishedExercises(session).length}
                                {' '}
                                /
                                {' '}
                                {exerciseList.exerciseAmount}
                              </Result>
                            </tr>
                            <tr>
                              <td>Nopein suoritusaika</td>
                              <Result>
                                {fastestExerciseTime(session)} sekuntia
                              </Result>
                            </tr>
                            <tr>
                              <td>Hitain suoritusaika</td>
                              <Result>
                                {slowestExerciseTime(session)} sekuntia
                              </Result>
                            </tr>
                            <tr>
                              <td>Keskimääräinen suoritusaika</td>
                              <Result>
                                {averageExerciseTime(session)} sekuntia
                              </Result>
                            </tr>
                          </tbody>
                        </SessionResults>}
                    </Session>
                  ))}

                </Sessions>
              </ExerciseList>
            );
          })}
        </ExerciseLists>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    users: state.users,
    sessions: state.sessions,
    exerciseLists: state.exerciseLists,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSessions: (userId) => dispatch(getSessions(userId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
