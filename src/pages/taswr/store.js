import { action, thunk } from 'easy-peasy';
import { UploadTasWr, GetTasWrs } from 'api';

export default {
  tableData: [],
  error: '',
  uploaded: false,
  setTableData: action((state, payload) => {
    state.tableData = payload;
  }),
  setUploaded: action((state, payload) => {
    state.uploaded = payload;
  }),
  setError: action((state, payload) => {
    state.error = payload;
  }),
  uploadTasWr: thunk(async (actions, payload) => {
    const response = await UploadTasWr(payload);
    if (response.ok) {
      actions.setUploaded(true);
      return;
    }
    actions.setError(response.data.error);
  }),
  getTasWrs: thunk(async (actions, payload) => {
    const tableData = await GetTasWrs(payload.tableOption);
    if (tableData.ok) {
      actions.setTableData(tableData.data);
      return;
    }
  }),
  cleanup: action(state => {
    state.uploaded = false;
    state.error = '';
    state.tableData = {};
  }),
};
