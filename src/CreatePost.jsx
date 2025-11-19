import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function CreatePost({ onCreate, editPost, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [flag, setFlag] = useState("None");

  // Load data when editing
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || "");
      setDescription(editPost.description || "");
      setFlag(editPost.flag || "None");
    }
  }, [editPost]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    let uploadedImageUrl = null;

    // UPLOAD IMAGE FILE TO SUPABASE STORAGE
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("images") // your bucket name
        .upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: false});
            

      if (uploadError) {
        console.error(uploadError);
      } else {
        
        const { data: publicData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName)

          uploadedImageUrl = publicData.publicUrl;
        
      }
    }

    // Update existing quest
    if (editPost) {
      const { error } = await supabase
        .from('dndposts')
        .update({
          title,
          description,
          image_url: uploadedImageUrl || editPost.image_url,
          flag: flag === "None" ? null : flag,
        })
        .eq("id", editPost.id);

      if (error) console.error(error);

      if (onCancel) onCancel(); // return to post view
      return;
    }

      // Create new quest
      const { error } = await supabase.from('dndposts').insert([
        {
            title,
            description,
            image_url: uploadedImageUrl,
            flag: flag === "None" ? null : flag,
            upvotes: 0,
        },
      ]); // <-- returns the inserted row

    if (error) console.error(error);

    if (onCreate) onCreate(); // go back to browse
    }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 40,
        textAlign: "center",
        fontFamily: "IM Fell English, serif",
      }}
    >
      <h1
        style={{
          color: "#c79f4b",
          fontFamily: "Cinzel, serif",
          marginBottom: 20,
        }}
      >
        {editPost ? "✏️ Edit Quest" : "📜 Create a New Quest"}
      </h1>

      {/* TITLE */}
      <input
        type="text"
        placeholder="Quest title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: "10px",
          width: "260px",
          marginBottom: "12px",
          borderRadius: "6px",
          border: "2px solid #5a3e1b",
        }}
      />

      {/* DESCRIPTION */}
      <br />
      <textarea
        placeholder="Quest details, lore, or instructions..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows="4"
        style={{
          padding: "10px",
          width: "260px",
          borderRadius: "6px",
          border: "2px solid #5a3e1b",
          marginBottom: "12px",
          resize: "none",
        }}
      />

      {/* IMAGE FILE UPLOAD */}
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        style={{
          width: "260px",
          marginBottom: 10,
          padding: 8,
          borderRadius: 6,
          border: "2px solid #5a3e1b",
          background: "#3a3a3aff",
        }}
      />

      <p style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: -5 }}>
        (Optional)
      </p>

      {/* FLAG SELECT */}
      <br />
      <select
        value={flag}
        onChange={(e) => setFlag(e.target.value)}
        style={{
          padding: 8,
          borderRadius: 6,
          border: "2px solid #5a3e1b",
          marginBottom: 12,
        }}
      >
        <option>None</option>
        <option>Quest</option>
        <option>Treasure Hunt</option>
        <option>Heist</option>
      </select>

      <br />

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        style={{
          padding: "10px 18px",
          background: "#c79f4b",
          border: "2px solid #5a3e1b",
          cursor: "pointer",
          borderRadius: "6px",
          fontWeight: "bold",
          fontFamily: "Cinzel, serif",
        }}
      >
        {editPost ? "Save Quest" : "Add Quest"}
      </button>

      {/* CANCEL BUTTON */}
      {editPost && (
        <button
          type="button"
          onClick={onCancel}
          style={{
            marginLeft: 10,
            padding: "10px 18px",
            border: "2px solid #5a3e1b",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}