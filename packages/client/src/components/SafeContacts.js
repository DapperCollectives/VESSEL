import React, { useState } from "react";
import { isEmpty } from "lodash";
import ModalHeader from "./ModalHeader";
import InputAddress from "./InputAddress";
import InputText from "./InputText";
import { Copy, Plus } from "./Svg";
import { useClipboard, useContacts } from "../hooks";
import { useModalContext } from "contexts";

function EditContactModal({ contact, onConfirm, confirmText, headerTitle }) {
  const modalContext = useModalContext();
  const [currentAddr, setCurrentAddr] = useState(contact.address);
  const [currentName, setCurrentName] = useState(contact.name);
  const [addressValid, setAddressValid] = useState(Boolean(contact.address));
  const onAddressChange = ({ value, isValid }) => {
    setCurrentAddr(value);
    setAddressValid(isValid);
  };
  const onNameChange = ({ value }) => setCurrentName(value);

  const updateBtnClasses = ["button", "flex-1", "p-4", addressValid ? "is-link" : ""];

  return (
    <div className="py-5 has-text-black">
      <ModalHeader className="px-5 pb-5 border-light-bottom" title={headerTitle} />
      <div className="column is-flex is-flex-direction-column is-full px-5 mt-4">
        <div>
          <p className="has-text-grey">Address<span className="has-text-red">*</span></p>
          <InputAddress 
            value={currentAddr} 
            isValid={addressValid} 
            onChange={onAddressChange} />
        </div>
        <div className="mt-5">
          <p className="has-text-grey">Name</p>
          <InputText
            value={currentName}
            onChange={onNameChange} />
        </div>
      </div>
      <div className="is-flex is-align-items-center mt-5 px-5">
        <button className="button flex-1 p-4 mr-2" onClick={() => modalContext.closeModal()}>
          Cancel
        </button>
        <button
          className={updateBtnClasses.join(" ")}
          onClick={() => {
            if (addressValid) {
              onConfirm({
                address: currentAddr,
                name: currentName,
              });
              modalContext.closeModal();
            }
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}

function RemoveContactModal({ contact, onConfirm, confirmText, headerTitle }) {
  const modalContext = useModalContext();
  return (
    <div className="py-5 has-text-black">
      <ModalHeader className="px-5 pb-5 border-light-bottom" title={headerTitle} />
      <div className="column is-flex is-flex-direction-column is-full px-5 mt-4">
        <p>
          This action will remove {contact.address} {contact.name ? `(${contact.name}) ` : ''}
          from your saved addresses.
        </p>
      </div>
      <div className="is-flex is-align-items-center mt-5 px-5">
        <button className="button flex-1 p-4 mr-2" onClick={() => modalContext.closeModal()}>
          Cancel
        </button>
        <button className="button is-link flex-1 p-4" onClick={() => {
          modalContext.closeModal();
          onConfirm();
        }}>
          {confirmText}
        </button>
      </div>
    </div>
  );
}

function EmptyContacts({ openAddModal }) {
  return (
    <section className="section is-flex is-align-items-center has-background-white-ter mt-4 rounded-lg" style={{ height: "calc(100vh - 340px)" }}>
      <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center has-text-black">
        <h2 className="is-size-5">This safe doesn't have any saved addresses.</h2>
        <button className="button is-link mt-4" onClick={openAddModal}>
          Add Contact <Plus className="ml-2" />
        </button>
      </div>
    </section>
  );
}

function SafeContacts({ address }) {
  const modalContext = useModalContext();
  const clipboard = useClipboard();
  const { contacts, setContact, removeContact } = useContacts(address);

  const minWidth = 120;
  const addressWidth = 160;

  const openAddModal = () => modalContext.openModal(
    <EditContactModal 
      headerTitle="Add Contact"
      confirmText="Add"
      onConfirm={(newContact) => setContact(contacts.length, newContact)}
      contact={{ name: '', address: '' }} 
    />
  );

  const openEditModal = (index, contact) => modalContext.openModal(
    <EditContactModal 
      headerTitle="Edit Contact"
      confirmText="Update"
      onConfirm={(newContact) => setContact(index, newContact)}
      contact={contact} 
    />
  );

  const openRemoveModal = (index, contact) => modalContext.openModal(
    <RemoveContactModal 
      headerTitle="Confirm"
      confirmText="Confirm"
      onConfirm={() => removeContact(index)}
      contact={contact} 
    />
  );

  return (
    <>
      <div className="column p-0 mt-5 is-flex is-align-items-center is-justify-content-space-between is-full">
        <h4 className="is-size-5">Saved Addresses</h4>
        {!isEmpty(contacts) &&
          <button className="button is-link" onClick={openAddModal}>
            Add Contact <Plus className="ml-2" />
          </button>
        }
      </div>
      {isEmpty(contacts) ? <EmptyContacts setContact={setContact} openAddModal={openAddModal} /> : (
        <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
          <div className="is-flex is-align-items-center is-justify-content-space-between column is-full p-5 border-light-bottom">
            <div className="mr-5" style={{ width: addressWidth }}>
              Address
            </div>
            <div className="px-2 mr-6" style={{ width: minWidth }}>
              Name
            </div>
            <div style={{ width: minWidth }}>
              Actions
            </div>
          </div>
          {contacts.map((contact, index) => (
            <div
              className="is-flex is-align-items-center is-justify-content-space-between column is-full p-5 border-light-bottom"
              key={index}
            >
              <div className="mr-5" style={{ width: addressWidth }}>
                <span className="pointer" onClick={() => clipboard.copy(contact.address)} style={{ whiteSpace: "nowrap" }}>
                  {contact.address}
                  <span className="ml-2" style={{ position: 'relative', top: 2 }}>
                    <Copy />
                  </span>
                </span>
              </div>
              <div className="px-2 mr-6" style={{ minWidth }}>
                {contact?.name}
              </div>
              <div className="is-underlined" style={{ width: minWidth }}>
                <span className="mr-5 pointer" onClick={() => openEditModal(index, contact)}>
                  Edit
                </span>
                <span className="mr-5 pointer" onClick={() => openRemoveModal(index, contact)}>
                  Remove
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SafeContacts;
