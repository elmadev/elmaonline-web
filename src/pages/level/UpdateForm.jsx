/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Button, Chip, Box, Typography } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import FormResponse from 'components/FormResponse';
import { xor } from 'lodash';

const UpdateForm = () => {
  const { updateLevelTags, getTagOptions } = useStoreActions(
    store => store.Level,
  );
  const { level, tagOptions } = useStoreState(store => store.Level);

  const [Tags, setTags] = useState(level.Tags?.map(tag => tag.TagIndex) || []);

  const [response, setResponse] = useState({});

  useEffect(() => {
    getTagOptions();
  }, []);

  useEffect(() => {
    if (level?.Tags && !Tags.length) {
      setTags(level.Tags.map(tag => tag.TagIndex));
    }
  }, [level]);

  const { errors, done } = response;

  const submit = e => {
    e.preventDefault();

    setResponse({});

    updateLevelTags({
      LevelIndex: level?.LevelIndex,
      tags: { Tags },
    }).then(errors => {
      setResponse({
        done: true,
        errors: errors,
      });
    });
  };

  return (
    <form onSubmit={submit} style={{ display: 'block', width: '100%' }}>
      <Box padding={2}>
        <Typography color="textSecondary">Tags</Typography>
        {tagOptions.map(option => {
          if (Tags.includes(option.TagIndex)) {
            return (
              <Chip
                key={option.TagIndex}
                label={option.Name}
                onDelete={() => setTags(() => xor(Tags, [option.TagIndex]))}
                color="primary"
                style={{ margin: 4 }}
              />
            );
          } else {
            return (
              <Chip
                key={option.TagIndex}
                label={option.Name}
                onClick={() => setTags(() => xor(Tags, [option.TagIndex]))}
                style={{ margin: 4 }}
              />
            );
          }
        })}
      </Box>

      <Button type="submit" variant="contained" style={{ margin: '10px 0' }}>
        Update
      </Button>
      {done && (
        <>
          <br />
          <br />
          <FormResponse
            msgs={errors?.length ? errors : ['Level tags updated.']}
            isError={errors?.length > 0}
          />
        </>
      )}
    </form>
  );
};

export default UpdateForm;
