import { useEffect, useMemo, useReducer } from 'react';
import addressAliasReducer, {
  ADDRESS_ALIAS_INITIAL_STATE,
} from 'reducers/addressAliasReducer';

const storageKey = 'vessel-addresses';
const treasuryStorageKey = 'vessel-treasuries';

export default function useAddressAliases() {
  const [state, dispatch] = useReducer(addressAliasReducer, [], (initial) => ({
    ...initial,
    ...ADDRESS_ALIAS_INITIAL_STATE,
    addressAliases: JSON.parse(localStorage.getItem(storageKey) || '{}'),
    treasuryAliases: JSON.parse(
      localStorage.getItem(treasuryStorageKey) || '{}'
    ),
  }));

  const addressAliases = useMemo(
    () => state.addressAliases ?? {},
    [state.addressAliases]
  );

  const treasuryAliases = useMemo(
    () => state.treasuryAliases ?? {},
    [state.treasuryAliases]
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(addressAliases));
  }, [addressAliases]);

  useEffect(() => {
    localStorage.setItem(treasuryStorageKey, JSON.stringify(treasuryAliases));
  }, [treasuryAliases]);

  const setTreasuryAlias = (addr, name) => {
    dispatch({
      type: 'SET_TREASURY_ALIAS',
      payload: {
        [addr]: name,
      },
    });
  };

  const setAddressAlias = (addr, name) => {
    console.log('set address alias!', addr, name);
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
    addressAliases: JSON.parse(localStorage.getItem(storageKey)) ?? {},
    treasuryAliases: JSON.parse(localStorage.getItem(treasuryStorageKey)) ?? {},
    setAddressAlias,
    removeAddressAlias,
    setTreasuryAlias,
  };
}
