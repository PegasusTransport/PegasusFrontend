import { createRouter, createWebHistory } from "vue-router";
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/driver",
      name: "Driver Dashboard",
      component: DriverLayout,
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

export default router;
