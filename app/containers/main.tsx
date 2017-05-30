import * as React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import * as styles from '../css/main.css';

const App: React.StatelessComponent<{}> = props => {
  // TODO: only show header when logged in
  const header = props.children ? <Header /> : null;
  return (
    <div>
      {header}
      <div className={styles.body}>
        {props.children}
      </div>
      <Footer />
    </div>);
};

export default App;
