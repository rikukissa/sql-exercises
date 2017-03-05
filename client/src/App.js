import React, { Component } from 'react';
import { IndexRoute, Router, Route, Link, browserHistory } from 'react-router';
import styled from 'styled-components';
import Modal from 'react-modal';
import { getExerciseLists, getExerciseList, login } from './service';

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

const Button = styled.button`
  width: 400px;
  padding: 1em 0;
  font-size: 16px;
  border: 1px solid #b7b7b7;
  background-image: linear-gradient(-180deg, #34d058 0%, #28a745 90%);
  border: 1px solid rgba(27,31,35,0.2);
  border-radius: 3px;
  color: #fff;
  font-weight: bold;
  text-shadow: -1px -1px rgba(0, 0, 0, 0.1);
`;

const SubmitButton = styled(Button)`

`;

const ExerciseList = styled(Link)`
  display: block;
  cursor: pointer;
  padding: 1em;
  border-bottom: 1px solid #b7b7b7;
`;

class App extends Component {
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

function HomeView() {
  return <h2>Hello</h2>;
}

class ExerciseListView extends Component {
  state = {
    exerciseList: null,
    loginModalVisible: false,
    studentNumber: '',
  }
  componentDidMount = () => {
    this.getExerciseList(this.props.params.id);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.getExerciseList(nextProps.params.id);
    }
  }
  getExerciseList = (id) => {
    getExerciseList(id).then((exerciseList) =>
      this.setState(() => ({ exerciseList }),
    ));
  }
  start = () => {
    if (!this.props.loggedIn) {
      return this.setState({ loginModalVisible: true });
    }
  }
  storeStudentNumber = (event) => {
    this.setState({ studentNumber: event.target.value });
  }
  login = () => {
    login(this.state.studentNumber);
  }
  render() {
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

        <Button onClick={this.start}>Aloita</Button>
      </div>
    );
  }
}

class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={HomeView} />
          <Route path="/exercise-lists/:id" component={ExerciseListView} />
        </Route>
      </Router>
    );
  }
}

export default Routes;
