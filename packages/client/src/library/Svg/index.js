import { lazy, Suspense } from "react";

const Svg = ({ name, ...props }) => {
  const SvgComponent = lazy(() => import(`./${name}`));
  return (
    <Suspense fallback={<p>loading svg...</p>}>
      <SvgComponent {...props} />
    </Suspense>
  );
};
export default Svg;
