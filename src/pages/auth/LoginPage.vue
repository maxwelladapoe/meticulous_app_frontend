<script setup>
//imports
import * as Yup from "yup";
import { useForm, useField } from "vee-validate";
import { useUserStore } from "../../store/user.js";
import { useRouter } from "vue-router";
import { ref } from "vue";

//components
import LoadingComponent from "../../components/LoadingComponent.vue";

//initializations
let isLoading = ref(false);
const router = useRouter();
let serverResponseError = ref("");
let showServerResponseError = ref(false);

//initialize store
const userStore = useUserStore();
const login = userStore.login;

//initialize validations
const validationSchema = Yup.object({
  email: Yup.string().email().required().label("Email address"),
  password: Yup.string().min(6).required().label("Your password"),
});

const { errors, handleSubmit } = useForm({
  validationSchema: validationSchema,
});

const { value: email } = useField("email");
const { value: password } = useField("password");

//methods
const onSubmit = handleSubmit((values) => {
  showServerResponseError.value = false;
  let data = {
    user: values,
  };

  login(data)
    .then(() => {
      isLoading.value = false;
      router.push({ name: "Dashboard" });
    })
    .catch((e) => {
      //return the error
      isLoading.value = false;
      try{
        serverResponseError.value = e.response.data.error;
      }catch(e){
         serverResponseError.value = "Something went wrong";
      }

      showServerResponseError.value = true;
      setTimeout(() => {
        showServerResponseError.value = false;
      }, 10000);
    });
});

//watchers
</script>

<template>
  <div class="full-page-wrap flex justify-center items-center bg-gray-50">
    <div class="w-11/12 md:w-8/12 lg:w-6/12 xl:w-4/12 p-4 shadow bg-white">
      <div class="p-4 rounded-lg">
        <div v-if="!isLoading">
          <p class="text-center text-3xl font-semibold">Log in</p>
          <p class="text-center mt-2">
            New to meticulous?
            <RouterLink to="/signup">
              <span class="text-green-600">Sign up for free</span></RouterLink
            >
          </p>

          <form @submit.prevent="onSubmit" class="mt-6">
            <div v-if="showServerResponseError" class="bg-red-500 p-3 rounded">
              <span class="text-white">{{ serverResponseError }}</span>
            </div>
            <div class="form-control">
              <input
                type="email"
                class="form-input w-full rounded-lg h-12"
                id="email"
                v-model.trim="email"
                name="email"
                placeholder="Email address"
              />
              <span class="text-sm text-red-500">{{ errors.email }}</span>
            </div>

            <div class="form-control">
              <input
                type="password"
                class="form-input w-full rounded-lg h-12"
                name="password"
                id="password"
                v-model="password"
                placeholder="Password (6+ characters)"
              />
              <span class="text-sm text-red-500">{{ errors.password }}</span>
            </div>

            <div class="mt-2">
              <RouterLink to="/"
                ><span class="text-green-600">Forgot password?</span>
              </RouterLink>
            </div>

            <button
              class="mt-6 w-full btn bg-green-600 text-white"
              id="login-button"
            >
              log in
            </button>
          </form>
        </div>

        <div v-else>
          <div class="h-80 flex items-center justify-center flex-col">
            <LoadingComponent loadingText="Please wait while we log you in" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>