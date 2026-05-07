export default function Fallback({ text = "" }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center py-10">
      <img src="/assets/loader/madbars.gif" alt="loading..." className="w-16 h-16" />
      <p>{text}</p>
    </div>
  );
}
