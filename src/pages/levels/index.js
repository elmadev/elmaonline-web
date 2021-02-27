import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import Link from 'components/Link';
import { useNavigate } from '@reach/router';
import Layout from 'components/Layout';
import { Star, StarBorder } from '@material-ui/icons';

const promote = 'Int';

const Levels = () => {
  const navigate = useNavigate();
  const [packs, setPacks] = useState([]);
  const { levelpacks, favs } = useStoreState(state => state.Levels);
  const { loggedIn } = useStoreState(state => state.Login);
  const { getLevelpacks, addFav, removeFav, getFavs } = useStoreActions(
    actions => actions.Levels,
  );

  useEffect(() => {
    getLevelpacks();
    if (loggedIn) {
      getFavs();
    }
  }, []);

  useEffect(() => {
    if (levelpacks.length > 0) {
      if (loggedIn) {
        setPacks(
          levelpacks.map(lp => {
            if (loggedIn) {
              if (
                favs.findIndex(f => f.LevelPackIndex === lp.LevelPackIndex) > -1
              ) {
                return { ...lp, Fav: true };
              }
            }
            return { ...lp, Fav: false };
          }),
        );
      } else {
        setPacks(levelpacks);
      }
    }
  }, [favs, levelpacks]);

  return (
    <Layout edge t="Levels">
      <Container>
        {packs.length > 0 &&
          packs
            .sort((a, b) => {
              if (a.LevelPackName === promote) return -1;
              if (b.LevelPackName === promote) return 1;
              if (a.Fav !== b.Fav) {
                if (a.Fav) return -1;
                if (b.Fav) return 1;
              }
              return a.LevelPackName.toLowerCase().localeCompare(
                b.LevelPackName.toLowerCase(),
              );
            })
            .map(p => (
              <LevelPackContainer
                promote={p.LevelPackName === promote}
                key={p.LevelPackIndex}
              >
                <Link to={`/levels/packs/${p.LevelPackName}`}>
                  <ShortName>{p.LevelPackName}</ShortName>
                  <LongName>{p.LevelPackLongName}</LongName>
                </Link>
                {loggedIn && (
                  <>
                    {p.Fav ? (
                      <StarCon
                        title="Remove favourite"
                        selected
                        onClick={() =>
                          removeFav({ LevelPackIndex: p.LevelPackIndex })
                        }
                      >
                        <Star />
                      </StarCon>
                    ) : (
                      <StarCon
                        title="Add as favourite"
                        onClick={() =>
                          addFav({ LevelPackIndex: p.LevelPackIndex })
                        }
                      >
                        <StarBorder />
                      </StarCon>
                    )}
                  </>
                )}
              </LevelPackContainer>
            ))}
        <FabCon>
          <Fab
            color="primary"
            aria-label="Add"
            onClick={() => navigate(`/levels/add`)}
          >
            <AddIcon />
          </Fab>
        </FabCon>
      </Container>
    </Layout>
  );
};

const StarCon = styled.span`
  cursor: pointer;
  position: absolute;
  top: 4px;
  right: 4px;
  svg {
    color: ${p => (p.selected ? '#e4bb24' : '#e6e6e6')};
    &:hover {
      color: ${p => (p.selected ? '#e6e6e6' : '#e4bb24')};
    }
  }
`;

const FabCon = styled.div`
  position: fixed;
  right: 30px;
  bottom: 30px;
`;

const Container = styled.div`
  padding-bottom: 50px;
  overflow: hidden;
`;

const LevelPackContainer = styled.div`
  float: left;
  width: ${p => (p.promote ? '40%' : '20%')};
  height: ${p => (p.promote ? '200px' : '100px')};
  padding-left: 1px;
  padding-top: 1px;
  box-sizing: border-box;
  position: relative;
  > a {
    display: block;
    background: #fff;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    color: inherit;
    overflow: hidden;
    position: relative;
    :hover {
      background: #f9f9f9;
    }
  }
  @media (max-width: 1350px) {
    width: ${p => (p.promote ? '50%' : '25%')};
  }
  @media (max-width: 1160px) {
    width: calc(100% / 3);
  }
  @media (max-width: 730px) {
    width: 50%;
  }
  @media (max-width: 480px) {
    width: 100%;
    height: unset;
  }
`;

const ShortName = styled.div`
  font-weight: 500;
  color: #219653;
`;

const LongName = styled.div`
  font-size: 13px;
`;

export default Levels;
