/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import {
  NickRequests,
  NickAccept,
  NickDecline,
  Banlist,
  ErrorLog,
  ActionLog,
} from 'api';

export default {
  nickChanges: '',
  setNickChanges: action((state, payload) => {
    state.nickChanges = payload;
  }),
  getNickChanges: thunk(async actions => {
    const get = await NickRequests();
    if (get.ok) {
      actions.setNickChanges(get.data);
    }
  }),
  acceptNick: thunk(async (actions, payload) => {
    const post = await NickAccept(payload);
    if (post.ok) {
      actions.getNickChanges();
    }
  }),
  declineNick: thunk(async (actions, payload) => {
    const post = await NickDecline(payload);
    if (post.ok) {
      actions.getNickChanges();
    }
  }),
  banlist: { ips: [], flags: [] },
  setBanlist: action((state, payload) => {
    state.banlist = payload;
  }),
  getBanlist: thunk(async actions => {
    const get = await Banlist();
    if (get.ok) {
      actions.setBanlist(get.data);
    }
  }),
  errorLog: [],
  setErrorLog: action((state, payload) => {
    state.errorLog = payload;
  }),
  getErrorLog: thunk(async (actions, payload) => {
    const get = await ErrorLog(payload);
    if (get.ok) {
      actions.setErrorLog(get.data);
    }
  }),
  actionLog: [],
  setActionLog: action((state, payload) => {
    state.actionLog = payload;
  }),
  getActionLog: thunk(async (actions, payload) => {
    const get = await ActionLog(payload);
    if (get.ok) {
      actions.setActionLog(get.data);
    }
  }),
};