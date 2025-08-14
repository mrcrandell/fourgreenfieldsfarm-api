import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import juice from "juice";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "@vue/compiler-sfc";
import { collectAllVueStylesFrom } from "./collectVueStyles";
import ContactEmail from "../src/emails/ContactEmail.vue";
import ContactThankYouEmail from "../src/emails/ContactThankYouEmail.vue";

// __dirname polyfill
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const currentYear = new Date().getFullYear();
const templates = [
  {
    name: "contact-email",
    component: ContactEmail,
    props: {
      name: "{{name}}",
      email: "{{email}}",
      phone: "{{phone}}",
      message: "{{message}}",
      year: "{{year}}",
    },
  },
  {
    name: "contact-thank-you-email",
    component: ContactThankYouEmail,
    props: {
      name: "{{name}}",
      year: "{{year}}",
    },
  },
];

async function renderEmailTemplate() {
  const css = await collectAllVueStylesFrom("src/emails/**/*.{vue,css}");
  for (const { name, component, props } of templates) {
    const app = createSSRApp(component, props);
    const html = await renderToString(app);
    const inlined = juice.inlineContent(html, css);

    const outPath = path.resolve(__dirname, `../src/templates/${name}.html`);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, inlined);

    console.log(`Rendered: ${name}.html`);
  }
}

renderEmailTemplate().catch((err) => {
  console.error("Failed to build email template", err);
  process.exit(1);
});
