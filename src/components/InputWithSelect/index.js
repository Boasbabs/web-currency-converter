import styles from './InputWithSelect.module.scss';

const InputWithSelect = ({
  amount,
  label,
  currencyOptions,
  selectedCurrency,
  handleCurrencyChange,
  handleInputChange,
}) => {
  const showCurrencyOptions = () => {
    return currencyOptions.length > 0 ? (
      currencyOptions.map((currency) => (
        <option
          data-testid="select-option"
          key={currency[0]}
          value={currency[0]}
        >
          {currency[1]}
        </option>
      ))
    ) : (
      <option value="">No data</option>
    );
  };

  return (
    <div className={styles.InputWithSelect}>
      <label htmlFor="currencyAmount" className={styles.InputWithSelect__label}>
        {label}
      </label>
      <input
        name="currencyAmount"
        value={amount}
        placeholder={label}
        type="number"
        aria-label={`${label} Amount Field`}
        className={styles.input}
        onChange={handleInputChange}
      />
      <select
        name="currencyType"
        id="currencyType"
        data-testid={`${label} Select`}
        aria-label={`${label} Select`}
        className={styles.select}
        value={selectedCurrency}
        onChange={handleCurrencyChange}
      >
        {showCurrencyOptions()}
      </select>
    </div>
  );
};

export default InputWithSelect;
