import { createApp } from "vue";
import ContactEmail from "../../src/emails/ContactEmail.vue";

createApp(ContactEmail, {
  name: "John Example",
  email: "john@example.com",
  phone: "248-555-1234",
  message: "This is a test message\nWith line breaks.",
  year: `${new Date().getFullYear()}`,
}).mount("#app");
