import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/theme/blackboard.css';
import styled from 'styled-components';

import Button from './Button';

const SubmitButton = styled(Button)`
  display: block;
  width: 100%;
  margin-top: 1em;
  transition: background-color 300ms;
  ${({ incorrect }) => incorrect ? 'background-color: #ea5250;' : ''};
  ${({ disabled }) => disabled ?
   `opacity: 0.5;
    cursor: not-allowed;
    ` : ''};
`;

const Description = styled.p`
  color: #ffffff;
  margin-bottom: 0;
  background: #3bbf9d;
  padding: 1em;
`;

const Task = styled.strong`
  font-size: 14px;
  font-weight: 700;
`;

export default class Exercise extends Component {
  state = {
    code: '',
    incorrect: false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.incorrect) {
      this.setState({ incorrect: true });
      setTimeout(() => {
        this.setState({ incorrect: false });
      }, 3000);
    }

    if (nextProps.exercise.id !== this.props.exercise.id) {
      this.setState({ code: '' });
    }
  }
  updateCode = (code) => {
    this.setState({ code });
  }
  submit = () => {
    this.props.onSubmit(this.state.code);
  }
  render() {
    return (
      <div>
        <Description>
          <Task>Tehtävä:</Task><br />
          {this.props.exercise.description}
        </Description>
        <CodeMirror value={this.state.code} onChange={this.updateCode} options={{ theme: 'blackboard', mode: 'text/x-pgsql' }} />
        <SubmitButton disabled={this.state.code === ''} incorrect={this.state.incorrect} onClick={this.submit}>
          {this.state.incorrect ? 'Väärä vastaus' : 'Lähetä vastaus'}
        </SubmitButton>
      </div>
    );
  }
}
