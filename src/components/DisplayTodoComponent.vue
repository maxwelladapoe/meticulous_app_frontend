<script setup>
import { computed } from "vue";

const props = defineProps({
  noteContent: [Object, String],
});

let parsedContent = computed(() => JSON.parse(props.noteContent));

let completedItems = computed(() =>
  parsedContent.value.filter((e) => e.completed == true)
);
let activeItems = computed(() =>
  parsedContent.value.filter((e) => e.completed == false)
);
</script>

<template>
  <div
    class="flex items-center my-4 "
    v-for="todoItem in activeItems"
    :key="todoItem.id"
    :id="`todoItem-${todoItem.id}`"
  >
    <input
      type="checkbox"
      disabled
      v-model="todoItem.completed"
      class="form-checkbox mr-5 h-5 w-5"
    />
    <p class="w-full">{{ todoItem.title }}</p>
  </div>

  <div class="mt-5">
    <p v-if="completedItems.length > 0">
      {{ completedItems.length }} Completed Items
    </p>
  </div>
</template>