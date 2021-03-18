import React from 'react';

import { render, waitFor } from '@testing-library/react-native';

import App from '../src/App';

it('renders/navigates throughout app screens', async () => {
  // Render component
  const { getByText } = render(<App />);

  // Check what is rendered
  const welcomeText = await waitFor(() => getByText(/Welcome to HelloWorld/i));
  expect(welcomeText).not.toBeNull();
});
