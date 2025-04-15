import { getPost } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function ReadBlog() {

  const [post, setPost] = useState({}); // Initialize post state

  let param = useParams();
  const navigate = useNavigate();
  let id = param.id;

  useEffect(() => {
    async function loadPost() {
      const data = await getPost(id);
      let date = new Date(data.dateCreated);
      data.dateCreated = date.toString();
      setPost(data);
    }
    loadPost()
  }, [id])

  return (
    <>
      <button onClick={() => navigate(-1)}>Back</button> 
      <div className="read-blog">

        <h1>{post.title}</h1>
        <h1>{post.description}</h1>
        <h1>{post.dateCreated?.slice(4, 15)}</h1>
        <p>{post.content}</p>

      </div>
    </>
  );
}