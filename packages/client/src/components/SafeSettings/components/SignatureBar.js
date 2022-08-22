const SignatureBar = ({ threshold, vefiriedSafeOwners }) => (
  <div className="is-flex column p-0 is-full">
    {new Array(vefiriedSafeOwners?.length).fill().map((_, idx) => {
      const backgroundColor = idx + 1 <= threshold ? "black" : "#E5E5E5";
      return (
        <div
          key={idx}
          className="progress-bit mr-1"
          style={{ backgroundColor, width: 4 }}
        />
      );
    })}
  </div>
);

export default SignatureBar;
