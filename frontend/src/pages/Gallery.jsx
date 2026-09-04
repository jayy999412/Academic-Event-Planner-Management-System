import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { uploadImages, getGallery, deleteImage } from "../services/galleryService";
import { ArrowLeft, Upload, Trash2, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };

function Gallery() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => { loadGallery(); }, []);
  const loadGallery = async () => { try { const r = await getGallery(eventId); setImages(r.data); } catch (e) { console.log(e); } };

  const handleUpload = async () => {
    if (files.length === 0) { alert("Choose Images"); return; }
    try { await uploadImages(eventId, files); alert("Images Uploaded"); setFiles([]); loadGallery(); }
    catch (e) { console.log(e); alert("Upload Failed"); }
  };

  const removeImage = async (id) => { if (!window.confirm("Delete Image?")) return; await deleteImage(id); loadGallery(); };

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Event Gallery</h1>
      </div>

      <div style={card}>
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "128px", border: "2px dashed #e2e8f0", borderRadius: "10px", cursor: "pointer" }}>
          <Upload size={32} style={{ color: "#94a3b8", marginBottom: "8px" }} />
          <span style={{ fontSize: "14px", color: "#64748b" }}>{files.length > 0 ? `${files.length} files selected` : "Click to select images"}</span>
          <input type="file" multiple style={{ display: "none" }} onChange={(e) => setFiles(e.target.files)} />
        </label>
        {files.length > 0 && (
          <button onClick={handleUpload}
            style={{ marginTop: "16px", padding: "10px 24px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
            Upload {files.length} Images
          </button>
        )}
      </div>

      {images.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "48px", textAlign: "center" }}>
          <Image size={48} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
          <p style={{ color: "#64748b", margin: 0 }}>No images in gallery</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
          {images.map(img => (
            <div key={img.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden", position: "relative" }}>
              <img src={`http://localhost:8080/uploads/${img.imagePath}`} alt="" loading="lazy" style={{ width: "100%", height: "192px", objectFit: "cover" }} />
              <button onClick={() => removeImage(img.id)}
                style={{ position: "absolute", top: "8px", right: "8px", width: "32px", height: "32px", background: "rgba(239,68,68,0.8)", color: "white", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", opacity: 0, transition: "opacity 0.2s" }}
                onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "#dc2626"; }}
                onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
