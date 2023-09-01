import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as settings from "../settings";
import { UserProfile } from "../types/profiles";
import axios from "axios";

const HomePage: React.FC = () => {
  const context = useContext(AuthContext);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (context) {
      getProfile();
    }
  }, [context]);

  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const testConnection = async () => {
    const { authTokens } = context!;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${String(authTokens?.access)}`,
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

  const getProfile = async () => {
    const { authTokens, logoutUser } = context!;

    try {
      const response = await axios.get(`${settings.API_SERVER}/api/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${String(authTokens?.access)}`,
        },
      });

      if (response.status === 200) {
        setProfile(response.data);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.statusText === "Unauthorized") {
          logoutUser();
        }
      } else {
        console.log("An unknown error occurred: ", error);
      }
    }
  };

  if (!context) {
    return <div>Error: Context not provided</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  // return (
  //   <div>
  //     <p>You are logged in to the homepage!</p>
  //     <p>
  //       Name: {profile.first_name} {profile.last_name}
  //     </p>
  //     <p>Email: {profile.email}</p>
  //   </div>
  // );


  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 text-white">
        {profile ? (
          <>
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

export default HomePage;
