// components/ProfileAvatar.tsx
import { Link } from "react-router-dom";

interface Props {
  fullName?: string;
}

export default function ProfileAvatar({ fullName }: Props) {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <Link to="/business/profile">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity">
        {initials}
      </div>
    </Link>
  );
}
