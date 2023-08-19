import {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";
import CustomInput from "../../components/customInput";
import styles from "./index.module.scss";
import { UserIcon, MailIcon, PhoneIcon } from "../../components/icons";
import { setContact } from "../../store/ordering";
import cls from "classnames";
import type { Contact } from "../../typing";
import { createPortal } from "react-dom";
import { CloseIcon } from '../icons'
import { FullWidthBtn } from '../'

type KeyofContactType = keyof Contact

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

function checkInputItem (name: string, str: string) {
  if (!str) return 'il faut pas être vide';
  return checkPhoneOrMail(name, str);
}

function checkValidity (
  form: Contact,
  setValities: React.Dispatch<React.SetStateAction<{}>>,
  checkFormItems?: KeyofContactType[],
) {
  const validities = {} as Contact;
  for (const key in form) {
    const keyy = key as KeyofContactType;
    if (checkFormItems?.length && !checkFormItems.includes(keyy))
      continue;
    const validity = checkInputItem(key, form[keyy]);
    validity && (validities[keyy] = validity); 
  }
  setValities(validities);
  return Object.keys(validities).length < 1;
}

interface IFormContent {
  cbk: (e: React.ChangeEvent<HTMLInputElement>, formName?: string) => void
  validities: Record<string, string>
  form: Contact
}

function Second ({ cbk, validities, form }: IFormContent) {
  return <div className={cls(styles.row, styles.second)}>
    <CustomInput
      prefix={<PhoneIcon />}
      placeholder="06 12 34 56 78"
      onChange={cbk}
      name="phone"
      validities={validities}
      value={form.phone}
    />
    <CustomInput
      prefix={<MailIcon />}
      placeholder="Email"
      onChange={cbk}
      name="mail"
      validities={validities}
      value={form.mail}
    />
  </div>
}

function First ({ cbk, validities, form }: IFormContent) {
  return <>
    <div className={cls(styles.imgWrapper, 'textAlign')}>
      <img src="cardName.png" alt="" />
    </div>
    <div className={cls(styles.row, styles.first)}>
      <CustomInput
        prefix={<UserIcon />}
        placeholder="Prénom"
        onChange={cbk}
        name="firstName"
        validities={validities}
        value={form.firstName}
      />
      <CustomInput
        prefix={<UserIcon />}
        placeholder="Nom"
        onChange={cbk}
        name="lastName"
        validities={validities}
        value={form.lastName}
      />
    </div>
  </>
}

function ContactForm({ visible, next, toggleClose }: {
  visible: boolean
  next: () => void
  toggleClose: () => void
}, ref: any) {
  const [ contactForm, setForm ] = useState<Contact>({ firstName: "", phone: "", mail: "", lastName: "" });
  const [ pageIdx, setPageIdx ] = useState(0);
  const [validities, setValities] = useState({});
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => setPageIdx(0), [visible]);
  const formChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, formName?: string) => {
      if (!formName) return;
      const val = e.currentTarget.value;
      setForm((state) => ({ ...state, [formName]: val }));
      const validity = checkInputItem(formName, val);
      setValities(validities => ({ ...validities, [formName]: validity }));
      dispatch(setContact({ [formName]: val }));
    },
    [dispatch, setForm, setValities]
  );
  useImperativeHandle(
    ref,
    () => ({
      checkValidity() { return checkValidity(contactForm, setValities); },
    }),
    [setValities, contactForm]
  );
  const btnClickHandler = () => {
    const formsNeedCheck: KeyofContactType[] =
      pageIdx ? ['phone', 'mail'] : ['firstName', 'lastName']
    const valid = checkValidity(contactForm, setValities, formsNeedCheck);
    if (!valid) return;
    if (pageIdx)
      next();
    else
      setPageIdx(1);  
  }
  const title = pageIdx === 0 ? "Quel est le Nom et Prénom figure sur votre carte bancaire?"
    : "Quel est votre email et numéro de téléphone pour recevoir la preuve de paiment?";
  const Comp = pageIdx ? Second : First;
  const formContent = <Comp validities={validities} cbk={formChangeHandler} form={contactForm} />;
  
  return createPortal(
    <>
      { visible && <div className="curtain"></div> }
      <div className={cls(styles.wrapper, visible ? styles.visible : null)}>
        <div className={styles.close}><CloseIcon onClick={toggleClose} /></div>
        <div className={cls(styles.title, 'textAlign')}>{ title }</div>
        <form
          className={styles.contactForm}
          noValidate
          ref={(el) => (formRef.current = el)}
        >
          { formContent }
        </form>
        <FullWidthBtn cbk={btnClickHandler}>
          <span>Continuer</span>
        </FullWidthBtn>
      </div>
    </>,
    document.body
  );
}

export default forwardRef(ContactForm);
