import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";

// Pages
import SideBar from "./SideBar";
import HomePage from "./HomePage";
import BrowsePage from "./BrowsePage";
import CreatePost from "./CreatePost";
import PostPage from "./PostPage";

function CreatePostWrapper({ fetchPosts }) {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const editId = params.get("edit");

  const [editPost, setEditPost] = useState(null);

  useEffect(() => {
    async function loadPost() {
      if (!editId) return;

      const { data, error } = await supabase
        .from("dndposts")
        .select("*")
        .eq("id", editId)
        .single();

      if (error) console.error(error);
      setEditPost(data);
    }

    loadPost();
  }, [editId]);

  if (editId && !editPost) {
    return <p style={{ color: "white" }}>Loading quest...</p>;
  }

  return (
    <CreatePost
      editPost={editPost}
      onCancel={() => navigate(-1)}
      onCreate={fetchPosts}
    />
  );
}

// ⭐ MAIN APP ⭐
export default function App() {
  const [posts, setPosts] = useState([]);

  async function fetchPosts() {
    const { data } = await supabase
      .from("dndposts")
      .select("*")
      .order("created_at", { ascending: false });

    setPosts(data || []);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Router>
      <Routes>

        {/* ALL PAGES GO INSIDE THIS LAYOUT */}
        <Route path="/" element={<SideBar />}>

          <Route index element={<HomePage />} />

          <Route
            path="browse"
            element={<BrowsePage posts={posts} fetchPosts={fetchPosts} />}
          />

          <Route
            path="create"
            element={<CreatePostWrapper fetchPosts={fetchPosts} />}
          />

          <Route
            path="post/:id"
            element={<PostPage fetchPosts={fetchPosts} />}
          />

          <Route 
            path="/edit/:id" 
            element={<CreatePost fetchPosts={fetchPosts} />} 
          />

        </Route>
      </Routes>
    </Router>
  );
}