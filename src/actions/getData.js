import getDataApi from '../entities/getDataApi';
import * as types from './actionTypes';

export function getData() {
  return dispatch => {
    dispatch(getDataRequest());
    return getDataApi.getAmazonReviews()
    .then(response => {
      if (response.error) {
        dispatch(getDataFailure('Amazon get data failure'));
      } else {
        dispatch(getDataSuccess(response));
      }
    });
  };
}

function getDataRequest() {
  return { type: types.GET_DATA };
}

function getDataSuccess(response) {
  return { type: types.GET_DATA_SUCCESS, response};
}

function getDataFailure(error) {
  return { type: types.GET_DATA_FAILURE, error };
}

