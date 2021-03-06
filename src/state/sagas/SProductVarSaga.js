import { takeEvery, put, call, select } from "redux-saga/effects";
import axios from "axios";
import { tokenConfig } from "../actions/authActions";
import { tokenAdminConfig } from "../actions/authAdminActions";
import { ADD_NOTIFICATION } from "react-redux-notify";
import { NOTI_SUCCESS, NOTI_APPROVE_SUCCESS } from "./NotificationObject";
import {
  GET_PRODUCTVARS,
  GET_PRODUCTVARS_BY_IDSHOP,
  ADD_PRODUCTVAR,
  PRODUCTVARS_RECEIVED,
  PRODUCTVAR_ADDED,
  DELETE_PRODUCTVAR,
  PRODUCTVAR_DELETED,
  UPDATE_PRODUCTVAR,
  UPDATE_PRODUCTVAR_STATUS,
  PRODUCTVAR_UPDATED,
  GET_PRODUCTVAR_BY_ID,
  PRODUCTVAR_RECEIVED,
  SHOW_NOTI,
} from "../actions/types";

function* fetchProductVarByid(params) {
  try {
    const state = yield select(),
      { id } = params;
    const response = yield call(() =>
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_PRODUCT}/api/productvar/${id}`,
          tokenConfig(state)
        )
        .catch((er) => console.log(er.response))
    );
    console.log(response);
    yield put({ type: PRODUCTVAR_RECEIVED, payload: response });
  } catch (error) {
    console.log(error);
  }
}

function* fetchProductVars(params) {
  try {
    const state = yield select(),
      { query, limit, page, arrayStatus } = params.pages;

    let tempString = "";
    for (let x = 0; x < arrayStatus.length; x++) {
      tempString += `&arrayStatus[]=${arrayStatus[x]}`;
    }

    const response = yield call(() =>
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_PRODUCT}/api/productvar?query=${query}&limit=${limit}&page=${page}` +
            tempString,
          tokenAdminConfig(state)
        )
        .catch((er) => console.log(er.response))
    );

    yield put({ type: PRODUCTVARS_RECEIVED, payload: response });
  } catch (error) {
    console.log(error);
  }
}

function* fetchProductVarsByIdShop(params) {
  try {
    const state = yield select();
    let { limit, page, query, idShop, arrayStatus, type } = params.pages;

    let tempString = "";
    for (let x = 0; x < arrayStatus.length; x++) {
      tempString += `&arrayStatus[]=${arrayStatus[x]}`;
    }

    const response = yield call(() =>
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_PRODUCT}/api/productvar/shop/${idShop}?limit=${limit}&page=${page}&query=${query}` +
            tempString,
          type == "admin" ? tokenAdminConfig(state) : tokenConfig(state)
        )
        .catch((er) => console.log(er.response))
    );

    yield put({ type: PRODUCTVARS_RECEIVED, payload: response });
  } catch (error) {
    console.log(error);
  }
}

function* addProductVar(params) {
  const state = yield select();
  try {
    const response = yield call(() =>
      axios.post(
        `${process.env.REACT_APP_BACKEND_PRODUCT}/api/productvar/`,
        params.newProductVar,
        tokenConfig(state)
      )
    );

    yield put({ type: PRODUCTVAR_ADDED, payload: response.data });
  } catch (error) {
    console.log(error.response);
  }
}

function* updateProductVarStatus(params) {
  const state = yield select(),
    { id } = params.newProductVar;
  console.log(params.newProductVar);

  try {
    const response = yield call(() =>
      axios.put(
        `${process.env.REACT_APP_BACKEND_PRODUCT}/api/productvar/${id}/status`,
        params.newProductVar,
        tokenAdminConfig(state)
      )
    );

    yield put({ type: PRODUCTVAR_UPDATED, payload: response.data });
    yield put({ type: SHOW_NOTI });
    yield put({
      type: ADD_NOTIFICATION,
      notification: NOTI_APPROVE_SUCCESS,
    });
    yield put({
      type: GET_PRODUCTVARS_BY_IDSHOP,
      pages: {
        limit: 10,
        page: 1,
        query: "",
        idShop: params.newProductVar.idShop,
        arrayStatus: ["pending", "declined"],
        type: "admin",
      },
    });
  } catch (error) {
    console.log(error.response);
  }
}

function* updateProductVar(params) {
  const state = yield select();
  try {
    const response = yield call(() =>
      axios.put(
        `${process.env.REACT_APP_BACKEND_PRODUCT}/api/productvar/${params.newProductVar.id}`,
        params.newProductVar,
        tokenConfig(state)
      )
    );
    yield put({ type: PRODUCTVAR_UPDATED, payload: response.data });
  } catch (error) {
    console.log(error.response);
  }
}

function* deleteProductVar(params) {
  const state = yield select();
  try {
    const response = yield call(() =>
      axios.delete(
        `${process.env.REACT_APP_BACKEND_PRODUCT}/api/productvar/${params.id}`,
        tokenConfig(state)
      )
    );

    yield put({ type: PRODUCTVAR_DELETED, payload: response.data });
  } catch (error) {
    console.log(error.response);
  }
}

export default function* sProductVarSaga() {
  yield takeEvery(GET_PRODUCTVAR_BY_ID, fetchProductVarByid);
  yield takeEvery(GET_PRODUCTVARS, fetchProductVars);
  yield takeEvery(GET_PRODUCTVARS_BY_IDSHOP, fetchProductVarsByIdShop);
  yield takeEvery(ADD_PRODUCTVAR, addProductVar);
  yield takeEvery(UPDATE_PRODUCTVAR_STATUS, updateProductVarStatus);
  yield takeEvery(UPDATE_PRODUCTVAR, updateProductVar);
  yield takeEvery(DELETE_PRODUCTVAR, deleteProductVar);
}
