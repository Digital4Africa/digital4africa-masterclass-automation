// src/utils/formatDate.js

export const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
