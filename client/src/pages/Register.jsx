import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { Upload, PenTool } from "lucide-react";

const Register = () => {
  const API_URL = "https://msg-portal.onrender.com/api/recruit";
  const sigCanvas = useRef({});
  const [loading, setLoading] = useState(false);
  const [sigMode, setSigMode] = useState("draw"); // 'draw' or 'upload'
  const [uploadedSig, setUploadedSig] = useState(null); // Stores base64 of uploaded sig

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    faculty: "",
    level: "100",
    course: "",
    whatsapp: "",
    reason: "",
    gender: "Male",
    passport: null,
  });

  const clearSig = () => sigCanvas.current.clear();

  // Helper: Convert File to Base64
  const handleSigFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedSig(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    await axios.post(`${API_URL}/register`, form);
    e.preventDefault();
    setLoading(true);

    // 1. Get Signature Data (Draw or Upload)
    let finalSignature = "";

    if (sigMode === "draw") {
      if (sigCanvas.current.isEmpty()) {
        toast.error("Please sign the application.");
        setLoading(false);
        return;
      }
      // FIX: Use getCanvas() instead of getTrimmedCanvas() to avoid the crash
      finalSignature = sigCanvas.current.getCanvas().toDataURL("image/png");
    } else {
      if (!uploadedSig) {
        toast.error("Please upload your signature.");
        setLoading(false);
        return;
      }
      finalSignature = uploadedSig;
    }

    const form = new FormData();
    // Append text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "passport") form.append(key, formData[key]);
    });

    // Append Files
    form.append("passport", formData.passport);
    form.append("signature", finalSignature);

    try {
      await axios.post("http://localhost:5000/api/recruit/register", form);
      toast.success("Application Submitted Successfully!");

      // Optional: Clear form or redirect
      sigCanvas.current.clear();
      e.target.reset(); // visual reset
    } catch (err) {
      console.error(err);
      // Handle the "Duplicate" error specifically
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Submission failed. Check connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>

      <ToastContainer theme="dark" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel w-full max-w-4xl rounded-2xl p-8 relative z-10"
      >
        <h1 className="text-4xl font-bold text-center mb-2 text-white glow-text">
          MSG RECRUITMENT
        </h1>
        <p className="text-center text-gray-400 mb-8 tracking-widest uppercase text-sm">
          Official Registration Portal
        </p>

        <form onSubmit={handleSubmit}>
          {/* This fieldset disables everything when loading is true */}
          <fieldset
            disabled={loading}
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {/* Identity Section */}
            <div className="space-y-4">
              <h3 className="text-green-400 font-semibold border-b border-gray-700 pb-2">
                01. Identity
              </h3>
              <input
                required
                placeholder="Full Name"
                className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition"
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                required
                placeholder="WhatsApp Contact"
                className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition"
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
              />
              <div className="flex gap-4">
                <select
                  className="bg-black/40 border border-gray-700 p-3 rounded text-white flex-1"
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select
                  className="bg-black/40 border border-gray-700 p-3 rounded text-white flex-1"
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                >
                  {[100, 200, 300, 400, 500].map((l) => (
                    <option key={l} value={l}>
                      {l} Level
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Academic & Verification */}
            <div className="space-y-4">
              <h3 className="text-green-400 font-semibold border-b border-gray-700 pb-2">
                02. Academics & Verification
              </h3>
              <input
                required
                placeholder="Faculty"
                className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition"
                onChange={(e) =>
                  setFormData({ ...formData, faculty: e.target.value })
                }
              />
              <input
                required
                placeholder="Course of Study"
                className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition"
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
              />

              {/* Passport Upload */}
              <div className="border border-dashed border-gray-600 rounded p-4 text-center cursor-pointer hover:border-green-500 transition relative group">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, passport: e.target.files[0] })
                  }
                  required
                />
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-300 group-hover:text-green-400 font-bold">
                    {formData.passport
                      ? formData.passport.name
                      : "Upload Passport"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to select file
                  </p>
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="md:col-span-2">
              <textarea
                required
                placeholder="Why do you want to join the Muslim Students' Guard?"
                rows="3"
                className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition"
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              ></textarea>
            </div>

            {/* Signature Section - Placeholder */}
            Original SignatureCanvas component commented out
            <div className="md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-400">Digital Signature</p>
                <div className="flex gap-2 bg-black/50 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSigMode("draw")}
                    className={`p-2 rounded flex items-center gap-2 text-xs ${
                      sigMode === "draw"
                        ? "bg-green-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <PenTool size={14} /> Draw
                  </button>
                  <button
                    type="button"
                    onClick={() => setSigMode("upload")}
                    className={`p-2 rounded flex items-center gap-2 text-xs ${
                      sigMode === "upload"
                        ? "bg-green-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Upload size={14} /> Upload
                  </button>
                </div>
              </div>

              {sigMode === "draw" ? (
                <div className="space-y-2">
                  <div className="border border-gray-700 rounded bg-white overflow-hidden">
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 600,
                        height: 160,
                        className: "sigCanvas w-full",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={clearSig}
                    className="text-xs text-red-400 underline"
                  >
                    Clear & Rewrite
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-gray-600 rounded h-32 flex items-center justify-center relative hover:border-green-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleSigFileUpload}
                  />
                  <div className="text-center">
                    <p className="text-sm text-gray-300">
                      {uploadedSig
                        ? "Signature Loaded"
                        : "Click to Upload Signature Image"}
                    </p>
                    {uploadedSig && (
                      <p className="text-xs text-green-500 mt-1">
                        Ready to submit
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
           
            {/* Submit Button */}
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-black font-bold py-4 rounded shadow-[0_0_15px_rgba(34,197,94,0.5)] transition transform hover:scale-[1.01] flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "SUBMIT APPLICATION"
              )}
            </button>
          </fieldset>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
