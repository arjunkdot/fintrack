<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> {{ isEditing ? "Edit" : "Add" }} Transaction </template>
      <UForm :state="state" :schema="schema" ref="form" @submit="save">
        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            type="number"
            name="amount"
            min="0"
            step="0.01"
            v-model.number="state.amount"
            placeholder="Enter an amount"
          />
        </UFormGroup>
        <UFormGroup label="Type" :required="true" name="type" class="mb-4">
          <USelect
            name="type"
            :options="transactionTypes"
            placeholder="Select a type"
            :disabled="isEditing"
            v-model="state.type"
          />
        </UFormGroup>
        <UFormGroup
          label="Transaction Date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            name="created_at"
            icon="i-heroicons-calendar-20-solid"
            placeholder="Pick a date"
            v-model="state.created_at"
          />
        </UFormGroup>
        <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
          <UInput
            type="text"
            name="description"
            placeholder="Describe this transaction"
            v-model="state.description"
          />
        </UFormGroup>
        <UFormGroup
          label="Category"
          :required="true"
          name="category"
          class="mb-4"
          v-if="state.type === 'Expense'"
        >
          <USelect
            name="category"
            :options="transactionCategories"
            placeholder="Select a category"
            v-model="state.category"
          />
        </UFormGroup>

        <UButton type="submit" variant="solid" label="Save" :loading="isLoading" block />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { transactionCategories, transactionTypes } from "~/constants";
import { z } from "zod";

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be greater than 0"),
});
const incomeSchema = z.object({
  type: z.literal("Income"),
});
const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(transactionCategories),
});
const investmentSchema = z.object({
  type: z.literal("Investment"),
});
const savingSchema = z.object({
  type: z.literal("Saving"),
});
const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);
const form = ref();
const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();
const save = async () => {
  if (form.value.errors.length) return;
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("transactions")
      .upsert({ ...state.value, id: props.transaction?.id });
    if (!error) {
      toastSuccess({
        title: "Transaction added.",
      });
      isOpen.value = false;
      emit("save");
      return;
    }
    throw error;
  } catch (e) {
    toastError({
      title: "Transaction could not be saved",
      description: e.message,
    });
  } finally {
    isLoading.value = false;
  }
};
const emit = defineEmits(["update:modelValue", "save"]);
const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false,
  },
});
const isEditing = computed(() => !!props.transaction);
const initialState = ref(
  isEditing.value
    ? {
        type: props.transaction.type,
        amount: props.transaction.amount,
        created_at: props.transaction.created_at.split("T")[0],
        description: props.transaction.description,
        category: props.transaction.category,
      }
    : {
        type: undefined,
        amount: 0,
        created_at: undefined,
        description: undefined,
        category: undefined,
      }
);
const state = ref({ ...initialState.value });

const resetForm = () => {
  Object.assign(state.value, initialState.value);
  form.value.clear();
};
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});
</script>
