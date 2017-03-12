import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

/*function Routes() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={HomeView} />
        <Route path="/exercise-lists/:id" component={ExerciseListView} />
      </Route>
    </Router>
  );
}*/

ReactDOM.render(<App />, document.getElementById('root'));
