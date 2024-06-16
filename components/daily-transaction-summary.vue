<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold">
    <div class="flex items-center justify-between">{{ date }}</div>
    <div class="flex items-center justify-end pr-10">{{ currency }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  date: String,
  transactions: Array,
});

const sum = computed(() => {
  return props.transactions.reduce((acc, transaction) => {
    if (transaction.type === "Income") {
      return acc + transaction.amount;
    } else {
      return acc - transaction.amount;
    }
  }, 0);
});
const { currency } = useCurrency(sum);
</script>
