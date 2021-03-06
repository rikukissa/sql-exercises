import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/theme/blackboard.css';
import styled from 'styled-components';
import { keys } from 'lodash';
import Button from './Button';

const ExerciseContainer = styled.div`
  margin-top: 1em;
`;

const SubmitButton = styled(Button)`
  display: block;
  width: 100%;
  margin-top: 1em;
  ${({ disabled }) => disabled ? `opacity: 0.5;
    cursor: not-allowed;
    ` : ''};
`;

const Description = styled.div`
  transition: background-color 300ms;
  background: #3bbf9d;
  ${({ error }) => error ? 'background-color: #ea5250;' : ''};
  color: #ffffff;
  margin-bottom: 0;
  padding: 1em;
`;

const Task = styled.strong`
  font-size: 14px;
  font-weight: 700;
`;

const Results = styled.div`
`;

const ResultsHeader = styled.h3`
`;

const ResultsTable = styled.table`
  width: 100%;
  margin-bottom: 2em;
`;

const TableRow = styled.tr`
  text-align: left;
  &:nth-child(odd) {
    background: #efefef;
  }
`;
const TableHeader = styled.th`
  text-align: left;
`;

const MESSAGES = {
  incorrect: () => 'Väärä vastaus',
  unexpected: () => 'Jotain meni pieleen',
  sql: (message) => (
    <div>
      <strong>
        Tietokanta palautti virheen:
      </strong>
      <br />
      {message}
    </div>
  ),
  syntax: () =>
    'Kyselyn tulee päättyä puolipisteeseen ja siinä tulee olla parillinen määrä sulkuja',
  'tries exceeded': () => 'Yritysten maksimimäärä ylitetty',
};

export default class Exercise extends Component {
  state = {
    code: '',
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.exercise.id !== this.props.exercise.id) {
      this.setState({ code: '' });
    }
  }
  updateCode = (code) => {
    this.setState({ code });
  };
  submit = () => {
    this.props.onSubmit(this.state.code.trim());
  };
  render() {
    const { error } = this.props;

    return (
      <ExerciseContainer>
        <Description>
          <Task>Tehtävä:</Task><br />
          {this.props.exercise.description}
        </Description>
        {error &&
          <Description error>
            {MESSAGES[error.type](error.error)}
          </Description>}
        <CodeMirror
          value={this.state.code}
          onChange={this.updateCode}
          options={{ theme: 'blackboard', mode: 'text/x-pgsql' }}
        />
        {this.props.result.length > 0 &&
          <Results>
            <ResultsHeader>Kyselyn tulos:</ResultsHeader>
            <ResultsTable>
              <thead>
                <tr>
                  {keys(this.props.result[0]).map((key) => (
                    <TableHeader key={key}>{key}</TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.props.result.map((row, i) => (
                  <TableRow key={i}>
                    {keys(row).map((key) => <td key={key}>{row[key]}</td>)}
                  </TableRow>
                ))}
              </tbody>
            </ResultsTable>
          </Results>}
        {!this.props.correct &&
          <SubmitButton
            disabled={this.props.disabled || this.state.code === ''}
            onClick={this.submit}
          >
            Lähetä vastaus
          </SubmitButton>}
      </ExerciseContainer>
    );
  }
}
