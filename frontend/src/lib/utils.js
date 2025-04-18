export const formatMessageTime = (date) => {
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return new Date(date).toLocaleTimeString("en-US", options);
};
