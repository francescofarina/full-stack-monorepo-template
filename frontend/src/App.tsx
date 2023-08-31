import React from 'react';
import './App.css';
import Urls from './Urls';
import { connect } from 'react-redux';
import * as actions from './store/authActions';
import { AuthState, AuthAction } from './store/authReducer';
import { ThunkDispatch } from 'redux-thunk';

interface OwnProps {
  onAuth?: (username: string, password: string) => void;
  // Any props you want to define that the component specifically needs
}

interface StateProps {
  isAuthenticated: boolean;
  token: string | null;
}

interface DispatchProps {
  setAuthenticatedIfRequired: () => void;
  logout: () => void;
}

export type Props = StateProps & DispatchProps & OwnProps;

const App: React.FC<Props> = (props) => {
  React.useEffect(() => {
    props.setAuthenticatedIfRequired();
  }, []);

  return (
    <div className="App">
      <Urls {...props} />
    </div>
  );
}

const mapStateToProps = (state: { auth: AuthState }): StateProps => {
  return {
    isAuthenticated: state.auth.token !== null && typeof state.auth.token !== 'undefined',
    token: state.auth.token,
  };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AuthAction>): DispatchProps => {
  return {
    setAuthenticatedIfRequired: () => dispatch(actions.authCheckState()),
    logout: () => dispatch(actions.authLogout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);