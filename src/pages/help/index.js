import React from 'react';
import Header from 'components/Header';
import Welcome from 'components/Welcome';
import Layout from 'components/Layout';

class Help extends React.Component {
  render() {
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Header>Help</Header>
          <Welcome />
        </div>
      </Layout>
    );
  }
}

export default Help;
