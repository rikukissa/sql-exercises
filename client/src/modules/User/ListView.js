import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const UserList = styled.ul`
  padding: 0;
  list-style: none;
`;

class UserListView extends Component {
  render() {
    return (
      <div>
        <h2>Käyttäjät</h2>
        <UserList>
          {this.props.users.map((user) => (
            <li key={user.id}>
              <Link to={`/users/${user.id}`}>
                {user.name}
              </Link>
            </li>
          ))}

        </UserList>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    users: state.users,
    sessions: state.sessions,
    exerciseLists: state.exerciseLists,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListView);
