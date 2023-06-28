import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Header from 'components/Header';
import { Row, Text } from 'components/Containers';
import styled from 'styled-components';
import { Grid, Tooltip } from '@material-ui/core';
import { Paper } from 'components/Paper';
import Button from 'components/Buttons';
import queryString from 'query-string';
import { useLocation } from '@reach/router';
import FieldBoolean from 'components/FieldBoolean';

const Notifications = () => {
  const { url, notifSettings, userInfo } = useStoreState(
    state => state.Settings,
  );
  const {
    getUrl,
    sendCode,
    getSettings,
    removeDiscord,
    changeNotifSetting,
  } = useStoreActions(actions => actions.Settings);
  const location = useLocation();
  const { code } = queryString.parse(location.search);

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    if (url) {
      window.location.href = url;
    }
  }, [url]);

  useEffect(() => {
    if (code) {
      sendCode(code);
    }
  }, [code]);

  const authDiscord = () => {
    getUrl(location.origin);
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}>
        <Paper padding width="auto">
          <Header h2>Where to send notifications</Header>
          <Text>
            By default you will get notifications via the website. If you want
            to get it through other means select the options below. If there are
            no options, make sure you have set an email and/or connected your
            Discord account.
          </Text>
          {notifSettings && (
            <>
              {notifSettings.DiscordId !== 0 && (
                <FieldBoolean
                  value={notifSettings.SendDiscord}
                  label="Discord PM"
                  onChange={() =>
                    changeNotifSetting({
                      Setting: 'SendDiscord',
                      Value: 1 - notifSettings.SendDiscord,
                    })
                  }
                />
              )}
            </>
          )}
          {userInfo?.Email && (
            <FieldBoolean
              value={notifSettings ? notifSettings.SendEmail : 0}
              label="Email"
              onChange={() =>
                changeNotifSetting({
                  Setting: 'SendEmail',
                  Value: notifSettings ? 1 - notifSettings.SendEmail : 1,
                })
              }
            />
          )}
        </Paper>
        <Paper top padding width="auto">
          <Header h2>Which notifications to get</Header>
          <FieldBoolean
            value={notifSettings ? notifSettings.Comment : 1}
            label="Replay comment"
            onChange={() =>
              changeNotifSetting({
                Setting: 'Comment',
                Value: notifSettings ? 1 - notifSettings.Comment : 0,
              })
            }
          />
          <FieldBoolean
            value={notifSettings ? notifSettings.Beaten : 1}
            label="Record beaten"
            onChange={() =>
              changeNotifSetting({
                Setting: 'Beaten',
                Value: notifSettings ? 1 - notifSettings.Beaten : 0,
              })
            }
          />
          <FieldBoolean
            value={notifSettings ? notifSettings.Besttime : 1}
            label="New record in favourited levelpack"
            onChange={() =>
              changeNotifSetting({
                Setting: 'Besttime',
                Value: notifSettings ? 1 - notifSettings.Besttime : 0,
              })
            }
          />
          <FieldBoolean
            value={notifSettings ? notifSettings.News : 1}
            label="News"
            onChange={() =>
              changeNotifSetting({
                Setting: 'News',
                Value: notifSettings ? 1 - notifSettings.News : 0,
              })
            }
          />
        </Paper>
      </Grid>
      <Grid item sm={6} xs={12}>
        <Paper padding width="auto">
          <Header h2>Connect Discord account</Header>
          {notifSettings?.DiscordId ? (
            <>
              <Row>
                <Avatar src={notifSettings.DiscordUrl} alt="Discord avatar" />
                <Header mLeft top h3>
                  {notifSettings.DiscordTag}
                </Header>
              </Row>
              <Text t="Medium">
                Your Discord account is connected to Elma Online. You can get
                notifications as private messages from the @ElmaOnline Discord
                bot. Elma Online has access to the username and avatar shown
                above.
              </Text>
              <Row>
                <Button naked right onClick={() => removeDiscord()}>
                  Remove account
                </Button>
                <Button naked onClick={() => authDiscord()}>
                  Update or connect different account
                </Button>
              </Row>
            </>
          ) : (
            <>
              <Text t="Medium">
                If you connect your discord account you can get notifications as
                private messages from the @ElmaOnline Discord bot. By logging in
                to Discord Elma Online gets access to your Discord username and
                avatar.
              </Text>
              <Row>
                <Button onClick={() => authDiscord()}>Log in to discord</Button>
              </Row>
            </>
          )}
        </Paper>
        <Paper top padding width="auto">
          <Header h2>Battle Notifier</Header>
          {notifSettings?.DiscordId ? (
            <Text t="Medium">
              To manage your battle notifications, go to Discord Elma Online and
              write <CopyToClipboard text="!bn" /> in any channel.
            </Text>
          ) : (
            <Text t="Medium">
              You can get notifications as PMs from the @ElmaOnline Discord bot
              when a battle is started.
              <ol>
                <li>Join Discord Elma Online.</li>
                <li>
                  In this page, click{' '}
                  <Button little naked onClick={() => authDiscord()}>
                    Log in to discord
                  </Button>{' '}
                  to connect your Discord account.
                </li>
                <li>
                  Finally, go back to Discord Elma Online and write{' '}
                  <CopyToClipboard text="!bn" /> in any channel.
                  <br /> You will get a PM from the bot with the instructions to
                  get started.
                </li>
              </ol>
            </Text>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

const CopyToClipboard = ({ text }) => {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Tooltip title="Copy to clipboard" placement="top" arrow>
      <span>
        <Button little naked onClick={copy}>
          {copied ? 'Copied!' : text}
        </Button>
      </span>
    </Tooltip>
  );
};

const Avatar = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 30px;
`;

export default Notifications;
