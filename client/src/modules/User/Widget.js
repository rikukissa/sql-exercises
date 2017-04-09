import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { showLogin, logout } from '../../state';

const LoginLink = styled.button`
  font-size: 14px;
  border: 0;
  background: none;
  color: #349ad0;
`;

const LogoutLink = styled(LoginLink)`
  font-size: 12px;
`;

class UserWidget extends Component {
  render() {
    return (
      <div className={this.props.className}>
        {this.props.user ? (
          <div>
            {this.props.user.name}
            <LogoutLink onClick={this.props.logout}>
              (Kirjaudu ulos)
            </LogoutLink>
          </div>
        ) : (
          <LoginLink onClick={this.props.login}>Kirjaudu sisään</LoginLink>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
    login: () => dispatch(showLogin()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserWidget);
