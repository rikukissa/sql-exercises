import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { getExerciseLists } from './service';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 1em;
`;

const Sidebar = styled.div`
  width: 200px;
  border-right: 1px solid #b7b7b7;
`;

const ExerciseList = styled(Link)`
  display: block;
  cursor: pointer;
  padding: 1em;
  border-bottom: 1px solid #b7b7b7;
`;

export default class App extends Component {
  state = {
    exerciseLists: [],
  }
  componentDidMount = () => {
    getExerciseLists().then((exerciseLists) =>
      this.setState(() => ({ exerciseLists }),
    ));
  }
  render() {
    return (
      <Container>
        <Sidebar>
          <ul>
            {
              this.state.exerciseLists.map((exerciseList) =>
                <li key={exerciseList.id}>
                  <ExerciseList to={`/exercise-lists/${exerciseList.id}`}>{exerciseList.description}</ExerciseList>
                </li>,
              )
            }
          </ul>

        </Sidebar>
        <Content>
          {this.props.children}
        </Content>
      </Container>
    );
  }
}
