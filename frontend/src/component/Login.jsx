import { verifyUser } from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {

const [user, setUser] = useState({
  email: "",
  password: ""
})

const navigate = useNavigate();

async function handleSubmit(e) {
  e.preventDefault();

  let response = await verifyUser(user);  
  
  if (response) {
    sessionStorage.setItem("User", response) 
    console.log(`Bearer ${response}`);
    axios.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
    navigate("/toilet-war")
  } else {
    alert("Login Failed")
  }
} 

function handleChange(e) {
  setUser({
    ...user,
    [e.target.name]: e.target.value
  });
}
  return (
    <form onSubmit={handleSubmit}>
      <input placeholder={"email"} onChange={handleChange} name="email" required maxLength={40}/>
      <br />
      <input placeholder={"password"} onChange={handleChange} type="password" name="password" required maxLength={20}/>
      <br />
      <button type="submit">Login</button>
    </form>
  )
}