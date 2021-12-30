import React from "react";
import ReactDOM from "react-dom";
import App from './App';
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import tachyons from 'tachyons';
import { imageSearch, FaceBox } from './redux/reducers';
import "./styles.css";

const rootReducer = combineReducers({ imageSearch, FaceBox });

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

const rootElement = document.getElementById("root");

ReactDOM.render(
              <Provider store={store}>
                <App />
              </Provider>, rootElement)
