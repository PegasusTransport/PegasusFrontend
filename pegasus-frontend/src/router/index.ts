import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import DriverLayout from "@/pages/Driver/DriverLayout.vue";
import AdminLayout from "@/pages/Admin/AdminLayout.vue";
import AdminDrivers from "@/pages/Admin/AdminDrivers.vue";
import AdminBookings from "@/pages/Admin/AdminBookings.vue";
import AdminPrices from "@/pages/Admin/AdminPrices.vue";
import AdminTravels from "@/pages/Admin/AdminTravels.vue";
import CustomerLayout from "@/pages/Customer/CustomerLayout.vue";
import AdminOverview from "@/pages/Admin/AdminOverview.vue";
import CustomerBookings from "@/pages/Customer/CustomerBookings.vue";
import CustomerProfile from "@/pages/Customer/CustomerProfile.vue";
import CustomerOverview from "@/pages/Customer/CustomerOverview.vue";
import DriverProfile from "@/pages/Driver/DriverProfile.vue";
import DriverBookings from "@/pages/Driver/DriverBookings.vue";
import DriverCar from "@/pages/Driver/DriverCar.vue";
import DriverOverview from "@/pages/Driver/DriverOverview.vue";
import Register from "@/pages/Auth/Register.vue";
import Login from "@/pages/Auth/Login.vue";
import { useUserStore } from "@/stores/userStore";
import { UserRoles } from "@/types/user-roles";
import ForgotPassword from "@/pages/Auth/ForgotPassword.vue";
import Taxi404 from "@/pages/Taxi404.vue";
import ResetPassword from "@/pages/Auth/ResetPassword.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: { guestOnly: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: Taxi404,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: "/forgot-password",
      name: "ForgotPassword",
      component: ForgotPassword,
      meta: { guestOnly: true },
    },
    {
      path: "/reset-password",
      name: "ResetPassword",
      props: (route) => ({ email: route.query.email }),
      component: ResetPassword,
      meta: { guestOnly: true },
    },
    {
      path: "/driver",
      name: "Driver Dashboard",
      component: DriverLayout,
      meta: { requiresAuth: true, requiredRole: UserRoles.Driver },
      children: [
        {
          path: "",
          name: "driverOverview",
          component: DriverOverview,
        },
        {
          path: "profile",
          name: "driverProfile",
          component: DriverProfile,
        },
        {
          path: "bookings",
          name: "driverBookings",
          component: DriverBookings,
        },
        {
          path: "car",
          name: "driverCar",
          component: DriverCar,
        },
      ],
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminLayout,
      meta: {
        requiresAuth: true,
        requiredRole: UserRoles.Admin,
      },
      children: [
        {
          path: "",
          name: "overview",
          component: AdminOverview,
        },
        {
          path: "drivers",
          name: "drivers",
          component: AdminDrivers,
        },
        {
          path: "bookings",
          name: "bookings",
          component: AdminBookings,
        },
        {
          path: "prices",
          name: "prices",
          component: AdminPrices,
        },
        {
          path: "trips",
          name: "trips",
          component: AdminTravels,
        },
      ],
    },
    {
      path: "/customer",
      name: "CustomerDashboard",
      component: CustomerLayout,
      meta: { requiresAuth: true, requiredRole: UserRoles.User },
      children: [
        {
          path: "",
          name: "customerOverview",
          component: CustomerOverview,
        },
        {
          path: "book",
          name: "customerBooking",
          component: CustomerBookings,
        },
        {
          path: "profile",
          name: "customerProfile",
          component: CustomerProfile,
        },
      ],
    },
  ],
});

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);
  const requiredRole = to.meta.requiredRole;

  if (!authStore.isAuthenticated) {
    await authStore.initializeAuth();
  }

  const roles = userStore.user?.roles || [];
  const defaultRoute = userStore.loadRouteBasedOnRole();

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (guestOnly && authStore.isAuthenticated) {
    next(defaultRoute);
  } else if (requiredRole !== undefined && !roles.includes(requiredRole)) {
    const lastRoute = localStorage.getItem("lastRoute");
    next(lastRoute ? lastRoute : defaultRoute);
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (to.meta.requiresAuth) {
    localStorage.setItem("lastRoute", to.fullPath);
  }
});

export default router;
