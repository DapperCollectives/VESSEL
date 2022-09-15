/*
 * contacts is an object of { <treasury address>: [contact objects] }
 * where each contact object has { name: <string>, address: <string> }
 */
export const CONTACT_INITIAL_STATE = {
  contacts: {},
};

const contactReducer = (state, action) => {
  const address = Object.keys(action.payload)[0];
  const body = action.payload[address];
  const treasuryContacts = (state.contacts?.[address] ?? []).slice(0);

  switch (action.type) {
    case "SET_CONTACT": {
      const { index, newContact } = body;
      treasuryContacts[index] = newContact;

      return {
        ...state,
        contacts: {
          ...state.contacts,
          [address]: treasuryContacts,
        },
      };
    }
    case "REMOVE_CONTACT": {
      const { index } = body;
      treasuryContacts.splice(index, 1);

      return {
        ...state,
        contacts: {
          ...state.contacts,
          [address]: treasuryContacts,
        },
      };
    }
    default:
      throw new Error();
  }
};

export default contactReducer;
