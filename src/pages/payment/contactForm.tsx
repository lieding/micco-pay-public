import {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch } from "react-redux";
import CustomInput from "../../components/customInput";
import styles from "./index.module.scss";
import { UserIcon, MailIcon, PhoneIcon } from "../../components/icons";
import { setContact } from "../../store/ordering";
import cls from "classnames";
import type { Contact } from "../../typing";

function checkPhoneOrMail(form: string, val: string) {
  if (form === "phone") {
    return /^\d{9,10}$/.test(val) ? "" : "invalide";
  } else if (form === "mail") {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      val
    )
      ? ""
      : "invalide";
  }
  return "";
}

function checkInput(form: Contact) {
  let obj: Record<string, string> = {};
  for (const key in form) {
    const keyy = key as keyof Contact;
    if (!form[keyy]) {
      obj[key] = "il faut pas être vide";
    } else {
      obj[key] = checkPhoneOrMail(keyy, form[keyy]);
    }
  }
  return obj;
}

function ContactForm(_: object, ref: any) {
  const [, setForm] = useState({ name: "", phone: "", mail: "" });
  const [validities, setValities] = useState({});
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement | null>(null);
  const cbk = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, formName?: string) => {
      if (!formName) return;
      const obj = { [formName]: e.currentTarget.value } as Record<
        keyof Contact,
        string
      >;
      dispatch(setContact(obj));
      setForm((state) => ({ ...state, ...obj }));
    },
    [dispatch, setForm]
  );
  useImperativeHandle(
    ref,
    () => ({
      checkValidity() {
        const el = formRef.current;
        if (!el) return;
        let contact = {} as Contact;
        setForm((form) => {
          contact = { ...form };
          return form;
        });
        const validities = checkInput(contact);
        setValities(validities);
        return Object.keys(validities).length < 1;
      },
    }),
    [formRef, setValities, setForm]
  );
  return (
    <form
      className={styles.contactForm}
      noValidate
      ref={(el) => (formRef.current = el)}
    >
      <div className={styles.title}>Coordonnées</div>
      <div className={cls(styles.row, styles.firstRow)}>
        <CustomInput
          prefix={<UserIcon />}
          placeholder="Prénom"
          onChange={cbk}
          name="name"
          validities={validities}
        />
        <CustomInput
          prefix={<PhoneIcon />}
          placeholder="06 12 34 56 78"
          onChange={cbk}
          name="phone"
          validities={validities}
        />
      </div>
      <div className={styles.row}>
        <CustomInput
          prefix={<MailIcon />}
          placeholder="Email"
          onChange={cbk}
          name="mail"
          validities={validities}
        />
      </div>
    </form>
  );
}

export default forwardRef(ContactForm);
