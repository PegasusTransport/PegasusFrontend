<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/plugins/axios";

const prices = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchPrices() {
  loading.value = true;
  error.value = null;
  try {
    const resp = await api.get<any[]>("/api/Admin/GetAllTaxiPrices");
    prices.value = resp.data;
    console.log("fetched prices:", prices.value);
  } catch (err: any) {
    console.error("Failed to fetch prices", err);
    error.value = err?.message || String(err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchPrices();
});
</script>

<template>
  <div>
    <h1>Här är dashboard för en förare</h1>
    `

    <h1>{{ prices }}</h1>

    `

    <div v-if="loading">Laddar priser…</div>
    <div v-else-if="error">Fel vid hämtning av priser: {{ error }}</div>

    <ul v-else>
      <li v-for="(p, i) in prices" :key="i">
        {{ p }}
      </li>
      <li v-if="prices.length === 0">Inga priser hittades</li>
    </ul>
  </div>
</template>
