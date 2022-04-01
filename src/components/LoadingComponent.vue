<script setup>

const props = defineProps({
    loadingText:String 
})
</script>

<template>
  <div>
    <span class="flex h-6 w-6 relative">
      <span
        class="
          animate-ping
          absolute
          inline-flex
          h-full
          w-full
          rounded-full
          bg-blue-400
          opacity-75
        "
      ></span>
      <span
        class="
          animate-pulse
          relative
          inline-flex
          rounded-full
          h-6
          w-6
          bg-green-600
        "
      ></span>
    </span>
  </div>

  <p class=" mt-4 w-64 text-center" v-if="loadingText">{{loadingText}}</p>
</template>