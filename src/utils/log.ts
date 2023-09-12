import { IS_PROD, BASE_URL } from '../consts'

const STORAGE_DEVICE_ID_KEY = 'DEVICE_ID';

function createChar () {
  const start = Math.random() > .5 ? 65 : 97;
  const num = Math.floor(Math.random() * 25);
  return String.fromCharCode(start + num);
}

function getDeviceID () {
  let deviceID = localStorage.getItem(STORAGE_DEVICE_ID_KEY);
  if (!deviceID) {
    deviceID = Date.now().toString() + new Array(4).fill(0).map(createChar).join('');
    localStorage.setItem(STORAGE_DEVICE_ID_KEY, deviceID);
  }
  return deviceID;
}

export function submitErrLog (stack: unknown) {
  if (!IS_PROD) return;
  const deviceID = getDeviceID();
  try {
    fetch(`${BASE_URL}/save-err-log`, {
      method: "POST",
      body: JSON.stringify({ deviceID, stack }),
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error(err)
  }
}