<template>
  <UForm :state="state" :schema="schema" @submit="saveProfile">
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name"></UInput>
    </UFormGroup>
    <UFormGroup
      class="mb-4"
      label="Email Address"
      name="email"
      help="You will receive a confirmation message on both the old and new email addresses.">
      <UInput v-model="state.email"></UInput>
    </UFormGroup>
    <UButton type="submit" color="primary" variant="solid">Save</UButton>
  </UForm>
</template>
<script setup>
import { z } from "zod";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const pending = ref(false);
const { toastSuccess, toastError } = useAppToast();
const state = ref({
  name: user.value.user_metadata?.full_name,
  email: user.value.email,
});

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
});

const saveProfile = async () => {
  pending.value = true;
  const data = {
    data: {
      full_name: state.value.name,
    },
  };

  if (state.value.email !== user.value.email) {
    data.email = state.value.email;
  }

  try {
    const { error } = await supabase.auth.updateUser(data);

    if (error) throw Error;

    toastSuccess({
      title: "Profile updated",
      description: "Your profile has been updated.",
    });
  } catch (error) {
    toastError({
      title: "Error updating profile",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
