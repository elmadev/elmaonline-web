import React, { useEffect, useState } from 'react';
import LocalTime from 'components/LocalTime';
import styled from 'styled-components';
import { Card, CardContent } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListRow, ListCell, ListContainer } from 'components/List';
import { Parser } from 'react-tiny-bbcode';
import Header from 'components/Header';

const News = ({ amount }) => {
  const [open, setOpen] = useState(0);
  const { news } = useStoreState(state => state.News);
  const { getNews } = useStoreActions(actions => actions.News);
  useEffect(() => {
    getNews(amount);
  }, []);

  const openNews = index => {
    if (index === open) {
      setOpen(0);
    } else {
      setOpen(index);
    }
  };

  return (
    <Card>
      <CardContent>
        <Header h2>News</Header>
        <ListContainer>
          {news.map(n => (
            <ListRow key={n.NewsIndex} onClick={() => openNews(n.NewsIndex)}>
              <ListCell>
                <Headline selected={open === n.NewsIndex}>
                  {n.Headline}{' '}
                  <Written>
                    <LocalTime
                      date={n.Written}
                      format="ddd D MMM YYYY"
                      parse="X"
                    />
                  </Written>
                </Headline>
                {open === n.NewsIndex && (
                  <div>
                    <Parser bbcode={n.News} />
                  </div>
                )}
              </ListCell>
            </ListRow>
          ))}
        </ListContainer>
      </CardContent>
    </Card>
  );
};

const Headline = styled.div`
  font-weight: ${p => (p.selected ? 'bold' : 'normal')};
`;

const Written = styled.span`
  color: gray;
`;

export default News;
