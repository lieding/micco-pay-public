import { useCallback, useState } from 'react';
import { StarIcon, PositiveEmoji, NegativeEmoji, NeutralEmoji } from '../../components/icons';
import { FullWidthBtn } from '../../components'
import styles from './index.module.scss';
import cls from 'classnames';
import { RootState } from '../../store';
import { RequestStatusEnum } from '../../typing';

type OnActive = (idx: number, activeIdx: number) => { [idx: string]: any };

function Rate ({ onActive, cbk, rate }: {
  onActive: OnActive
  cbk: (idx: number) => void
  rate: number
}) {
  return <>
    {
      new Array(5).fill(null).map((_, idx) =>
        <StarIcon key={idx} onClick={() => cbk(idx)} {...onActive(idx, rate)} />
      )
    }
  </>;
}

const Titles = [
  'plats et boissons',
  'service',
  "l'ambiance",
  'rapport qualité-prix'
]

function SubRateItem ({ rate, idx, setRate }: {
  rate: number,
  idx: number,
  setRate: React.Dispatch<React.SetStateAction<number[]>>
}) {
  const cbk = useCallback((idx: number, rate: number) => setRate(rates => {
    rates[idx] = rate + 1;
    return rates.slice();
  }), [setRate]);

  return <div className={cls('flex-between', styles.subRateItem)}>
    <span>{ Titles[idx] }</span>
    <span>
    {
      new Array(5).fill(null).map((_, idxx) => {
        const active = idxx < rate;
        const Icon = active ? rate > 2 ? PositiveEmoji : NegativeEmoji : NeutralEmoji;
        const fill = active ? getFill(rate) : '';
        return <Icon key={idxx} onClick={() => cbk(idx, idxx)} fill={fill} />
      })
    }
    </span>
  </div>
}

interface IReview {
  restInfo: RootState['restaurant']['restInfo']
}

function Review ({ restInfo }: IReview) {
  const [rate, setRate] = useState(0);
  const cbk = useCallback((idx: number) => setRate(idx + 1), []);
  const [subRates, setSubRates] = useState([0, 0, 0, 0]);
  const [ submitStatus, setSubmitStatus ] = useState(RequestStatusEnum.INIT);
  const btnClickHandler = () => {
    setSubmitStatus(RequestStatusEnum.RESOLVED);
  }

  const title = rate ? (
    <div className={cls(styles.title, 'textAlign')}>Merci d’avoir partagé votre avis</div>
  ) : (<>
    <div className={cls(styles.title, 'textAlign')}>Partagez votre expérience au</div>
    <div className={cls(styles.title, 'textAlign')}>{ restInfo?.displayName }</div>
  </>);

  return (
    <div className={styles.review}>
      { title }
      <div className={cls('textAlign', styles.startIcons)}>
        <Rate rate={rate} cbk={cbk} onActive={starIconOnActive} />
      </div>
      <div className={cls('textAlign', styles.subrateTitle)}>
        Comment évalueriez-vous:
      </div>
      <div className={styles.subRates}>
        {
          subRates.map((rate, idx) =>
            <SubRateItem key={idx} rate={rate} idx={idx} setRate={setSubRates} />
          )
        }
      </div>
      {
        submitStatus === RequestStatusEnum.INIT ?
        <FullWidthBtn disabled={!rate} cbk={btnClickHandler}>
          <span>Envoyer</span>
        </FullWidthBtn> : null
      }
    </div>
  );
}

export default Review;

function getFill (rate: number) {
  return rate > 3 ? '#60AD66' : rate > 1 ? '#F3B81A' : '#CA0000'
}

function starIconOnActive (idx: number, actIdx: number) {
  if (idx < actIdx) {
    return { fill: getFill(actIdx) };
  }
  return {};
}