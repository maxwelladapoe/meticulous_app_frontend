<template>
  <div class="full-page-wrap bg-white flex items-center overflow-y-hidden">
    <div
      class="container flex flex-col lg:flex-row items-center w-full relative"
    >
      <div class="w-full lg:w-6/12 z-20 text-center lg:text-left my-12 lg:mb-0">
        <h1 class="text-4xl lg:text-7xl font-bold">
          Be <span class="text-green-600">meticulous</span>, take control of
          your life
        </h1>

        <p class="mt-5 font-bold text-green-600 lg:text-xl">
          Remember everything
        </p>
        <p class="">Make notes more useful by adding text & images</p>
        <p class="mt-5 font-bold text-green-600 lg:text-xl">Complete Tasks</p>
        <p>
          Bring your notes, tasks, and schedules together to get things done
          more easily.
        </p>

        <RouterLink to="/signup">
          <button
            class="
              bg-green-600
              text-white
              mt-5
              px-12
              py-3
              uppercase
              rounded-full
              text-sm
              tracking-wide;
            "
          >
            Sign up for free
          </button>
        </RouterLink>

        <div class="mt-2">
          <span class="hover:text-green-600"
            ><RouterLink to="/login"> Already a member? Login</RouterLink></span
          >
        </div>
      </div>

      <div class="w-full lg:flex-1 z-20">
        <img src="../assets/meti.svg" />
      </div>

      <div class="absolute bg-font w-full">
        <p class="font-sacramento">eticulous</p>
      </div>
    </div>
  </div>
</template>