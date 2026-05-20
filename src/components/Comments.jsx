const fetchComments = async () => {
  const res = await fetch("https://nightclub-api-dhqe.onrender.com/comments", {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Kunne ikke hente kommentarer");
  return res.json();
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const Comments = async () => {
  const comments = await fetchComments();

  return (
    <section>
      <h2 className="mb-10 text-2xl">3 Comments</h2>
      <ul className="flex flex-col gap-6 list-none m-0 p-0">
        {comments.map((comment) => (
          <li key={comment.id} className="pb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold uppercase tracking-widest text-sm">{comment.name}</span>
              <span className="text-sm font-medium" style={{ color: "var(--color-brand)" }}>
                posted
              </span>
              <time
                dateTime={comment.date}
                className="text-sm font-medium"
                style={{ color: "var(--color-brand)" }}
              >
                {formatDate(comment.date)}
              </time>
            </div>
            <p className="text-white/70 text-sm leading-relaxed m-0">{comment.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Comments;
