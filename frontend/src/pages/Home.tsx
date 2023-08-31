import React, { useEffect, useState } from "react";
import axios from "axios";
import { Props } from "../App";
import * as settings from "../settings";
import { useNavigate } from 'react-router-dom';

const Home: React.FC<Props> = (props) => {

  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  
  const testConnection = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${props.token}`,
        },
      };
      const response = await axios.post(
        settings.API_SERVER + "/api/connection_test/",
        {},
        config
      );
      setApiResponse(JSON.stringify(response.data));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 text-white">
        HOME
        {props.isAuthenticated ? (
          <>
            <button
              onClick={() => props.logout()}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Logout
            </button>
            <button
              onClick={() => navigate('/update_password')}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Update Password
            </button>

            <button
              onClick={testConnection}
              className="flex w-full justify-center rounded-md bg-green-500 mt-4 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              Test API Connection
            </button>
            {apiResponse && <div className="mt-4">{`API Response: ${apiResponse}`}</div>}
          </>
        ) : null}
      </div>
    </>
  );
};

export default Home;
