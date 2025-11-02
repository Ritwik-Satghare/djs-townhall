export const getToken = () => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  return cookie ? cookie.split("=")[1] : null;
};

