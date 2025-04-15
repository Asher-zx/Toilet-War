import { BlogCard } from "../component/BlogCard"
import { useEffect, useState } from "react";
import { getPosts } from "../api";
import * as jwt_decode from "jwt-decode";

export function Profile() {

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({})

  useEffect(() => {
    async function loadUserData() {
      const token = sessionStorage.getItem("User");
      const decodedUser = jwt_decode.jwtDecode(token);
      const allPosts = await getPosts();
      const filteredPosts = allPosts.filter((post) => post.author == decodedUser._id);
      setPosts(filteredPosts);
      setUser(decodedUser);
    }
    loadUserData()
  }, [])

  return (
    <div className="profile">
      <label htmlFor="">Name</label>
      <h2>{user.name}</h2>
      <label htmlFor="">Email</label>
      <h2>{user.email}</h2>
      <label htmlFor="">Join Date</label>
      <h2>{user.joinDate}</h2>
      {posts.map((post) => {
        return (
          <BlogCard post={post}/>
        )
      })}
    </div>
  )
}