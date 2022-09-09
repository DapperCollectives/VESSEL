import React, { useState } from "react";
import { isEmpty } from "lodash";
import InputAddress from "./InputAddress";
import InputText from "./InputText";
import { Copy, Plus } from "./Svg";
import { useClipboard, useContacts } from "../hooks";
import { useModalContext } from "contexts";

function EditContactModal({
  contacts,
  contact,
  onConfirm,
  confirmText,
  closeModal,
}) {
  const [currentAddr, setCurrentAddr] = useState(contact.address);
  const [currentName, setCurrentName] = useState(contact.name);
  const [addressValid, setAddressValid] = useState(Boolean(contact.address));
  const [addressNew, setAddressNew] = useState(true);
  const onAddressChange = ({ value, isValid }) => {
    setCurrentAddr(value);
    setAddressValid(isValid);
    setAddressNew(
      isEmpty(contacts) || contacts.every((c) => c.address !== value)
    );
  };
  const onNameChange = ({ value }) => setCurrentName(value);
  const canConfirm = addressNew && addressValid;
  const updateBtnClasses = [
    "button",
    "flex-1",
    "is-primary",
    canConfirm ? "" : "disabled",
  ];

  return (
    <div className="py-5 has-text-black">
      <div className="column is-flex is-flex-direction-column is-full px-5 py-0">
        <div>
          <p className="has-text-grey">
            Address<span className="has-text-red">*</span>
          </p>
          <InputAddress
            value={currentAddr}
            isValid={addressValid}
            onChange={onAddressChange}
          />
          {!addressNew && (
            <p className="has-text-red mt-2">
              This address has already been added.
            </p>
          )}
        </div>
        <div className="mt-5">
          <p className="has-text-grey">Name</p>
          <InputText value={currentName} onChange={onNameChange} />
        </div>
      </div>
      <div className="is-flex is-align-items-center mt-5 px-5">
        <button className="button is-border flex-1 mr-2" onClick={closeModal}>
          Cancel
        </button>
        <button
          className={updateBtnClasses.join(" ")}
          onClick={() => {
            if (canConfirm) {
              onConfirm({
                address: currentAddr,
                name: currentName,
              });
              closeModal();
            }
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}

function RemoveContactModal({ contact, onConfirm, confirmText, closeModal }) {
  return (
    <div className="py-5 has-text-black">
      <div className="column is-flex is-flex-direction-column is-full px-5 py-0">
        <p>
          This action will remove {contact.address}{" "}
          {contact.name ? `(${contact.name}) ` : ""}
          from your saved addresses.
        </p>
      </div>
      <div className="is-flex is-align-items-center mt-5 px-5">
        <button className="button is-border flex-1 mr-2" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="button is-primary flex-1"
          onClick={() => {
            closeModal();
            onConfirm();
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}

function EmptyContacts({ openAddModal }) {
  return (
    <section
      className="section is-flex is-align-items-center has-background-white-ter mt-4 rounded-lg"
      style={{ height: "calc(100vh - 340px)" }}
    >
      <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center has-text-black">
        <h2 className="is-size-5">
          This safe doesn't have any saved addresses.
        </h2>
        <button
          className="button is-primary mt-4 with-icon"
          onClick={openAddModal}
        >
          Add Contact <Plus />
        </button>
      </div>
    </section>
  );
}

function SafeContacts({ address }) {
  const { openModal, closeModal } = useModalContext();
  const clipboard = useClipboard();
  const { contacts, setContact, removeContact } = useContacts(address);

  const minWidth = 120;
  const addressWidth = 160;

  const openAddModal = () =>
    openModal(
      <EditContactModal
        confirmText="Add"
        onConfirm={(newContact) => setContact(contacts.length, newContact)}
        contacts={contacts}
        contact={{ name: "", address: "" }}
        closeModal={closeModal}
      />,
      {
        headerTitle: "Add Contact",
      }
    );

  const openEditModal = (index, contact) =>
    openModal(
      <EditContactModal
        confirmText="Update"
        onConfirm={(newContact) => setContact(index, newContact)}
        contacts={contacts}
        contact={contact}
        closeModal={closeModal}
      />,
      {
        headerTitle: "Edit Contact",
      }
    );

  const openRemoveModal = (index, contact) =>
    openModal(
      <RemoveContactModal
        confirmText="Confirm"
        onConfirm={() => removeContact(index)}
        contact={contact}
        closeModal={closeModal}
      />,
      {
        headerTitle: "Confirm",
      }
    );

  return (
    <>
      <div className="column p-0 mt-5 is-flex is-align-items-center is-justify-content-space-between is-full">
        <h4 className="is-size-5">Saved Addresses</h4>
        {!isEmpty(contacts) && (
          <button
            className="button is-primary with-icon"
            onClick={openAddModal}
          >
            Add Contact <Plus />
          </button>
        )}
      </div>
      {isEmpty(contacts) ? (
        <EmptyContacts setContact={setContact} openAddModal={openAddModal} />
      ) : (
        <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
          <div className="is-flex is-align-items-center is-justify-content-space-between column is-full p-5 border-light-bottom">
            <div className="flex-2">Address</div>
            <div className="flex-1">Name</div>
            <div className="flex-1">Actions</div>
          </div>
          {contacts.map((contact, index) => (
            <div
              className="is-flex is-align-items-center is-justify-content-space-between column is-full p-5 border-light-bottom"
              key={contact.address}
            >
              <div className="flex-2">
                <span
                  className="pointer"
                  onClick={() => clipboard.copy(contact.address)}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {contact.address}
                  <span
                    className="ml-2"
                    style={{ position: "relative", top: 2 }}
                  >
                    <Copy />
                  </span>
                </span>
              </div>
              <div className="flex-1">{contact?.name}</div>
              <div className="is-flex flex-1">
                <button
                  className="button is-transparent pl-0 pr-3 py-0"
                  onClick={() => openEditModal(index, contact)}
                >
                  Edit
                </button>
                <button
                  className="button is-transparent ml-5 px-5 py-0"
                  onClick={() => openRemoveModal(index, contact)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SafeContacts;
