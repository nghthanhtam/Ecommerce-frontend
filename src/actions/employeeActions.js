import {
  GET_EMPLOYEES,
  ADD_EMPLOYEE,
  DELETE_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from "./types";

// export const getCategories = (show = 5, page = 1, query) => (
//   dispatch,
//   getState
// ) => {
//   let newQuery = "";
//   if (query === "") newQuery = "undefined";
//   else newQuery = query;
//   axios
//     .get(
//       `${process.env.REACT_APP_BACKEND_HOST}/api/category/${show}/${page}/${newQuery}`,
//       tokenConfig(getState)
//     )

//     .then((response) =>
//       dispatch({ type: GET_EMPLOYEES, payload: response.data })
//     )
//     .catch((er) => console.log(er.response));
// };
export const getEmployees = (params) => ({
  type: GET_EMPLOYEES,
  pages: params,
});

export const deleteEmployee = (id) => ({
  type: DELETE_EMPLOYEE,
  id: id,
});
// export const deleteCategory = (id) => (dispatch, getState) => {
//   axios
//     .delete(
//       `${process.env.REACT_APP_BACKEND_HOST}/api/category/${id}`,
//       tokenConfig(getState)
//     )
//     .then((response) => {
//       dispatch({
//         type: DELETE_EMPLOYEE,
//         payload: response.data,
//       });
//     })
//     .catch((er) => console.log(er.response));
// };

// export const addCategory = (newCategory) => (dispatch, getState) => {
//   axios
//     .post(
//       `${process.env.REACT_APP_BACKEND_HOST}/api/category/`,
//       newCategory,
//       tokenConfig(getState)
//     )
//     .then((response) => {
//       if (newCategory._id instanceof mongoose.Types.ObjectId) {
//         newCategory._id = newCategory._id.toString();
//       }

//       dispatch({
//         type: ADD_EMPLOYEE,
//         payload: newCategory,
//       });
//     })
//     .catch((er) => console.log(er.response));
// };

export const addEmployee = (newCategory) => ({
  type: ADD_EMPLOYEE,
  newCategory: newCategory,
});

export const updateEmployee = (newCategory) => ({
  type: UPDATE_EMPLOYEE,
  newCategory: newCategory,
});

// export const updateCategory = (newCategory) => (dispatch, getState) => {
//   axios
//     .put(
//       `${process.env.REACT_APP_BACKEND_HOST}/api/category/${newCategory._id}`,
//       newCategory,
//       tokenConfig(getState)
//     )

//     .then((response) => {
//       dispatch({
//         type: UPDATE_EMPLOYEE,
//         payload: response.data,
//       });
//     })
//     .catch((error) => {
//       console.log(error.response);
//     });
// };
