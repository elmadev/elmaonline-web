import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'components/Layout';

class ErrorPage extends React.Component {
  static propTypes = {
    error: PropTypes.shape({
      name: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      stack: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    error: null,
  };

  render() {
    const { error } = this.props;
    // eslint-disable-next-line no-undef
    if (__DEV__ && error) {
      return (
        <div>
          <h1>{error.name}</h1>
          <pre>{error.stack}</pre>
        </div>
      );
    }

    return (
      <Layout t="Error">
        <h1>Error</h1>
        <p>Sorry, a critical error occurred on this page.</p>
      </Layout>
    );
  }
}

export { ErrorPage as ErrorPageWithoutStyle };
export default ErrorPage;
