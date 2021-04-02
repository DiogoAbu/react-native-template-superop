import React from 'react';

import { render } from '@testing-library/react-native';

import App from '../src/App';

it('renders/navigates throughout app screens', async () => {
  // Render component
  const { findByText } = render(<App />);

  // Check what is rendered
  const welcomeText = await findByText(/Welcome to HelloWorld/i);
  expect(welcomeText).not.toBeNull();
});
