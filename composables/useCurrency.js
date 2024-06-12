/**
 * Returns an object with a computed property `currency`, which formats the given `amount` as a currency string in the European Union (EUR) format.
 *
 * @param {number|Ref<number>} amount - The amount to be formatted as a currency string.
 * @return {{currency: ComputedRef<string>}} An object with a computed property `currency`, which is a string representing the formatted currency amount.
 */
export const useCurrency = (amount) => {
  const currency = computed(() => {
    return Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(isRef(amount) ? amount.value : amount);
  });

  return {
    currency,
  };
};
