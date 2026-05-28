export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      {}
      <img src="/assets/loader/madbars.gif" alt="Loading" width={120} height={120} />
    </div>
  );
}
