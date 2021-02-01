import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders search button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Search/i);
  expect(buttonElement).toBeInTheDocument();
});
