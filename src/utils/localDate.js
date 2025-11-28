export function getLocalISODate() {
  // Use en-CA to get YYYY-MM-DD in the user's local timezone consistently
  return new Date().toLocaleDateString("en-CA");
}

export function getLocalISODateOffset(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString("en-CA");
}

export function isSameLocalDay(dateStringA, dateStringB) {
  if (!dateStringA || !dateStringB) return false;
  return dateStringA === dateStringB;
}

export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
