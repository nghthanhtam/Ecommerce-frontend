import { takeEvery, put, call, select } from 'redux-saga/effects';
import axios from 'axios';
import { tokenConfig } from '../actions/authActions';
import {
  GET_USERS,
  ADD_USER,
  USERS_RECEIVED,
  USER_RECEIVED,
  USER_ADDED,
  DELETE_USER,
  USER_DELETED,
  UPDATE_USER,
  USER_UPDATED,
  GET_USER_BY_ID,
} from '../actions/types';

function* fetchUsers(params) {
  try {
    const state = yield select(),
      { limit, page, query } = params.pages;

    const response = yield call(() =>
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_USER}/api/user?limit=${limit}&page=${page}&query=${query}`,
          tokenConfig(state)
        )
    );
    yield put({ type: USERS_RECEIVED, payload: response });
  } catch (error) {
    console.log({ ...error });
    let err = { ...error }
    if (err.status == 401) {
      this.props.history.push({
        pathname: '/login',
      });
    }
  }
}

function* fetchUserById(params) {
  try {
    const state = yield select(),
      { id } = params.pages;

    const response = yield call(() =>
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_USER}/api/user/${id}`,
          tokenConfig(state)
        )
    );

    yield put({ type: USER_RECEIVED, payload: response });
  } catch (error) {
    console.log({ ...error });

  }
}

function* addUser(params) {
  const state = yield select();

  try {
    const response = yield call(() =>
      axios.post(
        `${process.env.REACT_APP_BACKEND_USER}/api/user/`,
        params.newUser,
        tokenConfig(state)
      )
    );

    yield put({ type: USER_ADDED, payload: response.data });
    yield put({
      type: GET_USERS,
      pages: params.newUser.pages,
    });
  } catch (error) {
    console.log(error.response);
  }
}

function* updateUser(params) {
  const state = yield select();
  try {
    const response = yield call(() =>
      axios.put(
        `${process.env.REACT_APP_BACKEND_USER}/api/user/${params.newUser.id}`,
        params.newUser,
        tokenConfig(state)
      )
    );

    yield put({ type: USER_UPDATED, payload: response.data });
  } catch (error) {
    console.log(error.response);
  }
}
function* deleteUser(params) {
  const state = yield select();
  try {
    yield call(() =>
      axios.delete(
        `${process.env.REACT_APP_BACKEND_USER}/api/user/${params.id}`,
        tokenConfig(state)
      )
    );

    yield put({ type: USER_DELETED, payload: { id: params.id } });
  } catch (error) {
    console.log(error.response);
  }
}

export default function* sUserSaga() {
  yield takeEvery(GET_USER_BY_ID, fetchUserById);
  yield takeEvery(GET_USERS, fetchUsers);
  yield takeEvery(ADD_USER, addUser);
  yield takeEvery(UPDATE_USER, updateUser);
  yield takeEvery(DELETE_USER, deleteUser);
}