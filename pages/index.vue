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
      :amount="4000"
      :last-amount="3000"
      :loading="false" />
    <Trend
      color="red"
      title="Expense"
      :amount="2325.21"
      :last-amount="5100"
      :loading="false" />
    <Trend
      color="green"
      title="Investments"
      :amount="7499"
      :last-amount="2500"
      :loading="false" />
    <Trend
      color="red"
      title="Savings"
      :amount="6815"
      :last-amount="3011"
      :loading="false" />
  </section>

  <section>
    <Transaction />
    <Transaction />
    <Transaction />
    <Transaction />
  </section>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";
const selectedView = ref(transactionViewOptions[1]);
</script>
