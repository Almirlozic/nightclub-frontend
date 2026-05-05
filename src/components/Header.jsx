import Link from "next/link";

const Header = () => {
  return (
    <header className="relative flex justify-around items-center border border-(--color-brand) py-6 overflow-hidden header-corners">
      <div>
        <p className="text-(--color-text) text-3xl font-bold">
          NIGHT<span className="text-(--color-brand) font-bold">CLUB</span>
        </p>
        <span className="text-(--color-text) text-xs tracking-[4px]">HAVE A GOOD TIME</span>
      </div>
      <nav>
        <ul className="text-(--color-text) font-bold flex gap-10">
          <Link href="/">HOME</Link>
          <Link href="/">EVENTS</Link>
          <Link href="/">BOOK TABLE</Link>
          <Link href="/">CONTACT US</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
