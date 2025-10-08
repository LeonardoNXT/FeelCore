export function getTime(time: string | undefined) {
  if (!time) return "XX:XX";
  const date = new Date(time);
  if (isNaN(date.getTime())) return "Data inválida";
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  return hours + ":" + minutes;
}
