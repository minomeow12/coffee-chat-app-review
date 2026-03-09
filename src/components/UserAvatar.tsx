const COLORS = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
];

export function UserAvatar({
  userId,
  label,
  color,
  size = 10,
}: {
  userId?: string;
  label?: string;
  color?: number | string;
  size?: number;
}) {
  // ✅ Only source of image is localStorage (your own device)
  const localAvatar = userId
    ? localStorage.getItem(`meowclub_avatar_${userId}`)
    : null;

  const colorIndex =
    typeof color === "string" ? parseInt(color) || 0 : (color ?? 0);

  if (localAvatar) {
    return (
      <img
        src={localAvatar}
        alt={label ?? "avatar"}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size * 4, height: size * 4 }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-medium flex-shrink-0 text-sm ${
        COLORS[colorIndex] ?? "bg-gray-400"
      }`}
      style={{ width: size * 4, height: size * 4 }}
    >
      {label?.charAt(0).toUpperCase()}
    </div>
  );
}
