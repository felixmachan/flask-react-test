import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = (props) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google token response:", tokenResponse);
      // ide jönne a backend hívás tokenResponse.access_token-nel
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  return (
    <button
      onClick={() => login()}
      className="btn btn-primary w-100 py-2 regist d-flex align-items-center justify-content-center gap-2"
    >
      {/* Google SVG logó */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 533.5 544.3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M533.5 278.4c0-17.4-1.4-34.1-4-50.3H272.1v95.2h146.9c-6.3 34-25.1 62.9-53.5 82.3l86.2 66.8c50.3-46.4 81.8-114.7 81.8-193.9z"
          fill="#4285f4"
        />
        <path
          d="M272.1 544.3c72.8 0 133.9-24.1 178.5-65.3l-86.2-66.8c-24 16.1-54.7 25.5-92.3 25.5-70.9 0-131-47.9-152.4-112.3l-89.7 69.4c43.3 86.2 132.4 149.5 242.1 149.5z"
          fill="#34a853"
        />
        <path
          d="M119.7 325.4c-10.2-30.3-10.2-62.9 0-93.2L30 162.8c-37.7 75.1-37.7 164.2 0 239.3l89.7-69.4z"
          fill="#fbbc04"
        />
        <path
          d="M272.1 107.1c39.5 0 75 13.6 102.8 40.3l77.1-77.1C405.9 24.9 344.9 0 272.1 0 162.4 0 73.3 63.3 30 149.5l89.7 69.4c21.3-64.4 81.5-111.8 152.4-111.8z"
          fill="#ea4335"
        />
      </svg>
      <span>{props.text}</span>
    </button>
  );
};

export default GoogleLoginButton;
