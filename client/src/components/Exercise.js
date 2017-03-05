import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/mode/sql/sql';
import styled from 'styled-components';

import Button from './Button';

const SubmitButton = styled(Button)`
  display: block;
  width: 100%;
  margin-top: 1em;
`;

const Description = styled.p``;

export default class Exercise extends Component {
  state = {
    code: '',
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
        <Description>{this.props.exercise.description}</Description>
        <CodeMirror value={this.state.code} onChange={this.updateCode} options={{ theme: 'blackboard', mode: 'sql' }} />
        <SubmitButton onClick={this.submit}>Lähetä</SubmitButton>
      </div>
    );
  }
}
