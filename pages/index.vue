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
      :last-amount="previousIncomeTotal"
      :loading="pending" />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :last-amount="previousExpenseTotal"
      :loading="pending" />
    <Trend
      color="green"
      title="Investments"
      :amount="7499"
      :last-amount="2500"
      :loading="pending" />
    <Trend
      color="red"
      title="Savings"
      :amount="6815"
      :last-amount="3011"
      :loading="pending" />
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
      <TransactionModal v-model="isOpen" @save="refresh()" />

      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        aria-label="Add"
        @click="isOpen = true" />
    </div>
  </section>

  <section v-if="!pending">
    <div v-for="(transactionOnDay, date) in byDate" :key="date">
      <DailyTransactionSummary :date="date" :transactions="transactionOnDay" />
      <Transaction
        v-for="transaction in transactionOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @delete="refresh()" />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2s" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";

const selectedView = ref(transactionViewOptions[1]);
const { current, previous } = useSelectedTimePeriod(selectedView);
const {
  pending,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: { byDate },
  },
} = useFetchTransactions(current);
const isOpen = ref(false);

const {
  refresh: refreshPrevious,
  transactions: {
    incomeTotal: previousIncomeTotal,
    expenseTotal: previousExpenseTotal,
  },
} = useFetchTransactions(current);
await refresh();
await refreshPrevious();
</script>
