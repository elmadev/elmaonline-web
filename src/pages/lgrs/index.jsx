import Layout from 'components/Layout';
import { Tab, Tabs } from '@material-ui/core';
import { useNavigate, useParams } from '@tanstack/react-router';
import LGRUpload from 'features/LGRUpload';
import styled from '@emotion/styled';
import LGRList from 'features/LGRList';

const LGRs = () => {
  const navigate = useNavigate();
  const { tab } = useParams({ strict: false });

  return (
    <Layout edge t="LGRs">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab || ''}
        onChange={(_e, value) =>
          navigate({ to: ['/lgrs', value].filter(Boolean).join('/') })
        }
      >
        <Tab label="Repository" value="" />
        <Tab label="Upload" value="upload" />
      </Tabs>
      <Container>
        {!tab ? <LGRList /> : null}
        {tab === 'upload' ? <LGRUpload /> : null}
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: 100%;
  box-sizing: border-box;
  font-size: 14px;
`;

export default LGRs;
