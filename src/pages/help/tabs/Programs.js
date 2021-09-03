import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';
import { ListCell, ListContainer, ListRow, ListHeader } from 'components/List';
import * as sections from './programs.json';

const Programs = () => {
  return (
    <div>
      <Text>
        <Header h2>Programs</Header>
        This is a list of community made programs and tools. If anything is
        missing make a pull request to{' '}
        <a href="https://github.com/elmadev/elmaonline-web/blob/changelog/src/pages/help/tabs/programs.json">
          this file
        </a>{' '}
        or make a{' '}
        <a href="https://github.com/elmadev/elmaonline-site/issues/479">
          comment here
        </a>
        .
        {sections.default.map(section => (
          <>
            <Header h2 top={10}>
              {section.name}
            </Header>
            <ListContainer>
              <ListHeader>
                <ListCell width={250}>Name/Download</ListCell>
                <ListCell>Description</ListCell>
              </ListHeader>
              {section.items.map(item => (
                <ListRow>
                  {Array.isArray(item.l) ? (
                    <ListCell>
                      {item.n}{' '}
                      {item.l.map(l => (
                        <>
                          <a href={l.l}>{l.t}</a>{' '}
                        </>
                      ))}
                    </ListCell>
                  ) : (
                    <ListCell to={item.l} width={250}>
                      {item.n}
                    </ListCell>
                  )}
                  <ListCell>{item.d}</ListCell>
                </ListRow>
              ))}
            </ListContainer>
          </>
        ))}
      </Text>
    </div>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

export default Programs;
