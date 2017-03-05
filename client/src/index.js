import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

import './index.css';
import App from './App';
import HomeView from './modules/Home/View';
import ExerciseListView from './modules/ExerciseList/View';

function Routes() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={HomeView} />
        <Route path="/exercise-lists/:id" component={ExerciseListView} />
      </Route>
    </Router>
  );
}

ReactDOM.render(<Routes />, document.getElementById('root'));
