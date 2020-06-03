import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';



export default function configureStore(sagaMiddleware) {
	return createStore(
		rootReducer,
		{},
    compose(
      applyMiddleware(thunk),
			applyMiddleware(sagaMiddleware),
      // enabling the chrome devTools extension
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
	);
}
