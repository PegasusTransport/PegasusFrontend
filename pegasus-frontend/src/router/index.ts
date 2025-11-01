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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: { guestOnly: true },
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: "/driver",
      name: "Driver Dashboard",
      component: DriverLayout,
      meta: { requiresAuth: true },
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
      meta: { requiresAuth: true },
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
      meta: { requiresAuth: true },
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
  const store = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!store.isAuthenticated) {
    await store.initializeAuth();
  }

  if (requiresAuth && !store.isAuthenticated) {
    next("/login");
  } else if (to.meta.guestOnly && store.isAuthenticated) {
    next("/admin");
  } else {
    next();
  }
});

export default router;
