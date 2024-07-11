<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<script setup>
useHead({
  title: "Fintrack - Track your money",
  meta: [
    {
      name: "description",
      content:
        "Fintrack helps you track your money easily. With Fintrack, you can easily track your income and expenses.",
    },
  ],
});
</script>
