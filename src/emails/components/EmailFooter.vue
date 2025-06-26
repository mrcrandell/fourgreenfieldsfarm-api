<script setup lang="ts">
defineProps<{
  year: number | string;
}>();
</script>

<template>
  <footer class="footer">
    <p>Four Green Fields Farm<br><span class="unstyle-auto-detected-links">15693 Wilson Road, Rodney, MI 49342<br>231-580-1463 and ask for Kevin</span></p>
    <p>&copy; {{year}} All Rights Reserved</p>
  </footer>
</template>

<style>
footer.footer {
  text-align: center;
  padding: 20px;
  background-color: #647b97;
  color: #fff;
  font-size: 14px;
}
footer.footer p {
  margin-top: 0;
  margin-bottom: 16px;
}
</style>
