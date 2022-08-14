export const breakLongHandle = (handle: string) => {
  if (handle.length > 22) {
    const length = handle.length/3;
    return handle.slice(0, length) + " " + handle.slice(length, length * 2) + " " + handle.slice(length * 2);
  }
  if (handle.length > 12) {
    const length = handle.length/2;
    return handle.slice(0, length) + " " + handle.slice(length);
  }

  return handle;
}
