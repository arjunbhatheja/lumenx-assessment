import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders EnergeX application', () => {
  render(<App />);
  const appElement = screen.getByText(/EnergeX Posts/i);
  expect(appElement).toBeInTheDocument();
});
