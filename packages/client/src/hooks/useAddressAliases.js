import { useEffect, useMemo, useReducer } from 'react';
import addressAliasReducer, {
  ADDRESS_ALIAS_INITIAL_STATE,
} from 'reducers/addressAliasReducer';

const storageKey = 'vessel-addresses';

export default function useAddressAliases(address) {
  const [state, dispatch] = useReducer(addressAliasReducer, [], (initial) => ({
    ...initial,
    ...ADDRESS_ALIAS_INITIAL_STATE,
    contacts: JSON.parse(localStorage.getItem(storageKey) || '{}'),
  }));

  const addressAliases = useMemo(
    () => state.addressAliases ?? {},
    [state.addressAliases]
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(addressAliases));
  }, [addressAliases]);

  const setAddressAlias = (addr, name) => {
    dispatch({
      type: 'SET_ADDRESS_ALIAS',
      payload: {
        [addr]: name,
      },
    });
  };

  const removeAddressAlias = (addr) => {
    dispatch({
      type: 'REMOVE_ADDRESS_ALIAS',
      payload: addr,
    });
  };

  return {
    contacts: state.contacts?.[address] ?? [],
    setAddressAlias,
    removeAddressAlias,
  };
}
