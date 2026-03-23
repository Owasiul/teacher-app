import { useState, useEffect, useContext } from "react";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../AuthProvider/AuthContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axiosPublic from "../Axios/AxiosApi";

const Photos = () => {
  const { user } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // Pinterest-style breakpoints
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const fetchPhotos = async () => {
    try {
      const res = await axiosPublic.get("/photos");
      setPhotos(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const onSubmit = async (data) => {
    // 1. Check if user exists to avoid sending 'undefined'
    if (!user || !user.studentId) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    setIsUploading(true);

    try {
      // 2. Prepare ImgBB Upload
      const image = data.image[0];
      const formData = new FormData();
      formData.append("image", image);

      const apiKey = import.meta.env.VITE_IMGBB_API;
      if (!apiKey) throw new Error("ImgBB API key is missing in .env");

      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const imgData = await imgbbRes.json();

      // 3. Check if ImgBB actually succeeded
      if (imgData.success) {
        const photoEntry = {
          studentName: user.name,
          studentId: user.studentId, // Ensure this matches backend field name
          imageUrl: imgData.data.display_url,
          caption: data.caption,
        };

        // 4. Save to MongoDB via your Axios instance
        const response = await axiosPublic.post("/photos", photoEntry);

        if (response.data.insertedId || response.status === 201) {
          toast.success("Memory shared successfully! 📸");
          setIsModalOpen(false);
          reset();
          fetchPhotos();
        }
      } else {
        // This handles cases where ImgBB returns a 400
        console.error("ImgBB Error:", imgData);
        toast.error(imgData.error?.message || "Image upload failed.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error("Something went wrong. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6e9] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="font-serif text-4xl font-bold text-stone-800">
            Memory Lane
          </h1>
          <p className="text-stone-500 mt-2 font-medium italic">
            Capturing moments in the lab of life ⚛️
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-200 transition-all flex items-center gap-2"
        >
          <span>➕</span> Share a Memory
        </button>
      </div>

      {/* Masonry Grid */}
      {loading ? (
        <div className="text-center py-20 font-serif text-stone-400">
          Developing photos...
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {photos.map((photo) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={photo._id}
              className="mb-6 group relative overflow-hidden rounded-3xl bg-white p-3 shadow-md border border-stone-100"
            >
              <img
                src={photo.imageUrl}
                alt="Memory"
                className="w-full rounded-2xl grayscale-30 group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="mt-3 px-1">
                <p className="text-sm font-serif italic text-stone-700">
                  "{photo.caption}"
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-[10px]">
                    👤
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
                    {photo.studentName}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-4xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">
                Upload a Memory
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase ml-1">
                    Photo with Teacher
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: true })}
                    className="w-full mt-2 text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase ml-1">
                    Short Caption
                  </label>
                  <textarea
                    {...register("caption", { required: true })}
                    placeholder="E.g. After the best optics lecture ever!"
                    className="w-full mt-2 p-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:ring-4 focus:ring-amber-500/10 outline-none resize-none"
                    rows="3"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-stone-400 font-bold hover:bg-stone-50 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-2 py-3 bg-stone-900 text-amber-400 font-bold rounded-2xl shadow-xl hover:shadow-amber-200 transition-all disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Post Photo ✨"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Masonry CSS */}
      <style>{`
        .my-masonry-grid {
          display: flex;
          margin-left: -24px; /* gutter size offset */
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 24px; /* gutter size */
          background-clip: padding-box;
        }
        .my-masonry-grid_column > div {
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

export default Photos;
