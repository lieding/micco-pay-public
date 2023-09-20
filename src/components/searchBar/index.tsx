import styles from './index.module.scss';
import cls from 'classnames';
import { SearchIcon, FailIcon } from '../icons';
import { debounce } from '../../utils'
import { useCallback, useMemo, useState } from 'react';

interface ISearchBar {
  cbk: (kw: string) => void
  debounceTime?: number 
}

function SearchBar ({ cbk, debounceTime = 1200 }: ISearchBar) {
  const [input, setInput] = useState('');
  const debouncedCbk = useMemo(() => debounce(cbk, debounceTime), []);
  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    setInput(val);
    debouncedCbk(val);
  }, []);

  return <div className={cls('flex-center', styles.searchBar)}>
    <SearchIcon />
    <input onChange={onChange} type="text" value={input} />
    { input?.length ? <FailIcon onClick={() => { setInput('');cbk(''); }} /> : null }
  </div>
}

export default SearchBar;