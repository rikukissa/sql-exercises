import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Modal from 'react-modal';
import Button from '../../components/Button';
import { login } from '../../state';

const LoginButton = styled(Button)`
  width: 100%;
`;

const LoginFailed = styled.p`
  color: red
`;

const Title = styled.h2`
  margin-top: 0;
`;

const TextInput = styled.input`
  height: 40px;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0 1em;
`;

const InputContainer = styled.div`
  margin-bottom: 1em;
  margin-top: 3px;
`;

class LoginModal extends Component {
  state = {
    studentNumber: '',
  };
  storeStudentNumber = (event) => {
    const studentNumber = event.target.value;
    this.setState((state) => ({
      ...state,
      studentNumber,
    }));
  };
  login = () => {
    this.props.login(this.state.studentNumber);
  };
  render() {
    return (
      <Modal isOpen={this.props.visible} contentLabel="Modal">
        <Title>Kirjaudu sisään</Title>
        <label htmlFor="student-number">Opiskelijanumero:</label>
        <InputContainer>
          <TextInput id="student-number" onChange={this.storeStudentNumber} type="text" />
        </InputContainer>
        {this.props.failed && <LoginFailed>Kirjautuminen epäonnistui</LoginFailed>}
        <LoginButton onClick={this.login}>Kirjaudu sisään</LoginButton>
      </Modal>
    );
  }
}

function mapStateToProps({ loggingIn, loginFailed }) {
  return {
    visible: loggingIn,
    failed: loginFailed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (studentNumber) => dispatch(login(studentNumber)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
