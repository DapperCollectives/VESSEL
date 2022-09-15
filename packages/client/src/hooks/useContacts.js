import { useEffect, useReducer, useMemo } from "react";
import contactReducer, { CONTACT_INITIAL_STATE } from "reducers/contactReducer";

const storageKey = "vessel-contacts";

export default function useContacts(address) {
  const [state, dispatch] = useReducer(contactReducer, [], (initial) => ({
    ...initial,
    ...CONTACT_INITIAL_STATE,
    contacts: JSON.parse(localStorage.getItem(storageKey) || "{}"),
  }));

  const contacts = useMemo(() => state.contacts ?? {}, [state.contacts]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(contacts));
  }, [contacts]);

  const setContact = (index, newContact) => {
    dispatch({
      type: "SET_CONTACT",
      payload: {
        [address]: { index, newContact },
      },
    });
  };

  const removeContact = (index) => {
    dispatch({
      type: "REMOVE_CONTACT",
      payload: {
        [address]: { index },
      },
    });
  };

  return {
    contacts: state.contacts?.[address] ?? [],
    setContact,
    removeContact,
  };
}
