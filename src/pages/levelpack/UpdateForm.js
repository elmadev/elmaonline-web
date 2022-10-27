/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import FormResponse from 'components/FormResponse';
import Field from 'components/Field';

// form to update level pack long name, desc.
const UpdateForm = () => {
  const { updateLevelPack } = useStoreActions(store => store.LevelPack);
  const { levelPackInfo } = useStoreState(store => store.LevelPack);

  const [LevelPackLongName, setLongName] = useState(
    levelPackInfo.LevelPackLongName,
  );

  const [LevelPackDesc, setDesc] = useState(levelPackInfo.LevelPackDesc);

  const [response, setResponse] = useState({});

  useEffect(() => {
    if (levelPackInfo?.LevelPackLongName && !LevelPackLongName) {
      setLongName(levelPackInfo.LevelPackLongName);
    }
    if (levelPackInfo?.LevelPackDesc && !LevelPackDesc) {
      setDesc(levelPackInfo.LevelPackDesc);
    }
  }, [levelPackInfo]);

  const { errors, done } = response;

  const submit = e => {
    e.preventDefault();

    setResponse({});

    updateLevelPack({
      LevelPackIndex: levelPackInfo.LevelPackIndex,
      LevelPackLongName,
      LevelPackDesc,
    }).then(errors => {
      setResponse({
        done: true,
        errors: errors,
      });
    });
  };

  return (
    <form onSubmit={submit} style={{ display: 'block', width: '100%' }}>
      <Field
        label="Level pack long name"
        value={LevelPackLongName}
        onChange={e => setLongName(e.target.value)}
      />
      <Field
        label="Level pack description"
        value={LevelPackDesc}
        onChange={e => setDesc(e.target.value)}
      />
      <Button type="submit" variant="contained" style={{ margin: '10px 0' }}>
        Update
      </Button>
      {done && (
        <>
          <br />
          <br />
          <FormResponse
            msgs={errors.length ? errors : ['Level Pack Updated.']}
            isError={errors.length > 0}
          />
        </>
      )}
    </form>
  );
};

export default UpdateForm;
