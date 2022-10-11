import React from 'react';

const Loading = ({ message }) => (
  <section className="section screen-height is-flex is-align-items-center">
    <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center has-text-black">
      <h2 className="is-size-5">{message}</h2>
    </div>
  </section>
);

export default Loading;
