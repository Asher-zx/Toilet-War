import { CreateUser } from "../component/CreateUser";
import { Login } from "../component/login";
import { useState } from "react";

export function Landing() {

  const [view, setView] = useState(0)
  //view == 0 : login
  //view == 1 : create user
  //view == 2 : forgot password 

  return (
    <div className="landing">
      {!view ? 
      <>
        <Login/>
        <button onClick={() => setView(!view)}>Create new account</button>
      </> :
      <>
        <CreateUser/> 
        <button onClick={() => setView(!view)}>Login</button>
      </>}
      
    </div>
  )
}