// from https://stackoverflow.com/a/48800/1754819
export function isValidEmail (email: string) {
  const regex = /^\S+@\S+\.\S{2,}$/;
  return regex.test(email);
};
