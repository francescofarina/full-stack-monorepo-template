import React, { useState } from "react";
import axios from "axios";
import * as settings from "../settings";
import { Props as AppProps } from "../App";

import { connect, ConnectedProps } from 'react-redux';
import * as actions from '../store/authActions';
import { AnyAction } from 'redux';
import { ThunkDispatch } from "redux-thunk";

// Redux Mapping
const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return {
        onUpdatePassword: (newPassword1: string, newPassword2: string, token: string) => dispatch(actions.updatePassword(newPassword1, newPassword2, token))
    };
};

const connector = connect(null, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>;

type Props = AppProps & ReduxProps;

const PasswordUpdate: React.FC<Props> = (props) => {
  const [newPassword1, setNewPassword1] = useState<string | null>(null);
  const [newPassword2, setNewPassword2] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFormFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSuccess(false);
    switch (event.target.id) {
      case "new_password1":
        setNewPassword1(event.target.value);
        break;
      case "new_password2":
        setNewPassword2(event.target.value);
        break;
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword1 !== newPassword2) {
        alert("Passwords don't match");
    } else {
        //@ts-ignore
        props.onUpdatePassword(newPassword1, newPassword2, props.token);
    }
};

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Update Your Password
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {success && (
              <p className="text-green-500 mb-4">Password update successful!</p>
            )}
            <div>
              <label
                htmlFor="new_password1"
                className="block text-sm font-medium leading-6 text-white"
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  id="new_password1"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={handleFormFieldChange}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="new_password2"
                className="block text-sm font-medium leading-6 text-white"
              >
                Confirm New Password
              </label>
              <div className="mt-2">
                <input
                  id="new_password2"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={handleFormFieldChange}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default connector(PasswordUpdate);
