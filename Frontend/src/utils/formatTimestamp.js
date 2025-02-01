export function formatTimestamp(timestamp) {
  if (!timestamp) return "N/A"; // Handle null or undefined values

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date values

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}
