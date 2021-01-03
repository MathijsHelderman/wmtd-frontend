import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import { store } from "@/store/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/accounts",
    name: "Accounts",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/Accounts.vue"),
    meta: {
      requiresAuth: true
    },
    children: []
  },
  {
    path: "/households",
    name: "Households",
    component: () => import("@/views/Households.vue"),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "/households/:id",
        component: () => import("@/components/Households/Household.vue"),
        props: true
      }
    ]
  },
  {
    path: "/savings",
    name: "Savings",
    component: () => import("@/views/Savings.vue"),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "/",
        component: () => import("@/components/Savings/SavingList.vue"),
        props: true
      },
      {
        path: "/savings/:id",
        component: () => import("@/components/Savings/Saving.vue"),
        props: true
      },
      {
        path: "/savings/new",
        component: () => import("@/components/Savings/SavingForm.vue"),
        props: true
      }
    ]
  },
  {
    // !!! ALWAYS LAST ROUTE
    path: "*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue")
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta?.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
    } else {
      next("/Home");
    }
  } else {
    next();
  }
});

export default router;
