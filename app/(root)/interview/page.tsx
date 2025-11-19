"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InterviewFormPage() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [techstack, setTechstack] = useState("");
  const [amount, setAmount] = useState(5);
  const [type, setType] = useState("Technical");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!role || !level || !techstack) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    const userId = localStorage.getItem("userId");

    const response = await fetch("/api/vapi/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        level,
        techstack,
        type,
        amount,
        userid: userId,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // redirect to home → interview will appear in list
      router.push("/");
    } else {
      alert("Interview generation failed.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Create Your Interview</h2>

      <input
        type="text"
        placeholder="Job Role (e.g. Python Developer)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="input border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Experience Level (e.g. Fresher, Mid, Senior)"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="input border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Tech Stack (e.g. React, Node, MongoDB)"
        value={techstack}
        onChange={(e) => setTechstack(e.target.value)}
        className="input border p-2 rounded"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="input border p-2 rounded"
      >
        <option value="Technical">Technical</option>
        <option value="Behavioral">Behavioral</option>
        <option value="Mixed">Mixed</option>
      </select>

      <input
        type="number"
        min="1"
        max="20"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="input border p-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="btn-primary bg-blue-600 text-white p-2 rounded"
      >
        {loading ? "Generating..." : "Generate Interview"}
      </button>
    </div>
  );
}
