import { CreateUser } from "../component/CreateUser";
import { Login } from "../component/login";
import { useState } from "react";
import "./Landing.css";

export function Landing() {
  const [view, setView] = useState(0);
  //view == 0 : login
  //view == 1 : create user
  
  return (
    <div className="landing">
      <h1>Welcome to Toilet War</h1>
      <p className="app-desc">
        Track and visualize marital tensions arising from bathroom usage habits.
      </p>
      
      <div className="auth-container">
        {!view ? (
          <>
            <Login />
            <button className="toggle-button" onClick={() => setView(!view)}>
              Create new account
            </button>
          </>
        ) : (
          <>
            <CreateUser />
            <button className="toggle-button" onClick={() => setView(!view)}>
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}