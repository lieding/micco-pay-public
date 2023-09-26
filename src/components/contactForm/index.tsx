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
import { FullWidthBtn } from "../";
import { InputValidtors } from '../../utils';
import { BottomPopup } from '../core';

type KeyofContactType = keyof Contact;

function checkInputItem(name: string, str: string) {
  if (!str) return "Obligatoire";
  return InputValidtors.checkPhoneOrMail(name, str) ||
    InputValidtors.verifyNameInput(name, str);
}

function checkValidity(
  form: Contact,
  setValities: React.Dispatch<React.SetStateAction<{}>>,
  checkFormItems?: KeyofContactType[]
) {
  const validities = {} as Contact;
  for (const key in form) {
    const keyy = key as KeyofContactType;
    if (checkFormItems?.length && !checkFormItems.includes(keyy)) continue;
    const validity = checkInputItem(key, form[keyy]);
    validity && (validities[keyy] = validity);
  }
  setValities(validities);
  return Object.keys(validities).length < 1;
}

interface ICOntactForm {
  visible: boolean;
  next: () => void;
  toggleClose: () => void;
  initialContact: Contact;
}

interface IFormContent {
  cbk: (e: React.ChangeEvent<HTMLInputElement>, formName?: string) => void;
  validities: Record<string, string>;
  form: Contact;
}

function Second({ cbk, validities, form, phoneRequired }:
  IFormContent & {
    phoneRequired?: boolean
  }
) {
  return (
    <div className={cls(styles.row, styles.second)}>
      <CustomInput
        prefix={<PhoneIcon />}
        placeholder="06 12 34 56 78"
        onChange={cbk}
        name="phone"
        validities={validities}
        value={form.phone}
      />
      {
        phoneRequired ?
        <CustomInput
          prefix={<MailIcon />}
          placeholder="Email"
          onChange={cbk}
          name="mail"
          validities={validities}
          value={form.mail}
        /> : null
      }
    </div>
  );
}

function First({ cbk, validities, form, nameRequired }: IFormContent & { nameRequired?: boolean }) {
  return (
    <>
      {
        nameRequired ? <div className={cls(styles.imgWrapper, "textAlign")}>
          <img src="cardName.png" alt="" />
        </div> : null
      }
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
  );
}

function useContactFormHook (
  initialContact: Contact,
  visible: boolean,
  next: Function,
  ref: any,
  formsNeedCheck?: KeyofContactType[]
) {
  const [contactForm, setForm] = useState<Contact>(() => ({ ...initialContact }));
  const [pageIdx, setPageIdx] = useState(0);
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
      setValities((validities) => ({ ...validities, [formName]: validity }));
      dispatch(setContact({ [formName]: val }));
    },
    [dispatch, setForm, setValities]
  );
  useImperativeHandle(
    ref,
    () => ({
      checkValidity() {
        return checkValidity(contactForm, setValities, formsNeedCheck);
      },
    }),
    [setValities, contactForm]
  );
  const btnClickHandler = () => {
    const formsNeedCheck: KeyofContactType[] = pageIdx
      ? ["phone", "mail"]
      : ["firstName", "lastName"];
    const valid = checkValidity(contactForm, setValities, formsNeedCheck);
    if (!valid) return;
    if (pageIdx) next();
    else setPageIdx(1);
  };
  return {
    contactForm,
    validities,
    pageIdx,
    formRef,
    btnClickHandler,
    formChangeHandler,
    setValities
  }
}

function ContactForm(
  {
    visible,
    next,
    toggleClose,
    initialContact,
  }: ICOntactForm,
  ref: any
) {
  const {
    pageIdx,
    validities,
    contactForm,
    formChangeHandler,
    formRef,
    btnClickHandler
  } = useContactFormHook(initialContact, visible, next, ref);
  const title =
    pageIdx === 0
      ? "Quel est le Nom et Prénom figure sur votre carte bancaire?"
      : "Quel est votre email et numéro de téléphone pour recevoir la preuve de paiment?";
  const Comp = pageIdx ? Second : First;
  const formContent = (
    <Comp validities={validities} cbk={formChangeHandler} form={contactForm} />
  );

  return <BottomPopup visible={visible} toggleClose={toggleClose} height="425px">
    <>
      <div className={cls(styles.title, "textAlign")}>{title}</div>
      <form
        className={styles.contactForm}
        noValidate
        ref={(el) => (formRef.current = el)}
      >
        {formContent}
      </form>
      <FullWidthBtn cbk={btnClickHandler}>
        <span>Continue</span>
      </FullWidthBtn>
    </>
  </BottomPopup>
}

function InOnePage(
  {
    visible,
    next,
    toggleClose,
    initialContact,
    nameRequired,
    phoneRequired,
  }: ICOntactForm & { nameRequired: boolean, phoneRequired?: boolean },
  ref: any
) {
  const formsNeedCheck: KeyofContactType[] = ["firstName", "lastName", "mail"];
  if (phoneRequired)
    formsNeedCheck.push('phone');
  const {
    validities,
    contactForm,
    formChangeHandler,
    formRef,
    setValities
  } = useContactFormHook(initialContact, visible, next, ref, formsNeedCheck);

  const btnClickHandler = () => {
    const valid = checkValidity(contactForm, setValities, formsNeedCheck);
    if (!valid) return;
    next();
  };

  const title = (<div className={cls(styles.title, "textAlign")}>
    {
      nameRequired ? "Quel est le Nom et Prénom figure sur votre carte bancaire?" :
        "Vos coordonnées pour recevoir la notification de paiement?"
    }
  </div>);
  
  return <BottomPopup visible={visible} toggleClose={toggleClose}>
    <>
      { title }
      <form
        className={styles.contactForm}
        noValidate
        ref={(el) => (formRef.current = el)}
      >
        <>
          <First form={contactForm} validities={validities} nameRequired={nameRequired} cbk={formChangeHandler} />
          <div className={styles.divider}></div>
          <Second cbk={formChangeHandler} form={contactForm} validities={validities} phoneRequired={phoneRequired} />
          <div className={styles.dividerBottom}></div>
        </>
      </form>
      <FullWidthBtn cbk={btnClickHandler}>
        <span>Continue</span>
      </FullWidthBtn>
    </>
  </BottomPopup>
}

export const InOnePageForm = forwardRef(InOnePage)

export default forwardRef(ContactForm);
