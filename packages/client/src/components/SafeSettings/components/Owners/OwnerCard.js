const OwnerCard = ({owner}) => {
  if (owner.name)
    return (
      <div className="pb-4">
        <h1 className="is-family-monospace has-text-black has-text-weight-bold">{owner.name}</h1>
        <div className="has-text-black has-text-weight-bold">{owner.address}</div>
      </div>
    );
  return (
    <h1 className="has-text-black has-text-weight-bold">{owner.address}</h1>
  ); 
}

export default OwnerCard;