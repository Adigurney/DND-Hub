import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import CommentSection from "./CommentSection";
import { useParams, useNavigate } from "react-router-dom";

export default function PostPage({ fetchPosts }) {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, [postId]);

    // Fetch post data
    async function fetchPost() {
        const { data, error } = await supabase
        .from("dndposts")
        .select("*")
        .eq("id", postId)
        .single();

        if (!error) {
            setPost(data);
        }
        setLoading(false);
    }

    // ⭐ Gain Inspiration
    async function handleInspiration() {
        const { data, error } = await supabase
        .from("dndposts")
        .update({ upvotes: post.upvotes + 1 })
        .eq("id", postId)
        .select()
        .single();

        if (!error) {
            setPost(data);
        }
    }

    // 🗑 Delete Post
    async function handleDelete() {
        const confirmDelete = confirm("Delete this quest forever?");
        if (!confirmDelete) return;

        const { error } = await supabase
        .from("dndposts")
        .delete()
        .eq("id", postId);

        if (!error) {
            navigate("/browse");
        } // return to list
    }

    if (!post) return <p>Loading...</p>;

    return (
        <div className="centered-page">

        <button
            onClick={() => navigate("/browse")}
            style={{
                marginBottom: 20,
                padding: "10px 18px",
                border: "2px solid #5a3e1b",
                borderRadius: 6,
                cursor: "pointer",
                background: "#c79f4b",
                fontFamily: "Cinzel, serif",
            }}
            >
            ← Back to Quests
        </button>

        <div className="post-scroll" style={{ maxWidth: 800 }}>
            <h1>
            📜 {post.title}{" "}
            {post.flag && <span className="flag-label">({post.flag})</span>}
            </h1>

            {post.image_url && (
            <img
                src={post.image_url}
                alt="quest"
                className="post-image"
                style={{ margin: "15px 0" }}
            />
            )}

            <p className="post-description">{post.description}</p>

            <p>⭐ Inspiration: <b>{post.upvotes}</b></p>

            {/* --- BUTTONS MOVED HERE --- */}
        <div style={{ 
            marginTop: 20, 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap", }}>

          <button
            onClick={handleInspiration}
            style={{
              padding: "8px 14px",
              background: "#d4b36a",
              border: "2px solid #5a3e1b",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "Cinzel, serif",
            }}
          >
            ✨ Gain Inspiration
          </button>

          <button
            onClick={() => navigate(`/create?edit=${post.id}`)}
            style={{
                padding: "8px 14px",
                background: "#a98e5b",
                border: "2px solid #5a3e1b",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "Cinzel, serif",
            }}
            >
            ✏️ Edit
            </button>

          <button
            onClick={handleDelete}
            style={{
              padding: "8px 14px",
              background: "#8b3a3a",
              color: "white",
              border: "2px solid #5a3e1b",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "Cinzel, serif",
            }}
          >
            🗑 Delete
          </button>
        </div>
        </div>

        {/* Comments now live here, not on Browse page */}
        <CommentSection postId={postId} />

        
      </div>
    );
    }