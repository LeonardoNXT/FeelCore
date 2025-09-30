function useGetHours(time: string | null) {
  if (!time) return;
  const date = new Date(time);
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  return hours + ":" + minutes;
}

export default useGetHours;
