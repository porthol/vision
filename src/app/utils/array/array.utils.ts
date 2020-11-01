export function findIndex(arr: [], fnc: (e: any) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    const res = fnc(arr[i]);
    if (res) {
      return i;
    }
  }
  return -1;
}
