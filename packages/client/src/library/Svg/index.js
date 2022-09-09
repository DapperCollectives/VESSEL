import React, { useEffect, useState } from "react";

const Svg = ({ name, ...props }) => {
  const [ImportedSvg, setImportedSvg] = useState(null);
  useEffect(() => {
    const importSvg = async () => {
      try {
        const imported = await import(`./${name}`);
        setImportedSvg(imported.default(props));
      } catch (e) {
        console.log(e);
      }
    };
    importSvg();
  }, [name]);
  if (!ImportedSvg) return <span>Icon not found</span>;
  return ImportedSvg;
};
export default Svg;
