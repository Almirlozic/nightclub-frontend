import CommentForm from "./CommentForm";
import { getComments } from "@/lib/api";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const Comments = async () => {
  const comments = await getComments();

  return (
    <section>
      <h2 className="mb-10 text-2xl">{comments.length} Comments</h2>
      <div className="relative">
        <ul className="comments-scroll flex flex-col gap-6 list-none m-0 p-0 max-h-105 overflow-y-auto pr-4">
          {comments.map((comment) => (
            <li key={comment.id} className="pb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold uppercase tracking-widest text-sm">{comment.name}</span>
                <span className="text-sm font-medium text-(--color-brand)">posted</span>
                <time dateTime={comment.date} className="text-sm font-medium text-(--color-brand)">
                  {formatDate(comment.date)}
                </time>
              </div>
              <p className="text-white/70 text-sm leading-relaxed m-0 line-clamp-3">{comment.content}</p>
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black to-transparent" />
        <p className="mt-2 text-xs text-white/30 uppercase tracking-widest text-center">scroll for more</p>
      </div>
      <CommentForm />
    </section>
  );
};

export default Comments;
