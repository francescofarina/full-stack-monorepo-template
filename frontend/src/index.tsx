import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import {
  combineReducers,
  createStore,
  compose,
  applyMiddleware,
  Store,
} from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import authReducer, { AuthState } from "./store/authReducer";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const reducer = combineReducers({ auth: authReducer }); // Using Combine Reducers here although only one reducer is present.
// Official explaination here: https://react-redux.js.org/using-react-redux/connect-mapstate#mapstatetoprops-will-not-run-if-the-store-state-is-the-same
const composeEnhanced = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // The first one is to make the chrome dev extension work
const store: Store<{ auth: AuthState }, any> & { dispatch: unknown } =
  createStore(reducer, composeEnhanced(applyMiddleware(thunk))); // We are using thunk, because it allows delaying the dispatch actions
// Thunk wraps the dispatch actions into custom functions which are available with the mapDispatchToProps


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
