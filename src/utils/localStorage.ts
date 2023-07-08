enum LocalStorageKeys {
  GlobalStore = "GlobalStore",
}

export function persistGlobalStore(obj: object) {
  try {
    localStorage.setItem(LocalStorageKeys.GlobalStore, JSON.stringify(obj));
  } catch (err) {
    console.error(err);
  }
}

export function resumeGlobalStore() {
  try {
    const raw = localStorage.getItem(LocalStorageKeys.GlobalStore);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
