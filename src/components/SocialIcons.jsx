import {
  CiInstagram,
  CiFacebook,
} from "react-icons/ci";
import { FaSnapchat } from "react-icons/fa6";

const icons = [
  { label: "Facebook", Icon: CiFacebook },
  { label: "Snapchat", Icon: FaSnapchat },
  { label: "Instagram", Icon: CiInstagram },
];

const SocialIcons = () => {
  return (
    <div className="flex gap-3">
      {icons.map(({ label, Icon }) => (
        <a
          key={label}
          href="#"
          aria-label={label}
          className="w-11 h-11 border border-white bg-black flex items-center justify-center hover:border-(--color-brand) hover:text-(--color-brand) transition-colors"
        >
          <Icon size={20} />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
