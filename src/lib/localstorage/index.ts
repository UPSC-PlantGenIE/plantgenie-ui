export const localStorageParser: {
  <T>(key: string): T | null;
  <T>(key: string, defaultValue: T): T;
} = <T>(key: string, defaultValue?: T): T | null => {
  const item = localStorage.getItem(key);
  return item
    ? (JSON.parse(item) as T)
    : defaultValue !== undefined
    ? defaultValue
    : null;
};
