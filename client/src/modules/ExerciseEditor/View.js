import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { getExercises, createExerciseList, createExercise } from '../../state';
import Report from '../../components/Report';
import { getExerciseTypeReport, getExerciseReport } from '../../service';

const Container = styled.div`
  display: flex;
`;

const Column = styled.div`
  flex: 0.5;
`;

const Form = styled.form`
  margin-bottom: 2em;
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
  const { exercises, onSubmit, pristine, submitting } = props;
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
        <button type="submit" disabled={pristine || submitting}>Luo tehtävälista</button>
      </div>
    </Form>
  );
};

const ExerciseForm = (props) => {
  const { onSubmit, pristine, submitting } = props;
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
        <button type="submit" disabled={pristine || submitting}>Luo tehtävä</button>
      </div>
    </Form>
  );
};

const CreateExerciseForm = reduxForm({
  form: 'exercise',
})(ExerciseForm);

const CreateExerciseListForm = reduxForm({
  form: 'exerciseList',
})(ExerciseListForm);

class ExerciseEditor extends Component {
  componentDidMount() {
    this.props.getExercises();
  }
  render() {
    return (
      <div>
        <h1>Tehtäväeditori</h1>

        <Container>
          <Column>
            <h3>Luo tehtävä</h3>
            <CreateExerciseForm
              initialValues={{ type: 'easy' }}
              onSubmit={this.props.createExercise}
            />
          </Column>
          <Column>
            <h3>Luo tehtävälista</h3>
            <CreateExerciseListForm
              exercises={this.props.exercises}
              onSubmit={this.props.createExerciseList}
            />
          </Column>
        </Container>
        <hr />
        <Container>
          <Column>
            <h2>Tehtävät</h2>
            {this.props.exercises.map((exercise) => {
              return (
                <div key={exercise.id}>
                  #{exercise.id} {exercise.description}
                </div>
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
                <div key={exerciseList.id}>
                  {exerciseList.description}
                </div>
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
    exerciseLists: state.exerciseLists,
    exercises: state.exercises,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getExercises: () => dispatch(getExercises()),
    createExerciseList: (event) => {
      event.preventDefault();
      dispatch(createExerciseList());
    },
    createExercise: (event) => {
      event.preventDefault();
      dispatch(createExercise());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseEditor);
