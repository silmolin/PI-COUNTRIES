import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/index';

const store = createStore(
    rootReducer, // recibo el reducer
    composeWithDevTools(applyMiddleware(thunk)) 
);

export default store;