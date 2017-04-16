import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getUsersReport } from '../../service';
import Report from '../../components/Report';

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
        <p>
          <Report href={getUsersReport()}>
            <strong>Raportti 6:</strong> Opiskelijoiden onnistuminen tehtävissä pääaineittain
          </Report><br />
          Onnistuneiden tehtävien lukumäärä jaettuna pääainetta opiskelevien rekisteröityneiden käyttäjien määrällä.
          <br />
          Vertailussa ei oteta huomioon onnistuneeseen suoritukseen johtaneiden yritysten lukumäärää,
          sillä käyttäjillä ei aina ole mahdollisuutta testata kyselyjä omassa ympäristössään ennen vastauksen lähettämistä.
          <br />
          Myös ajatus- ja kirjoitusvirheet ovat melko yleisiä, eikä niiden tulisi vaikuttaa onnistumisen mittaamiseen.
        </p>
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
