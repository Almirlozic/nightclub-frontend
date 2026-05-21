import Header from "@/components/Header";

export default function PagesLayout({ children }) {
  return (
    <>
      <Header />
      <div className="pt-24">
        {children}
      </div>
    </>
  );
}
