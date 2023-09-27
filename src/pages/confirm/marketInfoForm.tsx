import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatetimePicker, Empty, Picker } from 'react-vant';
import { DateTimeUtils, debounce, isValidArray } from '../../utils';
import { LocationIcon } from '../../components/icons';
import styles from './index.module.scss';
import cls from 'classnames';
import { LocationResOption, queryLocation } from './helper';
import { BottomPopup } from '../../components/core';
import { CalendarIcon, ClockIcon } from '../../components/icons';
import CustomInput from '../../components/customInput';
import { RequestStatusEnum } from '../../typing';

const TimeRangeConfig = [
  { value: 'ALL_DAY', text: "9:00 ~ 18:00" },
  { value: 'ALL_MORN', text: "9:00 ~ 12:00" },
  { value: 'ALL_AFTER', text: "13:00 ~ 18:00" },
  { value: 'ALL_NIGHT', text: "18:00 ~ 22:00" },
  { value: 'MORN_1', text: "9:00 ~ 10:30" },
  { value: "MORN_2", text: "10:30 ~ 12:00" },
  { value: 'AFTN_1', text: "13:00 ~ 15:00" },
  { value: 'AFTN_2', text: "15:00 ~ 17:00" },
  { value: 'AFTN_3', text: "17:00 ~ 19:00" },
  { value: 'NIG_1', text: "19:00 ~ 22:00" }
]

function LocationSelectionPopup ({ visible, toggleClose, locationSelect }: {
  visible: boolean,
  toggleClose: () => void
  locationSelect: (location: LocationResOption) => void
}) {
  // const [input, setInput] = useState('');
  const [reqStatus, setReqStatus] = useState(RequestStatusEnum.INIT);
  const [options, setOptions] = useState<LocationResOption[] | null>([]);
  const debouncedCbk = useMemo(() => debounce((kw: string) => {
    if (kw.length < 3) return;
    setReqStatus(RequestStatusEnum.LOADING);
    queryLocation(kw)
      .then(res => { setOptions(res); setReqStatus(RequestStatusEnum.RESOLVED) })
      .catch(() => setReqStatus(RequestStatusEnum.REJECTED));
  }, 1200), []);
  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    // setInput(val);
    debouncedCbk(val);
  }, []);

  useEffect(() => {
    if (visible) {
      setOptions([]);
      setReqStatus(RequestStatusEnum.INIT);
    }
  }, [visible]);

  let content = <Empty />;
  switch (reqStatus) {
    case RequestStatusEnum.LOADING:
      content = <div>Chargement en cours...</div>;
      break;
    case RequestStatusEnum.RESOLVED:
      content = <ul className={styles.locationOptions}>
        {
          options?.map(item =>
            <li
              key={item.id}
              className={styles.locationItem}
              onClick={() => locationSelect(item)}
            >
              <span>{ item.label }</span>
              <span className={styles.context}>{ item.context }</span>
            </li>
          )
        }
      </ul>
      break;
    case RequestStatusEnum.REJECTED:
      content = <Empty image="error" />
      break;
  }

  return <BottomPopup visible={visible} toggleClose={toggleClose}>
    <div className={cls(styles.title, 'textAlign')}>Rechercher lieu de livraison</div>
    <CustomInput onChange={onChange} />
    { content }
  </BottomPopup>;
}

export default function MarketInfoForm () {
  const [ date , setDate ] = useState(new Date());
  const [ timeRangeKey, setTimeRangeKey ] = useState(TimeRangeConfig[0].value);
  const [ locationInfo, setLocationInfo ] = useState<LocationResOption | null>(null);
  const [ locationExtra, setLocationExtra ] = useState('');
  const [ popupVis, setPopupVis ] = useState(false);
  const locationSelect = (info: LocationResOption) => {
    setLocationInfo(info);
    setPopupVis(false);
  }
  
  const { maxDate, nowDate, getText } = useMemo(() => {
    const nowDate = new Date();
    const maxDate = DateTimeUtils.deltaDays(nowDate);
    const getText = (selected: string) => TimeRangeConfig
      .find(({ value }) => value === selected)?.text;
    return { maxDate, nowDate, getText };
  }, []);

  return (
    <>
      <div className={cls(styles.title)}>
        L'information de livraison
      </div>
      <div className={cls('flex-between', styles.datetimeInputWrapper)}>
        <DatetimePicker
          type='month-day'
          minDate={nowDate}
          maxDate={maxDate}
          value={date}
          onConfirm={setDate}
          popup={{ round: true }}
          title="Quel jour"
          confirmButtonText="Confirmer"
          cancelButtonText="Annuler"
        >
          {(val: Date, _: any, actions: { open: () => void }) =>
            <span className={cls(styles.innerSpan, styles.inputWrapper, 'flex-between')} onClick={actions.open}>
              <CalendarIcon />
              { DateTimeUtils.formatDate(val) }
            </span>
          }
        </DatetimePicker>
        <Picker
          value={timeRangeKey}
          title="À Quel Heure"
          confirmButtonText="Confirmer"
          cancelButtonText="Annuler"
          columns={TimeRangeConfig}
          onConfirm={setTimeRangeKey}
          placeholder={null}
          popup={{ round: true }}
        >
          {(val: string | string[], _: any, actions: { open: () => void }) =>
            <span className={cls(styles.innerSpan, styles.inputWrapper, 'flex-between')} onClick={actions.open}>
              <ClockIcon stroke='#7842EB' />
              { isValidArray(val) ? val.join(', ') : getText(val.toString()) }
            </span>
          }
        </Picker>
      </div>
      <div
        onClick={() => setPopupVis(true)}
        className={cls('flex-between', styles.locationItem, styles.inputWrapper, styles.locationInfo)}
      >
        <LocationIcon />
        <div>
          <span>{ locationInfo?.label ?? "Lieu de livraison" }</span>
          <span className={styles.context}>{ locationInfo?.context }</span>
        </div>
      </div>
      <div className={styles.locationExtraInfo}>
        <CustomInput
          placeholder="Chambre, Bâtiment, Numéro"
          onChange={ev => setLocationExtra(ev.target.value)}
        />
      </div>
      <div className={cls(styles.title, styles.extraInfoWrapper)}>
        <textarea
          placeholder="L'information supplémentaire"
          className={cls(styles.extraInput, styles.inputWrapper)}
        />
      </div>
      <LocationSelectionPopup
        visible={popupVis}
        toggleClose={() => setPopupVis(false)}
        locationSelect={locationSelect}
      />
    </>
  );
}