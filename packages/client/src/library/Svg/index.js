import { useState, useEffect } from "react";

const Svg = ({ name, ...props }) => {
  const [svgComponent, setSvgComponent] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const svgComponent = await import(`./${name}`);
        setSvgComponent(svgComponent.default(props));
      } catch (e) {
        console.log(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
  return svgComponent;
};
export default Svg;
