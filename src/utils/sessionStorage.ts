const RestConfigStorageKey = "REST_CONFIG_STORAGE_KEY";

export function saveRestConfig (data: {}) {
  sessionStorage.setItem(RestConfigStorageKey, JSON.stringify(data));
}

export function loadRestConfig () {
  try {
    const rawStr = sessionStorage.getItem(RestConfigStorageKey);
    if (!rawStr) return null;
    return JSON.parse(rawStr);
  } catch (err) {
    return null;
  }
} 