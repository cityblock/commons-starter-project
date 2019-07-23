import React from 'react';

export const NoPathContainer: React.StatelessComponent = () => {
  return (
    <div>
      <h1>This page doesn't exist.</h1>
      <h2>Take a look at the route</h2>
      <p>Compare against app/routes.tsx</p>
    </div>
  );
};

export default NoPathContainer;
