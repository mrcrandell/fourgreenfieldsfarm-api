<script setup lang="ts">
import { ref } from "vue";
import ContactEmail from "../emails/ContactEmail.vue";
import ContactThankYouEmail from "../emails/ContactThankYouEmail.vue";
import { mockProps } from "./preview-data";

const selected = ref("ContactEmail");

const components = {
  ContactEmail,
  ContactThankYouEmail,
};

const templates = Object.keys(components);
</script>

<template>
  <div class="preview-container">
    <label>Select Email Template:</label>
    <select v-model="selected">
      <option v-for="name in templates" :key="name" :value="name">{{ name }}</option>
    </select>

    <div class="preview-box">
      <component :is="components[selected]" v-bind="mockProps[selected]" />
    </div>
  </div>
</template>

<style>
.preview-container {
  font-family: sans-serif;
  padding: 1rem;
}

.preview-box {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 1rem;
  background: #fff;
}
</style>
