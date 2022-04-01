<script setup>
import { useUserStore } from "../../store/user";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const userStore = useUserStore();
const router = useRouter();
let showProfileDropDown = ref(false);
const popupMenu = ref(null);

const logout = () => {
  showProfileDropDown.value = false;
  userStore
    .logout()
    .then(() => {
      router.push({ name: "Login" });
    })
    .catch(() => {
      userStore.resetUserInfo();
      router.push({ name: "Login" });
    });
};

onClickOutside(popupMenu, () => {
  showProfileDropDown.value = false;
});

const isAuthenticated = computed(() => userStore.isAuthenticated);
const userData = computed(() => userStore.userData);
</script>
<template>
  <nav class="w-full h-20">
    <div class="container w-full h-full flex items-center">
      <div class="navBarBrand font-sacramento text-4xl text-green-600">
        <RouterLink :to="isAuthenticated ? '/dashboard' : '/'">
          Meticulous
        </RouterLink>
      </div>
      <div class="menu ml-auto">
        <ul
          class="list-none flex justify-around items-center"
          v-if="!isAuthenticated"
        >
          <li class="">
            <RouterLink to="/">
              <div class="btn">Home</div>
            </RouterLink>
          </li>
          <li class="">
            <RouterLink :to="{ name: 'Login' }">
              <div class="btn border border-1 border-green-600 mr-4">Login</div>
            </RouterLink>
          </li>
          <li class="">
            <RouterLink :to="{ name: 'Signup' }">
              <div class="btn bg-green-600 text-white">Sign up</div>
            </RouterLink>
          </li>
        </ul>

        <div class="flex justify-around items-center" v-if="isAuthenticated">
          <button
            class="rounded-full w-12 h-12 border border-green-600 bg-white"
            @click="showProfileDropDown = !showProfileDropDown"
          >
            <img
              src="../../assets/default-pic.png"
              class="rounded-full w-12 h-12"
              alt=""
            />
          </button>

          <div
            ref="popupMenu"
            v-if="showProfileDropDown"
            class="profile-dropdown-menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
          >
            <div class="py-1" role="none">
              <div class="px-4 py-2">
                <p class="text-right font-semibold text-xl">
                  {{ `${userData.firstname} ${userData.lastname}` }}
                </p>
                <p class="text-right">{{ userData.email }}</p>
              </div>

              <hr class="my-3" />

              <div class="text-right px-4 py-2">
                <button
                  class="btn border border-1 border-green-600"
                  @click="logout"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>