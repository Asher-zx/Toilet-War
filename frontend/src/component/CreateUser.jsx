import { createUser } from "../api";
import { useState } from "react";

export function CreateUser() {

const [user, setUser] = useState({
  username: "",
  email: "",
  password: ""
})
async function handleSubmit(e) {
  e.preventDefault();
  let response = await createUser(user);
  console.log(response);
  
  if (response.status !== 200) {
    alert("User could not be created");
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
      <input placeholder={"username"} onChange={handleChange} name="name" required maxLength={20} />
      <br />
      <input placeholder={"email"} onChange={handleChange} name="email" required maxLength={40}/>
      <br />
      <input placeholder={"password"} onChange={handleChange} type="password" name="password" required maxLength={20}/>
      <br />
      <button type="submit">Create Account</button>
    </form>
  )
}