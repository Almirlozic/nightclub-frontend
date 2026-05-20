import Header from "@/components/Header";

export default function PagesLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
