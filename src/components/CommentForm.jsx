"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BtnNormal from "./BtnNormal";
import { postContactMessage } from "@/lib/api";

const inputClass = "flex-1 bg-transparent border border-white/30 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-(--color-brand)";

const CommentForm = () => {
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const formRef = useRef(null);
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await postContactMessage({ ...form, date: new Date().toISOString() });
    const data = await res.json();

    const mine = JSON.parse(localStorage.getItem("myComments") || "[]");
    localStorage.setItem("myComments", JSON.stringify([...mine, data.id]));

    setForm({ name: "", email: "", content: "" });
    router.refresh();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-16">
      <h3 className="text-xl font-bold tracking-widest uppercase mb-6">Leave a Comment</h3>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <textarea
        name="content"
        placeholder="Your Comment"
        value={form.content}
        onChange={handleChange}
        required
        rows={8}
        className="w-full bg-transparent border border-white/30 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-(--color-brand) resize-y mb-4"
      />

      <div className="flex justify-end">
        <BtnNormal title="Submit" onClick={() => formRef.current?.requestSubmit()} />
      </div>
    </form>
  );
};

export default CommentForm;
