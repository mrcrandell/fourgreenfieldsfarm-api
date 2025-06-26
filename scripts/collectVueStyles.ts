import { parse } from "@vue/compiler-sfc";
import fs from "fs/promises";
import fg from "fast-glob";
import path from "path";

export async function collectAllVueStylesFrom(
  globPattern: string
): Promise<string> {
  const files = await fg(globPattern, { absolute: true });
  let combined = "";

  for (const file of files) {
    const source = await fs.readFile(file, "utf-8");
    const parsed = parse(source);
    for (const style of parsed.descriptor.styles) {
      combined += style.content + "\n";
    }
  }

  return combined;
}
