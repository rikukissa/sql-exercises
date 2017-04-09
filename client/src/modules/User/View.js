import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { keys, values, groupBy, range } from 'lodash';

import { getSessions } from '../../state';

const ExerciseList = styled.ul`
  list-style: none;
  border: 1px solid #ccc;
  border-bottom: 0;
`;

const ExerciseItem = styled.li`
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
`;

const ExerciseListTitle = styled.div`
  height: 40px;
  display: flex;
  margin-left: 0.5em;
  align-items: center;
`;

const Success = styled.span`
  color: green;
  margin-right: 0.5em;
`;

const Tasks = styled.div`
  display: flex;
  float: right;
`;

const Task = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-left: 1px solid #ccc;
  color: ${({ completed }) => completed ? 'white' : 'black'};
  background-color: ${({ completed }) => completed ? 'green' : 'transparent'};
`;

class UserView extends Component {
  componentDidMount() {
    if (this.props.user) {
      this.props.getSessions();
    }
  }
  componentWillReceiveProps(nextProps) {
    const userLoaded = !this.props.user && nextProps.user;
    if (userLoaded) {
      this.props.getSessions(nextProps.user);
    }
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
        tries.some((sessionTry) => sessionTry.correct) || tries.length === session.maxTries,
      );

      return finished.length === list.exerciseAmount;
    });
  }
  render() {
    return (
      <div>
        <h2>Omat suorituksesi</h2>
        <ExerciseList>

          {
            this.props.exerciseLists.map((list) => {
              const completed = this.isExerciseListCompleted(list);

              return (
                <ExerciseItem key={list.id}>
                  <ExerciseListTitle>
                    {completed && <Success>✔</Success>}
                    {list.description}
                  </ExerciseListTitle>
                  <Tasks>
                    {
                      range(list.exerciseAmount).map((i) => (
                        <Task completed={completed} key={i}>{i + 1}</Task>
                      ))
                    }
                  </Tasks>
                </ExerciseItem>
              );
            })
          }
        </ExerciseList>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    sessions: state.sessions,
    exerciseLists: state.exerciseLists,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSessions: (user) => dispatch(getSessions(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
