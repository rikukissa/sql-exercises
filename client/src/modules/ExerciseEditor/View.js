import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { find } from 'lodash';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import {
  getExercises,
  createExerciseList,
  createExercise,
  getExerciseList,
  getExampleAnswers,
  deleteExercise,
  deleteExerciseList,
} from '../../state';
import Report from '../../components/Report';
import { getExerciseTypeReport, getExerciseReport } from '../../service';

const Container = styled.div`
  display: flex;
`;

const Column = styled.div`
  flex: 0.5;
  &:last-child {
    padding-left: 1em;
  }
`;

const Form = styled.form`
  margin-bottom: 2em;
`;

const EditLink = styled(Link)`
  text-align: right;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const DeleteLink = styled.button`
  border: 0;
  color: #349ad0;
  font-size: inherit;
  background: transparent;
  padding: 0;
  margin-left: 0.5em;
`;

const renderExercises = ({ exercises, fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <label>Tehtävälistan harjoitukset:</label>
    <div>
      {exercises.map((exercise, index) => (
        <div key={index}>
          <label>#{exercise.id}</label>
          <Field name={`exercise.${exercise.id}`} component="input" type="checkbox" />
        </div>
      ))}
    </div>
  </div>
);

const ExerciseListForm = (props) => {
  const { exercises, onSubmit, pristine, submitting, editMode } = props;

  return (
    <Form onSubmit={onSubmit}>
      <div>
        <label>Kuvaus:</label>
        <div>
          <Field name="description" component="input" type="text" placeholder="Perusharjoitukset" />
        </div>
        <div>
          <FieldArray name="exercises" exercises={exercises} component={renderExercises} />
        </div>
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>
          {editMode ? 'Tallenna' : 'Luo tehtävälista'}
        </button>
      </div>
    </Form>
  );
};

const ExerciseForm = (props) => {
  const { onSubmit, pristine, submitting, editMode } = props;

  return (
    <Form onSubmit={onSubmit}>
      <div>
        <label>Tehtävänanto</label>
        <div>
          <Field
            name="description"
            component="input"
            type="text"
            placeholder="Valitse opettajat kaikilta kursseilta"
          />
        </div>
      </div>
      <div>
        <label>Vastaus</label>
        <div>
          <Field
            name="answer"
            component="textarea"
            type="text"
            placeholder="SELECT opettaja FROM kurssit;"
          />
        </div>
      </div>
      <div>
        <label>Vaikeus</label>
        <div>
          <Field name="type" component="select">
            <option value="easy">Helppo</option>
            <option value="medium">Normaali</option>
            <option value="hard">Vaikea</option>
          </Field>
        </div>
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>
          {editMode ? 'Tallenna' : 'Luo tehtävä'}
        </button>
      </div>
    </Form>
  );
};

const CreateExerciseForm = reduxForm({
  form: 'exercise',
  enableReinitialize: true,
})(ExerciseForm);

const CreateExerciseListForm = reduxForm({
  form: 'exerciseList',
  enableReinitialize: true,
})(ExerciseListForm);

class ExerciseEditor extends Component {
  componentDidMount() {
    this.props.getExercises();
    const { exerciseId, exerciseListId } = this.props.match.params;

    if (exerciseId) {
      this.props.getExampleAnswers(parseInt(exerciseId, 10));
    }
    if (exerciseListId) {
      this.props.getExerciseList(parseInt(exerciseListId, 10));
    }
  }
  componentWillReceiveProps(nextProps) {
    const { exerciseId, exerciseListId } = nextProps.match.params;
    const exerciseIdChanged = exerciseId && exerciseId !== this.props.match.params.exerciseId;
    const exerciseListIdChanged = exerciseListId && exerciseListId !== this.props.match.params.exerciseListId;

    if (exerciseIdChanged) {
      this.props.getExampleAnswers(parseInt(exerciseId, 10));
    }

    if (exerciseListIdChanged) {
      this.props.getExerciseList(parseInt(exerciseListId, 10));
    }
  }
  render() {
    const {
      match,
      exerciseLists,
      exercises,
      exerciseList,
      exampleAnswers,
      user,
    } = this.props;

    const { exerciseId, exerciseListId } = match.params;

    const existingExerciseList = find(exerciseLists, {
      id: parseInt(exerciseListId, 10),
    });

    const existingExercise = find(exercises, {
      id: parseInt(exerciseId, 10),
    });

    const exerciseListDefaults = existingExerciseList ? {
      ...existingExerciseList,
      exercise: exerciseList && exerciseList.exercises.reduce((memo, exercise) => ({ ...memo, [exercise.id]: true }), {}),
    } : null;

    const exerciseDefaults = existingExercise ?
      { ...existingExercise, answer: exampleAnswers[0] } :
      { type: 'easy' };

    const exerciseEditMode = Boolean(existingExercise);
    const exerciseListEditMode = Boolean(existingExerciseList);


    return (
      <div>
        <h1>Tehtäväeditori</h1>

        <Container>
          <Column>
            <h3>{exerciseEditMode ? `Muokkaa tehtävää #${existingExercise.id}` : 'Luo tehtävä'}</h3>
            <CreateExerciseForm
              initialValues={exerciseDefaults}
              editMode={exerciseEditMode}
              onSubmit={this.props.createExercise}
            />
            {exerciseEditMode && <Link to="/exercise-editor">Lopeta muokkaaminen</Link>}
          </Column>
          <Column>
            <h3>
              {
                exerciseListEditMode ?
                  `Muokkaa tehtävälistaa "${existingExerciseList.description}"` :
                  'Luo tehtävälista'
              }
            </h3>
            <CreateExerciseListForm
              editMode={exerciseListEditMode}
              initialValues={exerciseListDefaults}
              exercises={this.props.exercises}
              onSubmit={this.props.createExerciseList}
            />
            {exerciseListEditMode && <Link to="/exercise-editor">Lopeta muokkaaminen</Link>}
          </Column>
        </Container>
        <hr />
        <Container>
          <Column>
            <h2>Tehtävät</h2>
            {this.props.exercises.map((exercise) => {
              return (
                <ListItem key={exercise.id}>
                  <span>
                    <strong>#{exercise.id}</strong> {exercise.description}
                  </span>
                  {user && (user.role === 'admin' || user.id === exercise.creator) && (
                    <span>
                      <EditLink to={`/exercise-editor/exercises/${exercise.id}`}>
                        Muokkaa
                      </EditLink>
                      <DeleteLink onClick={() => this.props.deleteExercise(exercise.id)}>Poista</DeleteLink>
                    </span>
                  )}
                </ListItem>
              );
            })}
            <br />
            <Report href={getExerciseTypeReport()}>
              <strong>Raportti 5:</strong><br />
              Tehtävät kyselytyypeittäin, yritysten keskimääräinen lukumäärä sekä keskimäärin käytetty aika.
            </Report><br />
          </Column>
          <Column>
            <h2>Tehtävälistat</h2>
            {this.props.exerciseLists.map((exerciseList) => {
              return (
                <ListItem key={exerciseList.id}>
                  {exerciseList.description}
                  {user && (user.role === 'admin' || user.id === exerciseList.creator) && (
                    <span>
                      <EditLink to={`/exercise-editor/exercise-lists/${exerciseList.id}`}>
                        Muokkaa
                      </EditLink>
                      <DeleteLink onClick={() => this.props.deleteExerciseList(exerciseList.id)}>Poista</DeleteLink>
                    </span>
                  )}
                </ListItem>
              );
            })}
            <br />
            <Report href={getExerciseReport()}>
              <strong>Raportti 4:</strong><br />
              Tehtävät vaikeusjärjestyksessä
            </Report><br />
          </Column>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    exampleAnswers: state.exampleAnswers,
    exerciseLists: state.exerciseLists,
    exerciseList: state.exerciseList,
    exercises: state.exercises,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getExampleAnswers: (exerciseId) => dispatch(getExampleAnswers(exerciseId)),
    getExercises: () => dispatch(getExercises()),
    getExerciseList: (id) => {
      dispatch(getExerciseList(id));
    },
    createExerciseList: (event) => {
      event.preventDefault();
      dispatch(createExerciseList());
    },
    createExercise: (event) => {
      event.preventDefault();
      dispatch(createExercise());
    },
    deleteExercise: (id) => {
      dispatch(deleteExercise(id));
    },
    deleteExerciseList: (id) => {
      dispatch(deleteExerciseList(id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseEditor);
