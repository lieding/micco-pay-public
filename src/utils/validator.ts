export function checkPhoneOrMail(form: string, val: string) {
  if (form === "phone") {
    return /^\d{9,10}$/.test(val) ? "" : "Numéro invalid";
  } else if (form === "mail") {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      val
    )
      ? ""
      : "Adresse mail invalide";
  }
  return "";
}

export function verifyNameInput (form: string, val: string) {
  if (form === 'firstName' || form === 'lastName') {
    const valid = /^[a-zA-Z\s]{2,50}$/.test(val);
    if (valid) return '';
    if (val.length < 2) return '2 lettres minimum';
    else if (val.length > 50) return '50 lettres maximum';
    return 'Nom invalid';
  }
  return '';
}