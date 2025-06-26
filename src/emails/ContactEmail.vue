<script setup lang="ts">
import EmailFooter from './components/EmailFooter.vue';
import EmailHeader from './components/EmailHeader.vue';
defineProps<{
  name: string;
  email: string;
  phone: string;
  message: string;
  year: string | number;
}>();
</script>

<template>
  <div class="email">
    <div class="content">
      <EmailHeader />
        <div class="body">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> {{ name }}</p>
          <p><strong>Email:</strong> {{ email }}</p>
          <p><strong>Phone:</strong> {{ phone }}</p>
          <p><strong>Message:</strong></p>
          <p class="message">{{ message }}</p>
        </div>
    </div>
    <EmailFooter :year="year" />
  </div>
</template>

<style>
.email {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  width: 100%;
  margin: auto;
  background-color: #647b97;
  min-height: 100%;
}
.content {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
}
.header {
  text-align: center;
  padding: 20px;
}
.body {
  background: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
}
.message {
  white-space: pre-wrap;
}
</style>
