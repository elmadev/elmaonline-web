import React, { useEffect } from 'react';
import Layout from 'components/Layout';
import { useNavigate } from '@reach/router';

const CupReplays = ({ ReplayIndex, Filename }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/r/c-${ReplayIndex}/${Filename}`);
  }, []);

  return <Layout edge t={`Cup rec - ${Filename}.rec`} />;
};

export default CupReplays;
