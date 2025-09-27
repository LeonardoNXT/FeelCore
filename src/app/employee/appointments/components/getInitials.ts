export const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "";

  const firstInitial = parts[0][0] || "";
  const lastInitial = parts[parts.length - 1][0] || "";

  return (firstInitial + lastInitial).toUpperCase();
};
