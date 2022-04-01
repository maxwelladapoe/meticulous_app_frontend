import LoginPage from "../pages/auth/LoginPage.vue";
import HomePage from "../pages/HomePage.vue";
import SignupPage from "../pages/auth/SignupPage.vue";
import DashboardPage from "../pages/Dashboard.vue";
import { createRouter, createWebHistory } from "vue-router";
import { nextTick } from "vue";
import { useUserStore } from "../store/user";


const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/signup",
    name: "Signup",
    component: SignupPage,
    meta: { requiresAuth: false ,rejectIfAuthenticated:true},
  },

  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { requiresAuth: false , rejectIfAuthenticated:true },
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
 

   if (to.matched.some((record) => record.meta.rejectIfAuthenticated)) {
    if (useUserStore().$state.isAuthenticated) {
        next('/dashboard');
        return
    } else {
      next();
    }
  } 
  
  else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (useUserStore().$state.isAuthenticated) {
        next();
        return
    } else {
      next("/login");
    }
  } else {
    next();
  }
  




});

export default router;
