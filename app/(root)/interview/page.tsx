"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InterviewFormPage() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [techstack, setTechstack] = useState("");
  const [type, setType] = useState("Technical");
  const [amount, setAmount] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role || !level || !techstack) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);

    const userId = localStorage.getItem("userId");

    const res = await fetch("/api/vapi/generate", {
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

    const data = await res.json();

    if (data.success) {
      router.push("/");
    } else {
      alert("Failed to generate interview");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Create Your Interview</h2>

      <input
        className="input border p-2 rounded"
        placeholder="Role (e.g., Python Developer)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <input
        className="input border p-2 rounded"
        placeholder="Experience Level (e.g., Fresher, Mid, Senior)"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      />

      <input
        className="input border p-2 rounded"
        placeholder="Tech Stack (e.g., Python, Django, SQL)"
        value={techstack}
        onChange={(e) => setTechstack(e.target.value)}
      />

      <select
        className="input border p-2 rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="Technical">Technical</option>
        <option value="Behavioral">Behavioral</option>
        <option value="Mixed">Mixed</option>
      </select>

      <input
        type="number"
        min={1}
        max={20}
        className="input border p-2 rounded"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-600 p-2 text-white rounded"
      >
        {loading ? "Generating..." : "Generate Interview"}
      </button>
    </div>
  );
}
