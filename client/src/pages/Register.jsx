import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ReactSketchCanvas } from 'react-sketch-canvas'; // THE NEW LIBRARY
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, PenTool } from 'lucide-react';

// Use the Env Variable (Vercel) or Fallback (Local)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/recruit";

const Register = () => {
  const sigCanvas = useRef(null);
  const [loading, setLoading] = useState(false);
  const [sigMode, setSigMode] = useState('draw'); // 'draw' or 'upload'
  const [uploadedSig, setUploadedSig] = useState(null); 

  const [formData, setFormData] = useState({
    fullName: '', email: '', faculty: '', level: '100', course: '', whatsapp: '', reason: '', gender: 'Male', passport: null
  });

  const clearSig = () => sigCanvas.current.clearCanvas();

  const handleSigFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedSig(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalSignature = '';
    
    // LOGIC FOR NEW LIBRARY
    if (sigMode === 'draw') {
      try {
        // Export image as PNG Base64
        finalSignature = await sigCanvas.current.exportImage("png");
        
        // Check if empty (approximate check based on empty Base64 length or custom logic)
        // Note: react-sketch-canvas doesn't have .isEmpty() directly, 
        // so we assume if user didn't switch to 'upload', they must sign.
        if (!finalSignature) throw new Error("Empty Signature");
      } catch (err) {
        toast.error("Please sign the application.");
        setLoading(false);
        return;
      }
    } else {
      if (!uploadedSig) {
        toast.error("Please upload your signature.");
        setLoading(false);
        return;
      }
      finalSignature = uploadedSig;
    }

    const form = new FormData();
    Object.keys(formData).forEach(key => {
      if(key !== 'passport') form.append(key, formData[key]);
    });
    form.append('passport', formData.passport);
    form.append('signature', finalSignature);

    try {
      await axios.post(`${API_URL}/register`, form);
      toast.success("Application Submitted Successfully!");
      
      // Reset
      if(sigCanvas.current) sigCanvas.current.clearCanvas();
      e.target.reset();
      setUploadedSig(null);
      setFormData({
        fullName: '', email: '', faculty: '', level: '100', course: '', whatsapp: '', reason: '', gender: 'Male', passport: null
      });

    } catch (err) {
      console.error(err);
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
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
      
      <ToastContainer theme="dark" />

      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="glass-panel w-full max-w-4xl rounded-2xl p-8 relative z-10"
      >
        <h1 className="text-4xl font-bold text-center mb-2 text-white glow-text">MSG RECRUITMENT</h1>
        <p className="text-center text-gray-400 mb-8 tracking-widest uppercase text-sm">Official Registration Portal</p>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading} className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          
            {/* Identity Section */}
            <div className="space-y-4">
              <h3 className="text-green-400 font-semibold border-b border-gray-700 pb-2">01. Identity</h3>
              <input required placeholder="Full Name" className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition" onChange={e => setFormData({...formData, fullName: e.target.value})} />
              <input required type="email" placeholder="Email Address" className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition" onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required placeholder="WhatsApp Contact" className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition" onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
              <div className="flex gap-4">
                 <select className="bg-black/40 border border-gray-700 p-3 rounded text-white flex-1" onChange={e => setFormData({...formData, gender: e.target.value})}>
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                 </select>
                 <select className="bg-black/40 border border-gray-700 p-3 rounded text-white flex-1" onChange={e => setFormData({...formData, level: e.target.value})}>
                   {[100, 200, 300, 400, 500].map(l => <option key={l} value={l}>{l} Level</option>)}
                 </select>
              </div>
            </div>

            {/* Academic Section */}
            <div className="space-y-4">
              <h3 className="text-green-400 font-semibold border-b border-gray-700 pb-2">02. Academics</h3>
              <input required placeholder="Faculty" className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition" onChange={e => setFormData({...formData, faculty: e.target.value})} />
              <input required placeholder="Course of Study" className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition" onChange={e => setFormData({...formData, course: e.target.value})} />
              
              <div className="border border-dashed border-gray-600 rounded p-4 text-center cursor-pointer hover:border-green-500 transition relative group">
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setFormData({...formData, passport: e.target.files[0]})} required />
                <div className="flex flex-col items-center">
                   <p className="text-sm text-gray-300 group-hover:text-green-400 font-bold">{formData.passport ? formData.passport.name : "Upload Passport"}</p>
                   <p className="text-xs text-gray-500 mt-1">Click to select file</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <textarea required placeholder="Why do you want to join the Muslim Students' Guard?" rows="3" className="w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none transition" onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
            </div>

            {/* NEW SIGNATURE CANVAS */}
            <div className="md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-4">
                 <p className="text-sm text-gray-400">Digital Signature</p>
                 <div className="flex gap-2 bg-black/50 p-1 rounded-lg">
                    <button type="button" onClick={() => setSigMode('draw')} className={`p-2 rounded flex items-center gap-2 text-xs ${sigMode === 'draw' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                       <PenTool size={14} /> Draw
                    </button>
                    <button type="button" onClick={() => setSigMode('upload')} className={`p-2 rounded flex items-center gap-2 text-xs ${sigMode === 'upload' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                       <Upload size={14} /> Upload
                    </button>
                 </div>
              </div>

              {sigMode === 'draw' ? (
                <div className="space-y-2">
                  <div className="border border-gray-700 rounded bg-white overflow-hidden h-40">
                    <ReactSketchCanvas
                      ref={sigCanvas}
                      strokeWidth={4}
                      strokeColor="black"
                      canvasColor="white"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <button type="button" onClick={clearSig} className="text-xs text-red-400 underline">Clear & Rewrite</button>
                </div>
              ) : (
                <div className="border border-dashed border-gray-600 rounded h-40 flex items-center justify-center relative hover:border-green-500 transition">
                   <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleSigFileUpload} />
                   <div className="text-center">
                      <p className="text-sm text-gray-300">{uploadedSig ? "Signature Loaded" : "Click to Upload Signature Image"}</p>
                   </div>
                </div>
              )}
            </div>

            <button type="submit" className="md:col-span-2 bg-green-600 hover:bg-green-700 text-black font-bold py-4 rounded shadow-[0_0_15px_rgba(34,197,94,0.5)] transition transform hover:scale-[1.01] flex justify-center items-center">
              {loading ? "Processing..." : "SUBMIT APPLICATION"}
            </button>
          
          </fieldset>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;