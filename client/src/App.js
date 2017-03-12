import React, { Component } from 'react';
import styled from 'styled-components';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import { getExerciseLists } from './service';
import HomeView from './modules/Home/View';
import ExerciseListView from './modules/ExerciseList/View';


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
      <Router>
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
            <Route exact path="/" component={HomeView} />
            <Route path="/exercise-lists/:id" component={ExerciseListView} />
          </Content>
        </Container>
      </Router>
    );
  }
}
