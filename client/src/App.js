import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom';

import { getUser, getUsers, getExerciseLists } from './state';

import HomeView from './modules/Home/View';
import ExerciseListView from './modules/ExerciseList/View';
import UserWidget from './modules/User/Widget';
import UserView from './modules/User/View';
import UserListView from './modules/User/ListView';
import LoginModal from './modules/Login/Modal';

const Router = process.env.NODE_ENV === 'production' ? HashRouter : BrowserRouter;

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

const UserDetailsContainer = styled.div`
  overflow: auto;
`;

const UserDetails = styled(UserWidget)`
  float: right;
`;

const Tools = styled.div`
  padding: 1em;
`;

const ToolsHeader = styled.div`
  margin-bottom: 0.5em;
  font-weight: bold;
`;

const canViewUsers = (user) => ['teacher', 'admin'].indexOf(user.role) > -1;

class App extends Component {
  componentDidMount = () => {
    this.props.getUser();
    this.props.getExerciseLists();

    if (this.props.user && canViewUsers(this.props.user)) {
      this.props.getUsers();
    }
  };
  componentWillReceiveProps(nextProps) {
    const userLoaded = !this.props.user && nextProps.user;
    if (userLoaded && canViewUsers(nextProps.user)) {
      this.props.getUsers();
    }
  }
  render() {
    const canViewRaports = this.props.loggedIn &&
      ['teacher', 'admin'].indexOf(this.props.user.role) > -1;

    return (
      <Router>
        <Container>
          <Sidebar>
            <ul>
              {this.props.exerciseLists.map((exerciseList) => (
                <li key={exerciseList.id}>
                  <ExerciseList to={`/exercise-lists/${exerciseList.id}`}>
                    {exerciseList.description}
                  </ExerciseList>
                </li>
              ))}
            </ul>
            {canViewRaports &&
              <Tools>
                <ToolsHeader>
                  Opettajan työkalut:
                </ToolsHeader>
                <Link to="/users">Selaa käyttäjiä</Link>
              </Tools>}
          </Sidebar>
          <Content>
            <UserDetailsContainer>
              <UserDetails />
            </UserDetailsContainer>
            <Route exact path="/" component={HomeView} />
            <Route path="/exercise-lists/:id" component={ExerciseListView} />
            <Route path="/me" component={UserView} />
            <Route exact path="/users" component={UserListView} />
            <Route path="/users/:id" component={UserView} />
          </Content>
          <LoginModal />
        </Container>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedIn: state.user !== null,
    user: state.user,
    exerciseLists: state.exerciseLists,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getUser: () => dispatch(getUser()),
    getUsers: () => dispatch(getUsers()),
    getExerciseLists: () => dispatch(getExerciseLists()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
