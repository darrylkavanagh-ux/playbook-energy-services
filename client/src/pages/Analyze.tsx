import React, { useState } from "react";
import Layout from "../components/Layout";
import { useLocation } from "wouter";

export default function Analyze() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setLocation("/results");
    }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      // Simulate processing delay
      setTimeout(() => {
        setLocation("/results");
      }, 3000);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black uppercase mb-8 leading-none">
          Upload <br/> Protocol
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="font-mono text-lg mb-8 border-l-4 border-black pl-4">
              Our AI engines will dismantle your bill line-by-line. We extract usage data, standing charges, and hidden rates to find the mathematical truth.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#FFD700] border-2 border-black flex items-center justify-center font-bold text-xs">1</div>
                <span className="font-mono text-sm uppercase">Upload PDF or Image of Bill</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#FFD700] border-2 border-black flex items-center justify-center font-bold text-xs">2</div>
                <span className="font-mono text-sm uppercase">AI Extraction (OCR + NLP)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#FFD700] border-2 border-black flex items-center justify-center font-bold text-xs">3</div>
                <span className="font-mono text-sm uppercase">Market Comparison</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#FFD700] border-2 border-black flex items-center justify-center font-bold text-xs">4</div>
                <span className="font-mono text-sm uppercase">Instant Savings Report</span>
              </div>
            </div>
          </div>

          <div 
            className={`
              aspect-square border-4 border-black bg-white flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer relative overflow-hidden
              ${isDragging ? 'bg-[#FFD700] scale-[1.02]' : 'hover:bg-gray-50'}
              ${isProcessing ? 'pointer-events-none' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {isProcessing ? (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-[#FFD700]">
                <div className="font-mono text-4xl font-bold mb-4 animate-pulse">PROCESSING</div>
                <div className="font-mono text-sm uppercase tracking-widest">Deciphering Energy Cartel Data...</div>
                <div className="w-full absolute bottom-0 h-2 bg-[#333]">
                  <div className="h-full bg-[#FFD700] animate-[width_3s_ease-in-out_forwards]" style={{width: '0%'}}></div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 mb-6 border-4 border-black rounded-full flex items-center justify-center bg-[#FFD700]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V16M12 4L8 8M12 4L16 8M4 20H20" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-black uppercase mb-2">Drop Bill Here</h3>
                <p className="font-mono text-sm text-gray-500 mb-6">PDF, JPG, PNG supported</p>
                <button className="neo-button text-sm">
                  Or Select File
                </button>
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
