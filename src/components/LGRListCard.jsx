import React, { useState } from 'react';
import styled from '@emotion/styled';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import config from 'config';
import { formatDistanceStrict } from 'date-fns';
import Tags from 'components/Tags';

const LGRListCard = ({ lgr }) => {
  const [raised, setRaised] = useState(false);

  return (
    <Link href={`l/${lgr.LGRName}`} underline="none">
      <LGRCard
        raised={raised}
        onMouseOver={() => setRaised(true)}
        onMouseLeave={() => setRaised(false)}
      >
        <CardHeader
          title={lgr.LGRName}
          subheader={formatDistanceStrict(lgr.Added * 1000, Date.now(), {
            addSuffix: true,
          })}
          action={
            <a href={`${config.api}lgr/get/${lgr.LGRName}`}>
              <IconButton aria-label="Download LGR">
                <GetAppIcon />
              </IconButton>
            </a>
          }
        />
        <LGRPreviewCard>
          <LGRPreviewImg src={`${config.api}lgr/preview/${lgr.LGRName}`} />
          <DownloadsContainer>{lgr.Downloads}</DownloadsContainer>
        </LGRPreviewCard>
        <CardContent>
          <TagsContainer>
            <Tags tags={lgr.Tags.map(tag => tag.Name)} />
          </TagsContainer>
        </CardContent>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {lgr.LGRDesc}
          </Typography>
        </CardContent>
      </LGRCard>
    </Link>
  );
};

const LGRCard = styled(Card)`
  :hover {
    cursor: pointer;
  }
`;

const LGRPreviewCard = styled(CardMedia)`
  background-size: contain;
  position: relative;
`;

const LGRPreviewImg = styled.img`
  background-size: contain;
  height: 160px;
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const DownloadsContainer = styled.span`
  background: #fff;
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 2px 3px;
  background: yellow;
  color: #222;
`;

const TagsContainer = styled.span`
  float: right;
`;

export default LGRListCard;
