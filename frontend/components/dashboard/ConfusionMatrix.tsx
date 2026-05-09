"use client";

import React from "react";

interface ConfusionMatrixProps {
  labels: string[];
  matrix: number[][];
  normalizedMatrix: number[][];
}

export default function ConfusionMatrix({ labels, matrix, normalizedMatrix }: ConfusionMatrixProps) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative group">
      {/* Background Decorative Gradient */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 group-hover:bg-blue-100 transition-colors duration-700" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Model Evaluation</h3>
            <p className="text-sm text-slate-500 mt-1">Confusion Matrix: Performance on validation dataset</p>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">YOLOv8s Metrics</span>
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-6 items-center">
          {/* Predicted Axis Label */}
          <div className="flex items-center justify-center -rotate-90 origin-center translate-x-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Predicted</span>
          </div>

          <div className="space-y-4">
            {/* Column Labels (True) */}
            <div className="grid grid-cols-2 gap-4 pl-0">
              {labels.map((label) => (
                <div key={label} className="text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">True {label}</span>
                </div>
              ))}
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-2 gap-4">
              {matrix.map((row, i) => (
                <React.Fragment key={i}>
                  {row.map((value, j) => {
                    const normalized = normalizedMatrix[i][j];
                    const isDiagonal = i === j;
                    
                    return (
                      <div
                        key={`${i}-${j}`}
                        className={`
                          relative group/cell aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                          ${isDiagonal 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-200/50' 
                            : value > 0 
                              ? 'bg-slate-50 border-2 border-dashed border-slate-200 text-slate-900' 
                              : 'bg-slate-50/50 border border-slate-100 text-slate-400 opacity-60'}
                        `}
                      >
                        <span className="text-4xl font-black mb-1">{value}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDiagonal ? 'text-blue-100' : 'text-slate-400'}`}>
                          {(normalized * 100).toFixed(0)}%
                        </span>

                        {/* Tooltip on hover */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/cell:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                          {isDiagonal ? 'Correct Predictions' : 'Missed Detections'}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Legend / Stats */}
        <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detection Rate</p>
            <p className="text-2xl font-black text-slate-900">{(normalizedMatrix[0][0] * 100).toFixed(1)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">False Negatives</p>
            <p className="text-2xl font-black text-red-500">{(normalizedMatrix[0][1] * 100).toFixed(1)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Samples</p>
            <p className="text-2xl font-black text-slate-900">{matrix[0][0] + matrix[0][1] + matrix[1][0] + matrix[1][1]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
