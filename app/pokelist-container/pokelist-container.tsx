import React from 'react';
import { Link } from 'react-router-dom';

const PokeList: React.StatelessComponent<{}> = props => {
  return (
    <ul>
      <li>
        <Link to="/pokemon/1">1</Link>
      </li>
      <li>
        <Link to="/pokemon/2">2</Link>
      </li>
      <li>
        <Link to="/pokemon/3">3</Link>
      </li>
    </ul>
  );
};

export default PokeList;
