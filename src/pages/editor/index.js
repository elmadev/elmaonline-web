import React from 'react';
import Layout from 'components/Layout';
// import LevelEditorGui from 'level-editor-gui';

class Editor extends React.Component {
  /* componentDidMount() {
    this.editor = new LevelEditorGui({
      element: 'level-editor',
      server: 'https://janka.la:3123',
    });
  }

  componentWillUnmount() {
    this.editor.stopAnimationLoop();
  } */

  render() {
    return (
      <Layout>
        <div
          id="level-editor"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Layout>
    );
  }
}

export default Editor;
