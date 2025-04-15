import { getPosts } from "../api";
import { useEffect, useState } from "react";
import { BlogCard } from "../component/BlogCard";


export function Home() {
  
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {

    async function loadAllPosts() {
      try {
        setLoading(true);
        const data = await getPosts();
        const sortedData = [...data].sort((a, b) => {
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        });
        setPosts(sortedData);
        setError(null);
/*         data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
        }); */
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
      
      /*       setPosts(data); */
    }

    loadAllPosts()
  }, [])

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="posts">
      {posts.map((post) => {
        return (
          <BlogCard post={post} key={post._id} />
        )
      })}
    </div>
  );
}