"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteContactMessage } from "@/lib/api";

const getMyComments = () => JSON.parse(localStorage.getItem("myComments") || "[]");

const DeleteButton = ({ id }) => {
  const [isOwn, setIsOwn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsOwn(getMyComments().includes(id));
  }, [id]);

  if (!isOwn) return null;

  const handleDelete = async () => {
    await deleteContactMessage(id);
    localStorage.setItem("myComments", JSON.stringify(getMyComments().filter((i) => i !== id)));
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="mt-2 text-xs uppercase tracking-widest text-white/70 hover:text-(--color-brand) transition-colors cursor-pointer"
    >
      DELETE
    </button>
  );
};

export default DeleteButton;
