<script setup lang="ts">
import EmailFooter from './components/EmailFooter.vue';
import EmailHeader from './components/EmailHeader.vue';
defineProps<{
  name: string;
  year: string | number;
}>();
</script>

<template>
  <div class="email">
    <div class="content">
      <EmailHeader />
        <div class="body">
          <p>We will get back to you as quickly as possible.</p>
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
  padding: 20px;
}
.message {
  white-space: pre-wrap;
}
</style>
