import {
  SHOW_MODAL,
} from './types';

export const showModal = (params) => ({
  type: SHOW_MODAL,
  payload: { show: params.show }
});