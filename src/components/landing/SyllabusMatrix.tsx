"use client";

import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lock, LayoutGrid, Award, ArrowRight } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  assessment: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export default function SyllabusMatrix() {
  const [activeModule, setActiveModule] = useState<number>(1);

  const modules: Module[] = [
    {
      id: 1,
      title: "Module 01: Core Fundamentals & Setup",
      description: "Building the ironclad architecture and industry-standard workflows required for real-world execution.",
      lessons: [
        { id: "L1", title: "Concept Deep-Dive & System Initialization", assessment: "Modern Sandbox Environment Test" },
        { id: "L2", title: "Syntax Mastery & Structuring Logic", assessment: "Practical Syntax Compilation Lab" },
        { id: "L3", title: "Data Implementation & Variables", assessment: "Live Deployment Debugging Drill" },
        { id: "L4", title: "Production-Ready Workflow Pipeline", assessment: "Comprehensive Module Gate-Review" }
      ]
    },
    {
      id: 2,
      title: "Module 02: Advanced Architecture & Logic",
      description: "Stepping out of the basics into complex engineering mechanics and structural scaling.",
      lessons: [
        { id: "L1", title: "Advanced Structural Pattern Analysis", assessment: "Pattern Optimization Sandbox" },
        { id: "L2", title: "Dynamic Logic Controls & Flow", assessment: "Conditional Workflow Lab" },
        { id: "L3", title: "Performance Execution Optimization", assessment: "Live Speed Efficiency Check" },
        { id: "L4", title: "Integration Architecture Review", assessment: "Module 2 Engineering Capstone" }
      ]
    },
    {
      id: 3,
      title: "Module 03: Performance Optimization",
      description: "Refining, debugging, and transforming functional assets into lightning-fast architectures.",
      lessons: [
        { id: "L1", title: "Debugging Frameworks & Error Handlers", assessment: "Live Systems Failure Simulation" },
        { id: "L2", title: "Asset Optimization & Asset Delivery", assessment: "Bandwidth & Payload Compression Lab" },
        { id: "L3", title: "State-Management & Seamless Rendering", assessment: "Dynamic State Synchronization Check" },
        { id: "L4", title: "Production Build Engineering", assessment: "Performance Verification Assessment" }
      ]
    },
    {
      id: 4,
      title: "Module 04: Real-World Case Deployments",
      description: "Applying classroom theory directly onto live corporate scenarios and complex scaling tasks.",
      lessons: [
        { id: "L1", title: "Client Brief Translation & Mapping", assessment: "Scope of Work Blueprint Validation" },
        { id: "L2", title: "Agile Rapid Component Deployment", assessment: "Time-Boxed Sprint Execution Lab" },
        { id: "L3", title: "Cross-Platform Diagnostics & Analytics", assessment: "Multi-Environment Compatibility Audit" },
        { id: "L4", title: "End-to-End Delivery Systems", assessment: "Deployment Architecture Validation" }
      ]
    },
    {
      id: 5,
      title: "Module 05: Capstone Matrix Strategy",
      description: "The ultimate final phase to lock in market-ready autonomy and portfolio supremacy.",
      lessons: [
        { id: "L1", title: "Enterprise Scalability Implementations", assessment: "High-Volume Execution Test" },
        { id: "L2", title: "Security Matrix & Encryption Standards", assessment: "Vulnerability Remediation Lab" },
        { id: "L3", title: "Final Industrial Quality Benchmarks", assessment: "Peer-Review Quality Assurance Test" },
        { id: "L4", title: "Grand Capstone System Launch", assessment: "Expert Panel Assessment Evaluation" }
      ]
    }
  ];

  return (
    <section className="py-20 bg-white text-gray-900 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold tracking-wider text-[#6A1B9A] uppercase bg-purple-50 px-4 py-1.5 rounded-full">
            Syllabus Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A0033] mt-4 mb-4">
            A Laser-Focused, Gate-Locked Learning Matrix
          </h2>
          <p className="text-lg text-gray-600">
            Engineered for absolute mastery, not memorization. You cannot skip ahead. Every single lesson locks until your practical application scores 80% or higher.
          </p>
        </div>

        {/* Micro-Metric Flex Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-r from-[#1A0033] to-[#3B0066] text-white p-8 rounded-2xl shadow-xl mb-12">
          <div className="flex items-center space-x-4 border-b md:border-b-0 md:border-r border-purple-500/30 pb-4 md:pb-0 md:pr-4">
            <div className="p-3 bg-purple-600/30 rounded-xl text-[#FFD700]">
              <LayoutGrid size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold">5 Modules</p>
              <p className="text-sm text-purple-200">Per Foundation Course</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 border-b md:border-b-0 md:border-r border-purple-500/30 pb-4 md:pb-0 md:pr-4">
            <div className="p-3 bg-purple-600/30 rounded-xl text-[#FFD700]">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold">4 Deep Lessons</p>
              <p className="text-sm text-purple-200">Structured Inside Each Module</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-600/30 rounded-xl text-[#FFD700]">
              <Award size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold">1-to-1 Practical Labs</p>
              <p className="text-sm text-purple-200">Strict Knowledge Gates</p>
            </div>
          </div>
        </div>

        {/* Core Matrix Dynamic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Tabs: Modules */}
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-2">Select Course Module</p>
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full text-left p-5 rounded-xl transition-all duration-300 flex items-start space-x-4 border ${
                  activeModule === mod.id
                    ? 'bg-purple-50 border-[#6A1B9A] shadow-md ring-1 ring-[#6A1B9A]'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className={`mt-0.5 font-bold text-sm px-2.5 py-1 rounded-md ${
                  activeModule === mod.id ? 'bg-[#6A1B9A] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  0{mod.id}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-base ${activeModule === mod.id ? 'text-[#1A0033]' : 'text-gray-700'}`}>
                    {mod.title.split(': ')[1]}
                  </h4>
                  {activeModule === mod.id && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {mod.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Right Area: Dynamic 4-Step Lesson Pipeline */}
          <div className="lg:col-span-7 bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <h3 className="font-bold text-lg text-[#1A0033] flex items-center gap-2">
                <BookOpen size={20} className="text-[#6A1B9A]" />
                Module 0{activeModule} Pipeline Structure
              </h3>
              <span className="text-xs bg-[#FFD700]/20 text-yellow-800 font-bold px-2.5 py-1 rounded-md border border-[#FFD700]/40">
                Sequential Unlock
              </span>
            </div>

            <div className="relative border-l-2 border-purple-200 ml-4 pl-6 md:pl-8 space-y-8">
              {modules[activeModule - 1].lessons.map((lesson, idx) => (
                <div key={lesson.id} className="relative group">
                  
                  {/* Step Timeline Indicator Node */}
                  <span className={`absolute -left-[35px] md:-left-[43px] top-0 flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white ${
                    idx === 0 
                      ? 'border-emerald-500 text-emerald-500' 
                      : 'border-purple-300 text-purple-400 group-hover:border-[#6A1B9A]'
                  }`}>
                    {idx === 0 ? <CheckCircle size={14} /> : <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />}
                  </span>

                  {/* Lesson Content Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-[#6A1B9A] uppercase tracking-wider block mb-1">
                          Lesson 0{idx + 1}
                        </span>
                        <h5 className="font-semibold text-gray-900 text-base mb-3">
                          {lesson.title}
                        </h5>
                      </div>
                      {idx > 0 && (
                        <Lock size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                      )}
                    </div>

                    {/* Target Assessment Box */}
                    <div className="mt-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3.5 flex items-start gap-3">
                      <div className="mt-0.5 text-amber-500">
                        <ArrowRight size={15} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Required Practical Assessment:</p>
                        <p className="text-sm font-medium text-gray-700 mt-0.5">{lesson.assessment}</p>
                        {idx === 0 ? (
                          <span className="inline-block text-[11px] text-emerald-600 font-medium mt-1">
                            ✓ Open / Ready to take
                          </span>
                        ) : (
                          <span className="inline-block text-[11px] text-gray-400 font-medium mt-1">
                            🔒 Unlock score requirement: 80%+ on Lesson 0{idx} Test
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}