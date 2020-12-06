import {
  GET_RATINGS,
  ADD_RATING,
  RATING_DELETED,
  RATINGS_RECEIVED,
  RATING_ADDED,
  RATING_UPDATED,
} from '../actions/types';

const initialState = {
  ratings: [],
  totalDocuments: 0,
  isLoaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_RATINGS:
      return {
        ...state,
        //isLoaded: true,
      };
    case RATINGS_RECEIVED:
      return {
        ...state,
        ratings: action.payload.data.items,
        totalDocuments: action.payload.data.total,
        isLoaded: true,
      };
    case ADD_RATING:
      return {
        ...state,
        isLoaded: false,
      };
    case RATING_ADDED:
      return {
        ...state,
        isLoaded: true,
      };
    case RATING_DELETED:
      return {
        ...state,
        ratings: state.ratings.filter(
          (rating) => rating.id !== action.payload.id
        ),
      };

    case RATING_UPDATED:
      return {
        ...state,
      };

    default:
      return state;
  }
}
