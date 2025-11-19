import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    const { data, error } = await supabase
      .from('dndcomments')
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) console.error("Fetch error:", error);
    else setComments(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('dndcomments')
      .insert([{ post_id: postId, text: newComment }])
      .select();

    if (error) {console.error("Comment insert error:", error);
      alert("Failed to add comment: " + error.message);
    }
    else {
      setNewComment("");
      fetchComments();
    }
  }

  return (
    <div style={{ marginTop: 20, paddingTop: 10, borderTop: "1px solid #5a3e1b" }}>
      <h3 style={{ fontFamily: "Cinzel, serif" }}>🗨️ Comments</h3>

      {comments.length === 0 && <p>No comments yet. Be the first!</p>}

      {comments.map((c) => (

        <div key={c.id}style={{
            backgroundImage: "url(./textured-paper-background.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "12px 14px",
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #5a3e1b",
          }}
        >
          {c.text}
          <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
            {new Date(c.created_at).toLocaleString()}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            padding: 8,
            width: "70%",
            marginRight: 10,
            borderRadius: 6,
            border: "1px solid #5a3e1b",
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "8px 14px",
            background: "#c79f4b",
            border: "2px solid #5a3e1b",
            cursor: "pointer",
            borderRadius: 6,
            fontWeight: "bold",
          }}
        >
          Add Comment
        </button>
      </form>
    </div>
  );
}