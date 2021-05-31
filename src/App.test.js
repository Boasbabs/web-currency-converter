import { render, fireEvent } from '@testing-library/react';
import { ToastProvider } from 'react-toast-notifications';
import { FetchMock } from '@react-mock/fetch';

import App from './App';

describe('Web Currency Converter app', () => {
  const mockCurrenciesResponse = {
    success: true,
    timestamp: 1519296206,
    base: 'EUR',
    date: '2021-03-17',
    rates: {
      AUD: 1.566015,
      CAD: 1.560132,
      CHF: 1.154727,
      CNY: 7.827874,
      GBP: 0.882047,
      JPY: 132.360679,
      USD: 1.23396,
    },
  };
  const mockSymbolsResponse = {
    success: true,
    symbols: {
      AUD: 'Australia Dollar',
      CAD: 'Canadian Dollar',
      GBP: 'Great Britain Pound',
      USD: 'United States Dollar',
    },
  };

  const renderComponent = () =>
    render(
      <FetchMock
        mocks={[
          {
            matcher:
              'http://api.exchangeratesapi.io/v1/latest?access_key=3ae66e45c814cec3d85720c651da34b3&base=EURO&symbols=AUD',
            method: 'GET',
            response: {
              success: true,
              timestamp: 1519296206,
              base: 'EUR',
              date: '2021-03-17',
              rates: {
                AUD: 1.566015,
              },
            },
          },
          {
            matcher:
              'http://api.exchangeratesapi.io/v1/symbols?access_key=3ae66e45c814cec3d85720c651da34b3',
            method: 'GET',
            response: mockSymbolsResponse,
          },
          {
            matcher: /^https?:\/\/api.exchangeratesapi.io.*$/,
            method: 'GET',
            response: mockCurrenciesResponse,
          },
        ]}
      >
        <ToastProvider>
          <App />
        </ToastProvider>
      </FetchMock>
    );

  xtest('renders app without crashing', () => {
    const { getByText } = renderComponent();
    const textElement = getByText(/Web Currency Converter/i);
    expect(textElement).toBeInTheDocument();
  });

  test('enter a value for Source Currency and show correct Target Currency', async () => {
    const { findByPlaceholderText } = renderComponent();
    const sourceCurrencyInput = await findByPlaceholderText(/Source Currency/i);
    const targetCurrencyInput = await findByPlaceholderText(/Target Currency/i);

    expect(sourceCurrencyInput).toBeInTheDocument();

    fireEvent.change(sourceCurrencyInput, { target: { value: '23' } });

    expect(targetCurrencyInput.value).toBe('36.018345');
  });

  test('enter a value for Target Currency  and show current Source Currency', async () => {
    const { findByPlaceholderText } = renderComponent();
    const sourceCurrencyInput = await findByPlaceholderText(/Source Currency/i);
    const targetCurrencyInput = await findByPlaceholderText(/Target Currency/i);

    expect(sourceCurrencyInput).toBeInTheDocument();

    fireEvent.change(targetCurrencyInput, { target: { value: '23' } });

    expect(sourceCurrencyInput.value).toBe('14.686960214301907');
  });
});
