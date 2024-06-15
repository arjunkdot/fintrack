<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend
      color="green"
      title="Income"
      :amount="incomeTotal"
      :last-amount="3000"
      :loading="isLoading" />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :last-amount="5100"
      :loading="isLoading" />
    <Trend
      color="green"
      title="Investments"
      :amount="7499"
      :last-amount="2500"
      :loading="isLoading" />
    <Trend
      color="red"
      title="Savings"
      :amount="6815"
      :last-amount="3011"
      :loading="isLoading" />
  </section>

  <section class="flex justify-between mb-8 mt-20">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
        period
      </div>
    </div>
    <div>
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        aria-label="Add" />
    </div>
  </section>

  <section v-if="!isLoading">
    <div
      v-for="(transactionOnDay, date) in transactionGroupedByDate"
      :key="date">
      <DailyTransactionSummary :date="date" :transactions="transactionOnDay" />
      <Transaction
        v-for="transaction in transactionOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @delete="refreshTransactions()" />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2s" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";
const selectedView = ref(transactionViewOptions[1]);

const supabase = useSupabaseClient();
const transactions = ref([]);
const isLoading = ref(false);

const income = computed(() =>
  transactions.value.filter((t) => t.type === "income")
);
const expense = computed(() =>
  transactions.value.filter((t) => t.type === "expense")
);

const incomeCount = computed(() => income.value.length);
const expenseCount = computed(() => expense.value.length);

const incomeTotal = computed(() =>
  income.value.reduce((acc, transaction) => acc + transaction.amount, 0)
);
const expenseTotal = computed(() =>
  expense.value.reduce((acc, transaction) => acc + transaction.amount, 0)
);
const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("transactions", async () => {
      const { data, error } = await supabase.from("transactions").select();

      if (error) return [];
      return data;
    });

    return data.value;
  } finally {
    isLoading.value = false;
  }
};

const refreshTransactions = async () =>
  (transactions.value = await await fetchTransactions());
await refreshTransactions();

const transactionGroupedByDate = computed(() => {
  let grouped = {};

  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split("T")[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  }

  return grouped;
});
</script>
