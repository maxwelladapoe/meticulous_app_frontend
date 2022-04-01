<script setup>
//imports
import * as Yup from "yup";
import { useForm, useField } from "vee-validate";
import { useUserStore } from "../../store/user.js";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

//components
import LoadingComponent from "../../components/LoadingComponent.vue";
import { CheckCircle } from "mdue";

//initializations
let isLoading = ref(false);
let isSuccessful = ref(false);
const router = useRouter();

//initialize store
const userStore = useUserStore();

const { userData } = storeToRefs(userStore);

const signup = userStore.signup;

//initialize validations
const validationSchema = Yup.object({
  firstname: Yup.string().required().label("First name"),
  lastname: Yup.string().required().label("Last name"),
  email: Yup.string().email().required().label("Email address"),
  password: Yup.string().min(6).required().label("Your password"),
});

const { errors, handleSubmit } = useForm({
  validationSchema: validationSchema,
});

const { value: firstname } = useField("firstname");
const { value: lastname } = useField("lastname");
const { value: email } = useField("email");
const { value: password } = useField("password");

//methods
const onSubmit = handleSubmit((values, actions) => {
  isLoading.value = true;
  let data = {
    user: values,
  };
  signup(data)
    .then(() => {
      isLoading.value = false;
      isSuccessful.value = true;
         router.push({ name: "Dashboard" });
    })
    .catch((e) => {
      //return the error
      isLoading.value = false;
      isSuccessful.value = false;
      console.log(e);
      if(e.response){
           let errors = e.response.data.errors;
      for (const [key, value] of Object.entries(errors)) {
        actions.setFieldError(key, `${key} ${value}`);
      }
      }
   
    });
});
</script>

<template>
  <div
    class="
      full-page-wrap
      flex
      justify-start
      items-center
      my-12
      lg:my-0
      bg-gray-50
    "
  >
    <div
      class="container flex flex-col lg:flex-row justify-between items-center"
    >
      <div class="w-11/12 flex-none lg:flex-1 lg:mt-0 text-center lg:text-left mb-8 lg:mb-0 ">
        <p class="font-bold text-6xl mb-6">
          Get <span class="text-green-600">things done</span>, make notes and be on track.
        </p>
        <p class="font-semibold text-xl">
          <span
            ><CheckCircle class="w-5 h-5 inline-block text-green-600" />
          </span>
          Make notes whenever & where ever
        </p>
        <p class="font-semibold text-xl">
          <span
            ><CheckCircle class="w-5 h-5 inline-block text-green-600" />
          </span>
          Keep track of your daily tasks
        </p>
        <p class="font-semibold text-xl">
          <span
            ><CheckCircle class="w-5 h-5 inline-block text-green-600" />
          </span>
          Log the great ideas that come to mind as you progress within the day
        </p>
      </div>

      <div class="w-11/12 lg:w-6/12 p-4 bg-white shadow rounded">
        <div class="p-4">
          <div v-if="!isLoading && !isSuccessful">
            <p class="text-center text-3xl font-semibold">Sign up</p>
            <p class="text-center mt-2">
              Already registered?
              <RouterLink to="/login">
                <span class="text-green-600">Log in</span>
              </RouterLink>
            </p>
            <form @submit="onSubmit" class="mt-6">
              <div class="form-control">
                <input
                  type="text"
                  class="form-input w-full rounded-lg h-12"
                  name="firstname"
                  id="firstname"
                  v-model.trim="firstname"
                  placeholder="First name*"
                />
                <span class="text-sm text-red-500">{{ errors.firstname }}</span>
              </div>
              <div class="form-control">
                <input
                  type="text"
                  class="form-input w-full rounded-lg h-12"
                  id="lastname"
                  name="lastname"
                  v-model.trim="lastname"
                  placeholder="Last name*"
                />
                <span class="text-sm text-red-500">{{ errors.lastname }}</span>
              </div>

              <div class="form-control">
                <input
                  type="email"
                  class="form-input w-full rounded-lg h-12"
                  name="email"
                  v-model.trim="email"
                  id="email"
                  placeholder="Email address*"
                />
                <span class="text-sm text-red-500">{{ errors.email }}</span>
              </div>

              <div class="form-control">
                <input
                  type="password"
                  class="form-input w-full rounded-lg h-12"
                  name="password"
                  v-model="password"
                  id="password"
                  placeholder="Password (6+ characters)*"
                />
                <span class="text-sm text-red-500">{{ errors.password }}</span>
              </div>
              <div class="mt-2"></div>
              <button
                class="mt-6 w-full btn bg-green-600 text-white"
                id="login-button"
              >
                sign up
              </button>
              <div class="mt-2 text-sm text-center">
                By continuing you agree to the terms & conditions of Meticulous
              </div>
            </form>
          </div>
          <div v-else-if="isLoading">
            <div class="h-80 flex items-center justify-center flex-col">
              <LoadingComponent
                loadingText="Please wait while we set up your account"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>