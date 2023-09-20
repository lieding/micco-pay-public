import { useCallback, useEffect, useRef, useState } from "react";
import { SearchBar } from '../../components';
import { useQueryMebuByLabelQuery } from '../../store/api';
import { useDispatch } from "react-redux";
import { toggleSearch } from "../../store/menu";
import { Toast } from 'react-vant';

interface ISearchComp {
  restaurantId: string
  activeKw: string
}

const SearchCntThreshold = 3;
const SearCntInterval = 30 * 1000;

function SearchComp ({ restaurantId, activeKw }: ISearchComp) {
  const dispatch = useDispatch();
  const [ keyword, setKeyword ] = useState('');
  const searchCntRef = useRef<number>(0);
  const cbk = useCallback((kw: string) => {
    if (!kw.length) return setKeyword('');
    if (kw?.length < 2) return;
    if (searchCntRef.current >= SearchCntThreshold)
      return Toast.info("Vous opérez trop souvent !");
    searchCntRef.current++;
    setKeyword(kw);
  }, []);
  useEffect(() => {
    dispatch(toggleSearch({ activeKw: keyword }));
  }, [keyword]);
  useEffect(() => {
    const id = setInterval(() => searchCntRef.current = 0, SearCntInterval);
    return () => clearInterval(id);
  }, []);
  const skip = !keyword || keyword === activeKw;
  useQueryMebuByLabelQuery(
    { restaurantId, keyword },
    { skip }
  );

  return <SearchBar cbk={cbk} />;
}

export default SearchComp;