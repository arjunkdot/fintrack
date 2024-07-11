export const useAvatarUrl = (user) => {
  const supabase = useSupabaseClient();
  const avuser = useSupabaseUser();

  const getPublicUrl = () => {
    if (!avuser.value?.user_metadata?.avatar_url) return null;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(avuser.value?.user_metadata?.avatar_url);

    return data.publicUrl;
  };
  const url = ref(getPublicUrl());

  watch(avuser, () => (url.value = getPublicUrl()), { immediate: true });

  return { url };
};
