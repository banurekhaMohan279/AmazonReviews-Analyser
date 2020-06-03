import * as types from '../actions/actionTypes';
import { assign } from 'lodash';

const initialState = {
  isReceivingData: false,
  isReceivedData: false,
  apiData:[],
  error: null
};

function getDataReducer(state = initialState, action) {
  console.log("action",action)
  switch(action.type) {
    case types.GET_DATA:
      return assign({}, state, {
        isReceivedData: false,
        isReceivingData: true,
        error: null
      });
    case types.GET_DATA_SUCCESS:
      return assign({}, state, {
        isReceivedData: true,
        isReceivingData: false,
        apiData:action.response.resources,
        error: null
      });
    case types.GET_DATA_FAILURE:
      return assign({}, state, {
        isReceivedData: false,
        isReceivingData: false,
        error: action.error
      });

    default:
      return state;
  }
 // console.log("state",state)
}

export default getDataReducer;
