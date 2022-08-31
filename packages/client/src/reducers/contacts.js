export const INITIAL_STATE = {
  contacts: {},
};

const reducer = (state, action) => {
  const address = Object.keys(action.payload)[0];
  const body = action.payload[address];
  const newContacts = (state.contacts?.[address] ?? []).slice(0);

  switch (action.type) {
    case "SET_CONTACT": {
      const { index, newContact } = body;
      newContacts[index] = newContact;

      return {
        ...state,
        contacts: {
          ...state.contacts,
          [address]: newContacts,
        },
      };
    }
    case "REMOVE_CONTACT": {
      const { index } = body;
      newContacts.splice(index, 1);

      return {
        ...state,
        contacts: {
          ...state.contacts,
          [address]: newContacts,
        },
      };
    }
    default:
      throw new Error();
  }
};

export default reducer;
