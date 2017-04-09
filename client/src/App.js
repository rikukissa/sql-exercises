import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  BrowserRouter,
  HashRouter,
  Route,
  Link,
} from 'react-router-dom';

import {
  getUser,
  getExerciseLists,
} from './state';

import HomeView from './modules/Home/View';
import ExerciseListView from './modules/ExerciseList/View';
import UserWidget from './modules/User/Widget';
import LoginModal from './modules/Login/Modal';

const Router = process.env.NODE_ENV === 'production' ?
  HashRouter :
  BrowserRouter;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 1em;
  overflow: auto;
`;

const Sidebar = styled.div`
  width: 200px;
  border-right: 1px solid #e4e4e4;
`;

const ExerciseList = styled(Link)`
  display: block;
  cursor: pointer;
  padding: 1em;
  border-bottom: 1px solid #d6d6d6;
`;

const UserDetails = styled(UserWidget)`
  position: absolute;
  right: 1em;
  top: 1em;
`;

class App extends Component {
  componentDidMount = () => {
    this.props.getUser();
    this.props.getExerciseLists();
  }
  render() {
    return (
      <Router>
        <Container>
          <Sidebar>
            <ul>
              {
              this.props.exerciseLists.map((exerciseList) =>
                <li key={exerciseList.id}>
                  <ExerciseList to={`/exercise-lists/${exerciseList.id}`}>{exerciseList.description}</ExerciseList>
                </li>,
              )
            }
            </ul>
          </Sidebar>
          <UserDetails />
          <Content>
            <Route exact path="/" component={HomeView} />
            <Route path="/exercise-lists/:id" component={ExerciseListView} />
          </Content>
          <LoginModal />
        </Container>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    exerciseLists: state.exerciseLists,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getUser: () => dispatch(getUser()),
    getExerciseLists: () => dispatch(getExerciseLists()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
