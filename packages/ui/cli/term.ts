/* Terminal helpers: colour, symbols, prompts. No dependencies, so the
   CLI starts instantly under npx.                                   */
import readline from "node:readline";

const tty = Boolean(process.stdout.isTTY);
const colour = tty && !process.env.NO_COLOR && process.env.TERM !== "dumb";

const paint = (open: number, close: number) => (s: string | number) =>
  colour ? `\x1b[${open}m${s}\x1b[${close}m` : String(s);

export const c = {
  bold: paint(1, 22),
  dim: paint(2, 22),
  red: paint(31, 39),
  green: paint(32, 39),
  yellow: paint(33, 39),
  cyan: paint(36, 39),
  gray: paint(90, 39),
};

export const sym = {
  ok: c.green("✓"),
  warn: c.yellow("!"),
  fail: c.red("✗"),
  info: c.cyan("›"),
  dot: c.gray("·"),
};

export const log = {
  line: (s = "") => console.log(s),
  ok: (s: string) => console.log(`  ${sym.ok} ${s}`),
  warn: (s: string) => console.log(`  ${sym.warn} ${s}`),
  fail: (s: string) => console.log(`  ${sym.fail} ${s}`),
  info: (s: string) => console.log(`  ${sym.info} ${s}`),
  step: (s: string) => console.log(`\n${c.bold(s)}`),
  hint: (s: string) => console.log(`    ${c.gray(s)}`),
};

export const interactive = tty && Boolean(process.stdin.isTTY) && !process.env.CI;

/* Yes/no. Falls back to the default when there's no one to ask. */
export async function confirm(question: string, fallback = true, assumeYes = false): Promise<boolean> {
  if (assumeYes) return true;
  if (!interactive) return fallback;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const hint = fallback ? "Y/n" : "y/N";
  const answer: string = await new Promise((r) => rl.question(`  ${c.cyan("?")} ${question} ${c.gray(`(${hint})`)} `, r));
  rl.close();
  const a = answer.trim().toLowerCase();
  if (!a) return fallback;
  return a === "y" || a === "yes";
}

/* One of a few choices, picked by its first letter. */
export async function choose<T extends string>(question: string, options: { key: T; label: string }[], fallback: T): Promise<T> {
  if (!interactive) return fallback;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const keys = options.map((o) => (o.key === fallback ? c.bold(o.label) : o.label)).join(c.gray(" / "));
  const answer: string = await new Promise((r) => rl.question(`  ${c.cyan("?")} ${question} ${keys} `, r));
  rl.close();
  const a = answer.trim().toLowerCase();
  return options.find((o) => o.label.toLowerCase().startsWith(a) && a)?.key ?? fallback;
}

export interface PickItem {
  value: string;
  label: string;
  hint?: string;
  group?: string;
}

/* Arrow keys to move, space to toggle, ctrl+a for all, type to filter,
   enter to confirm, esc to cancel.                               */
export async function multiselect(title: string, items: PickItem[]): Promise<string[]> {
  if (!interactive) return [];
  const stdin = process.stdin;
  const out = process.stdout;
  const picked = new Set<string>();
  let cursor = 0;
  let filter = "";
  let drawn = 0;
  const rows = Math.max(6, Math.min(14, (out.rows ?? 24) - 6));

  const visible = () => {
    const f = filter.toLowerCase();
    return f ? items.filter((i) => i.label.toLowerCase().includes(f) || i.value.includes(f)) : items;
  };

  const draw = () => {
    const list = visible();
    cursor = Math.min(cursor, Math.max(0, list.length - 1));
    const start = Math.max(0, Math.min(cursor - Math.floor(rows / 2), list.length - rows));
    const page = list.slice(start, start + rows);
    const lines: string[] = [];
    lines.push(`  ${c.cyan("?")} ${c.bold(title)} ${c.gray(filter ? `filter: ${filter}` : "type to filter")}`);
    if (!list.length) lines.push(`    ${c.gray("nothing matches")}`);
    page.forEach((item, i) => {
      const at = start + i === cursor;
      const box = picked.has(item.value) ? c.green("◉") : c.gray("○");
      const label = at ? c.cyan(item.label) : item.label;
      const group = item.group ? c.gray(` ${item.group}`) : "";
      lines.push(`  ${at ? c.cyan("❯") : " "} ${box} ${label}${group}${at && item.hint ? c.gray(`  ${item.hint}`) : ""}`);
    });
    lines.push(c.gray(`    ↑↓ move · space pick · ctrl+a all · enter done · esc cancel   ${picked.size} picked`));
    if (drawn) out.write(`\x1b[${drawn}A\x1b[J`);
    out.write(lines.join("\n") + "\n");
    drawn = lines.length;
  };

  readline.emitKeypressEvents(stdin);
  stdin.setRawMode(true);
  stdin.resume();
  out.write("\x1b[?25l");

  return new Promise((resolve) => {
    const done = (value: string[]) => {
      stdin.off("keypress", onKey);
      stdin.setRawMode(false);
      stdin.pause();
      out.write("\x1b[?25h");
      resolve(value);
    };
    const onKey = (str: string | undefined, key: readline.Key) => {
      const list = visible();
      if (key.ctrl && key.name === "c") {
        out.write("\x1b[?25h\n");
        process.exit(130);
      }
      if (key.name === "escape") return done([]);
      if (key.name === "return") return done([...picked]);
      if (key.name === "up" || (key.ctrl && key.name === "p")) cursor = (cursor - 1 + list.length) % Math.max(1, list.length);
      else if (key.name === "down" || (key.ctrl && key.name === "n")) cursor = (cursor + 1) % Math.max(1, list.length);
      else if (key.name === "space") {
        const v = list[cursor]?.value;
        if (v) picked.has(v) ? picked.delete(v) : picked.add(v);
      } else if (key.name === "backspace") filter = filter.slice(0, -1);
      else if (key.ctrl && key.name === "a") {
        const all = list.every((i) => picked.has(i.value));
        list.forEach((i) => (all ? picked.delete(i.value) : picked.add(i.value)));
      } else if (str && /^[a-z0-9 -]$/i.test(str)) {
        filter += str.toLowerCase();
        cursor = 0;
      }
      draw();
    };
    stdin.on("keypress", onKey);
    draw();
  });
}
