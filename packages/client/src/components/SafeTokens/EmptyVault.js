const EmptyVault = () => (
  <div
    style={{
      height: "calc(100vh - 350px)",
    }}
    className="is-flex is-justify-content-center is-align-items-center is-flex-direction-column"
  >
    <h2>You don't have any Vault</h2>
    <p className="has-text-grey">Create a new transaction above</p>
  </div>
);
export default EmptyVault;
