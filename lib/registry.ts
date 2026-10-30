/* The catalogue. Every component page is generated from an entry here:
   `file` names the source in components/ui (its local imports are
   resolved for the install step), and each example name maps to a file
   in examples/ whose source is shown under the Code tab.            */

export interface RegistryExample {
  name: string;
  title: string;
  description?: string;
}

export interface RegistryEntry {
  slug: string;
  name: string;
  category: Category;
  description: string;
  file: string;
  usage: string;
  /** The first example is the page's hero preview */
  examples: RegistryExample[];
}

export const categories = [
  "actions",
  "forms",
  "navigation",
  "overlays",
  "feedback",
  "data display",
  "cards",
  "editorial",
] as const;

export type Category = (typeof categories)[number];

const ex = (name: string, title: string, description?: string): RegistryExample => ({
  name,
  title,
  description,
});

export const registry: RegistryEntry[] = [
  /* ── Actions ─────────────────────────────────────────────────── */
  {
    slug: "button",
    name: "button",
    category: "actions",
    description: "a raised face sitting in a bezel. the bezel stays put, the face lifts when you hover and sinks when you press.",
    file: "Button",
    usage: `<Button variant="primary">get started</Button>`,
    examples: [
      ex("button-demo", "default"),
      ex("button-variants", "variants", "primary and secondary are layered; outline is a lighter bezel; ghost is a single flat face."),
      ex("button-sizes", "sizes"),
      ex("button-with-icon", "with icon", "a trailing icon leans toward where the button is taking you."),
      ex("button-icon", "icon only", "use size=\"icon\" for a bezel-less key, or square for a layered one."),
      ex("button-on-dark", "on a dark surface", "tone=\"dark\" swaps secondary and outline to a dark face so they don't glare."),
    ],
  },
  {
    slug: "button-group",
    name: "button group",
    category: "actions",
    description: "a few keys sharing one bezel. handy for toolbars and social links.",
    file: "ButtonGroup",
    usage: `<ButtonGroup
  label="text formatting"
  items={[
    { label: "bold", content: <BoldIcon /> },
    { label: "italic", content: <ItalicIcon /> },
  ]}
/>`,
    examples: [
      ex("button-group-demo", "default"),
      ex("button-group-wide", "wide keys", "set wide on an item to size it to its content instead of a square."),
    ],
  },
  {
    slug: "close-button",
    name: "close button",
    category: "actions",
    description: "the little key that closes alerts, banners, modals and drawers.",
    file: "CloseButton",
    usage: `<CloseButton onClick={onClose} />`,
    examples: [
      ex("close-button-demo", "default"),
      ex("close-button-dark", "dark tone"),
    ],
  },

  /* ── Forms ───────────────────────────────────────────────────── */
  {
    slug: "input",
    name: "input",
    category: "forms",
    description: "a text field set into the surface. when you focus it, the well comes up flush and draws its border.",
    file: "Input",
    usage: `<Input label="email" placeholder="you@example.com" />`,
    examples: [
      ex("input-demo", "default"),
      ex("input-with-label", "with label and hint"),
      ex("input-with-icon", "with icon"),
      ex("input-error", "error"),
      ex("input-disabled", "disabled"),
    ],
  },
  {
    slug: "textarea",
    name: "textarea",
    category: "forms",
    description: "a field for longer writing. it can grow with what you type if you'd like.",
    file: "Textarea",
    usage: `<Textarea label="bio" placeholder="tell us about yourself…" />`,
    examples: [
      ex("textarea-demo", "default"),
      ex("textarea-auto-resize", "auto resize"),
      ex("textarea-error", "error"),
    ],
  },
  {
    slug: "select",
    name: "select",
    category: "forms",
    description: "looks like a field, opens a panel of options. works with the keyboard too.",
    file: "Select",
    usage: `<Select options={options} value={value} onChange={setValue} />`,
    examples: [
      ex("select-demo", "default"),
      ex("select-with-label", "with label"),
      ex("select-disabled", "disabled"),
    ],
  },
  {
    slug: "checkbox",
    name: "checkbox",
    category: "forms",
    description: "a small sunken box. the check pops in and draws itself when you tick it.",
    file: "Checkbox",
    usage: `<Checkbox label="weekly digest" checked={checked} onChange={setChecked} />`,
    examples: [
      ex("checkbox-demo", "default"),
      ex("checkbox-with-description", "with description"),
      ex("checkbox-indeterminate", "indeterminate"),
      ex("checkbox-disabled", "disabled"),
    ],
  },
  {
    slug: "radio-group",
    name: "radio group",
    category: "forms",
    description: "pick one option from a few. the dot slides over to whatever you choose.",
    file: "Radio",
    usage: `<RadioGroup options={options} value={value} onChange={setValue} />`,
    examples: [
      ex("radio-group-demo", "default"),
      ex("radio-group-disabled", "disabled option"),
    ],
  },
  {
    slug: "toggle",
    name: "toggle",
    category: "forms",
    description: "a switch for settings that should take effect right away.",
    file: "Toggle",
    usage: `<Toggle label="email notifications" checked={on} onChange={setOn} />`,
    examples: [
      ex("toggle-demo", "default"),
      ex("toggle-with-description", "with description"),
      ex("toggle-disabled", "disabled"),
    ],
  },
  {
    slug: "tag-input",
    name: "tag input",
    category: "forms",
    description: "type a word, hit enter or a comma, and it turns into a tag. backspace takes it away.",
    file: "TagInput",
    usage: `<TagInput value={tags} onChange={setTags} label="tags" />`,
    examples: [
      ex("tag-input-demo", "default"),
      ex("tag-input-max", "limited", "maxtags caps how many tags can be added."),
    ],
  },

  /* ── Navigation ──────────────────────────────────────────────── */
  {
    slug: "tabs",
    name: "tabs",
    category: "navigation",
    description: "a sunken well with a raised thumb that slides between tabs. arrow keys work as well.",
    file: "Tabs",
    usage: `<Tabs
  tabs={[
    { key: "overview", label: "overview", content: <p>…</p> },
    { key: "posts", label: "posts", content: <p>…</p> },
  ]}
/>`,
    examples: [
      ex("tabs-demo", "default"),
      ex("tabs-segmented", "segmented control", "leave out content and listen to onchange to use the well as a segmented control."),
    ],
  },
  {
    slug: "pagination",
    name: "pagination",
    category: "navigation",
    description: "page numbers in a well, with a thumb that slides to the page you're on.",
    file: "Pagination",
    usage: `<Pagination currentPage={page} totalPages={12} onPageChange={setPage} />`,
    examples: [ex("pagination-demo", "default")],
  },
  {
    slug: "breadcrumb",
    name: "breadcrumb",
    category: "navigation",
    description: "shows where you are, and how you got there.",
    file: "Breadcrumb",
    usage: `<Breadcrumb items={[{ label: "home", href: "/" }, { label: "components" }]} />`,
    examples: [ex("breadcrumb-demo", "default")],
  },
  {
    slug: "sidebar",
    name: "sidebar",
    category: "navigation",
    description: "grouped navigation in a panel. a dark pill slides to whatever's active.",
    file: "Sidebar",
    usage: `<Sidebar sections={sections} active={active} onSelect={setActive} />`,
    examples: [ex("sidebar-demo", "default")],
  },
  {
    slug: "steps",
    name: "steps",
    category: "navigation",
    description: "shows how far along someone is in a flow with a few steps.",
    file: "Steps",
    usage: `<Steps current={1} steps={[{ label: "account" }, { label: "profile" }, { label: "done" }]} />`,
    examples: [
      ex("steps-demo", "default"),
      ex("steps-interactive", "interactive"),
    ],
  },
  {
    slug: "table-of-contents",
    name: "table of contents",
    category: "navigation",
    description: "a thin track with a marker that follows the heading you're reading. the one on the right of these pages is this component.",
    file: "TableOfContents",
    usage: `<TableOfContents items={headings} activeKey={active} onSelect={scrollTo} />`,
    examples: [ex("table-of-contents-demo", "default")],
  },
  {
    slug: "command-palette",
    name: "command palette",
    category: "navigation",
    description: "a searchable list of actions in a dialog. press ⌘k on this site to try the one that searches these docs.",
    file: "CommandPalette",
    usage: `<CommandPalette open={open} onClose={() => setOpen(false)} sections={sections} />`,
    examples: [ex("command-palette-demo", "default")],
  },

  /* ── Overlays ────────────────────────────────────────────────── */
  {
    slug: "modal",
    name: "modal",
    category: "overlays",
    description: "a dialog that springs in over the page. escape closes it and focus goes back where it was.",
    file: "Modal",
    usage: `<Modal open={open} onClose={() => setOpen(false)} title="delete post?" actions={actions} />`,
    examples: [
      ex("modal-demo", "default"),
      ex("modal-with-form", "with content"),
    ],
  },
  {
    slug: "drawer",
    name: "drawer",
    category: "overlays",
    description: "a panel that slides in from the side, for things that don't need the whole page.",
    file: "Drawer",
    usage: `<Drawer open={open} onClose={() => setOpen(false)} title="edit settings">…</Drawer>`,
    examples: [
      ex("drawer-demo", "default"),
      ex("drawer-left", "left side"),
    ],
  },
  {
    slug: "popover",
    name: "popover",
    category: "overlays",
    description: "a bit of content that opens next to whatever you clicked.",
    file: "Popover",
    usage: `<Popover trigger={<Button variant="secondary">open</Button>}>…</Popover>`,
    examples: [
      ex("popover-demo", "default"),
      ex("popover-positions", "positions"),
    ],
  },
  {
    slug: "tooltip",
    name: "tooltip",
    category: "overlays",
    description: "a short label that shows up when you hover or focus something.",
    file: "Tooltip",
    usage: `<Tooltip content="edit post"><Button>edit</Button></Tooltip>`,
    examples: [
      ex("tooltip-demo", "default"),
      ex("tooltip-positions", "positions"),
    ],
  },
  {
    slug: "dropdown-menu",
    name: "dropdown menu",
    category: "overlays",
    description: "a menu of actions under a trigger, with shortcuts, dividers and a red one for deleting.",
    file: "DropdownMenu",
    usage: `<DropdownMenu trigger={<Button variant="secondary">options</Button>} items={items} onSelect={handle} />`,
    examples: [
      ex("dropdown-menu-demo", "default"),
      ex("dropdown-menu-with-icons", "with icons"),
    ],
  },
  {
    slug: "toast",
    name: "toast",
    category: "overlays",
    description: "little notes that stack up in the corner and fan out when you hover. wrap your app in ToastProvider, then call toast() from anywhere.",
    file: "Toast",
    usage: `// app/layout.tsx
<ToastProvider>{children}</ToastProvider>

// anywhere below it
const { toast } = useToast();
toast({ title: "post saved", variant: "success" });`,
    examples: [
      ex("toast-demo", "default"),
      ex("toast-variants", "variants"),
    ],
  },

  /* ── Feedback ────────────────────────────────────────────────── */
  {
    slug: "alert",
    name: "alert",
    category: "feedback",
    description: "a message that sits in the page, with an icon tile that changes per variant.",
    file: "Alert",
    usage: `<Alert variant="success" title="published" description="your post is live." />`,
    examples: [
      ex("alert-demo", "default"),
      ex("alert-variants", "variants"),
      ex("alert-dismissible", "dismissible"),
    ],
  },
  {
    slug: "banner",
    name: "banner",
    category: "feedback",
    description: "a wide announcement strip, built just like a primary button.",
    file: "Banner",
    usage: `<Banner dismissible>blurrow v1.0 is out.</Banner>`,
    examples: [
      ex("banner-demo", "default"),
      ex("banner-variants", "variants"),
      ex("banner-with-action", "with action"),
    ],
  },
  {
    slug: "progress",
    name: "progress",
    category: "feedback",
    description: "a track that fills up as something gets done.",
    file: "Progress",
    usage: `<Progress label="uploading" value={64} showValue />`,
    examples: [
      ex("progress-demo", "default"),
      ex("progress-stacked", "stacked"),
    ],
  },
  {
    slug: "skeleton",
    name: "skeleton",
    category: "feedback",
    description: "placeholders while things load. one band of light sweeps across all of them together.",
    file: "Skeleton",
    usage: `<Skeleton variant="text" lines={3} />`,
    examples: [
      ex("skeleton-demo", "default"),
      ex("skeleton-card", "cards"),
    ],
  },
  {
    slug: "empty-state",
    name: "empty state",
    category: "feedback",
    description: "what to show when a list or page has nothing in it yet, plus something to do about it.",
    file: "EmptyState",
    usage: `<EmptyState title="no posts yet" description="…" action={<Button>create post</Button>} />`,
    examples: [ex("empty-state-demo", "default")],
  },

  /* ── Data display ────────────────────────────────────────────── */
  {
    slug: "badge",
    name: "badge",
    category: "data display",
    description: "a small raised label for status and little bits of info.",
    file: "Badge",
    usage: `<Badge variant="accent">new</Badge>`,
    examples: [
      ex("badge-demo", "default"),
      ex("badge-variants", "variants"),
    ],
  },
  {
    slug: "avatar",
    name: "avatar",
    category: "data display",
    description: "someone's photo, or their initials on a raised tile when there isn't one.",
    file: "Avatar",
    usage: `<Avatar name="ada lovelace" />`,
    examples: [
      ex("avatar-demo", "default"),
      ex("avatar-sizes", "sizes"),
      ex("avatar-group", "group", "avatargroup overlaps its children and collapses the rest into a count."),
    ],
  },
  {
    slug: "kbd",
    name: "kbd",
    category: "data display",
    description: "a little keycap for keyboard shortcuts.",
    file: "Kbd",
    usage: `<Kbd>⌘k</Kbd>`,
    examples: [ex("kbd-demo", "default")],
  },
  {
    slug: "table",
    name: "table",
    category: "data display",
    description: "rows of data in a panel. you can render cells however you like and make rows clickable.",
    file: "Table",
    usage: `<Table columns={columns} rows={rows} title="recent posts" />`,
    examples: [ex("table-demo", "default")],
  },
  {
    slug: "data-list",
    name: "data list",
    category: "data display",
    description: "labels and values, for describing one thing in detail.",
    file: "DataList",
    usage: `<DataList items={[{ label: "author", value: "ada" }]} />`,
    examples: [
      ex("data-list-demo", "default"),
      ex("data-list-two-columns", "two columns"),
    ],
  },
  {
    slug: "stat",
    name: "stat",
    category: "data display",
    description: "a big number that counts up into place, with a label and a trend.",
    file: "Stat",
    usage: `<StatRow>
  <Stat value={2847} label="total reads" trend="↑ 12%" />
</StatRow>`,
    examples: [ex("stat-demo", "default")],
  },
  {
    slug: "stat-card",
    name: "stat card",
    category: "data display",
    description: "a number on a card, with how it's changed and an optional sparkline.",
    file: "StatCard",
    usage: `<StatCard label="monthly readers" value={24891} delta={{ value: "12.4%", direction: "up" }} />`,
    examples: [
      ex("stat-card-demo", "default"),
      ex("stat-card-dark", "dark"),
    ],
  },
  {
    slug: "timeline",
    name: "timeline",
    category: "data display",
    description: "a list of things that happened, newest first.",
    file: "Timeline",
    usage: `<Timeline items={events} />`,
    examples: [ex("timeline-demo", "default")],
  },
  {
    slug: "code-block",
    name: "code block",
    category: "data display",
    description: "code on a raised face, with the filename up top, light highlighting and a copy key.",
    file: "CodeBlock",
    usage: `<CodeBlock language="tsx" title="app.tsx" code={source} />`,
    examples: [
      ex("code-block-demo", "default"),
      ex("code-block-plain", "plain text", "languages other than js/ts are shown without highlighting."),
    ],
  },
  {
    slug: "accordion",
    name: "accordion",
    category: "data display",
    description: "sections that open up when you click them.",
    file: "Accordion",
    usage: `<Accordion items={[{ key: "1", title: "is it free?", content: "yes." }]} />`,
    examples: [
      ex("accordion-demo", "default"),
      ex("accordion-multiple", "multiple open"),
    ],
  },

  /* ── Cards ───────────────────────────────────────────────────── */
  {
    slug: "card-shell",
    name: "card shell",
    category: "cards",
    description: "the frame every card is built on: a bezel holding a face. content goes on the face, buttons and context go on the strip below.",
    file: "CardShell",
    usage: `<CardShell rail={<Button size="sm">open</Button>}>…</CardShell>`,
    examples: [
      ex("card-shell-demo", "default"),
      ex("card-shell-text-rail", "text rail", "railkind=\"text\" indents plain context to the face's text edge."),
      ex("card-shell-dark", "dark"),
    ],
  },
  {
    slug: "card",
    name: "card",
    category: "cards",
    description: "ready-made cards in two layouts: split (title and picture side by side) and stack (picture on top).",
    file: "Card",
    usage: `<Card title="newsletter" subtitle="ideas in your inbox" actions={<Button size="sm">subscribe</Button>} />`,
    examples: [
      ex("card-demo", "split"),
      ex("card-stack", "stack"),
      ex("card-grid", "grid", "cardgrid lays cards out two-up and stacks them on small screens."),
    ],
  },
  {
    slug: "quote-card",
    name: "quote card",
    category: "cards",
    description: "a quote, with who said it on the strip below.",
    file: "QuoteCard",
    usage: `<QuoteCard quote="…" author="ada lovelace" role="analyst" />`,
    examples: [
      ex("quote-card-demo", "default"),
      ex("quote-card-dark", "dark"),
    ],
  },
  {
    slug: "spotlight-card",
    name: "spotlight card",
    category: "cards",
    description: "a big card for announcements, with room for an eyebrow, an icon and a couple of buttons.",
    file: "SpotlightCard",
    usage: `<SpotlightCard title="realtime collaboration is here." subtitle="…" actions={…} />`,
    examples: [
      ex("spotlight-card-demo", "default"),
      ex("spotlight-card-light", "light"),
    ],
  },
  {
    slug: "author-card",
    name: "author card",
    category: "cards",
    description: "an author's avatar, name and bio, with a follow button.",
    file: "AuthorCard",
    usage: `<AuthorCard name="ada lovelace" bio="…" onFollow={follow} />`,
    examples: [ex("author-card-demo", "default")],
  },
  {
    slug: "carousel",
    name: "carousel",
    category: "cards",
    description: "slides that move on by themselves or when you nudge them, with a thin line showing time left.",
    file: "Carousel",
    usage: `<Carousel autoPlay items={[<CarouselSlide key="a" title="…" />]} />`,
    examples: [ex("carousel-demo", "default")],
  },

  /* ── Editorial ───────────────────────────────────────────────── */
  {
    slug: "reading-progress",
    name: "reading progress",
    category: "editorial",
    description: "a thin line along the top of the window that fills as you read.",
    file: "ReadingProgress",
    usage: `<ReadingProgress />`,
    examples: [ex("reading-progress-demo", "default", "it's mounted on this page. scroll and watch the top edge of the window.")],
  },
  {
    slug: "reading-time",
    name: "reading time",
    category: "editorial",
    description: "roughly how long an article takes to read.",
    file: "ReadingTime",
    usage: `<ReadingTime minutes={8} />`,
    examples: [ex("reading-time-demo", "default")],
  },
  {
    slug: "reaction-bar",
    name: "reaction bar",
    category: "editorial",
    description: "emoji reactions that count up when readers tap them.",
    file: "ReactionBar",
    usage: `<ReactionBar />`,
    examples: [ex("reaction-bar-demo", "default")],
  },
  {
    slug: "share-buttons",
    name: "share buttons",
    category: "editorial",
    description: "share a post to social sites, or copy its link.",
    file: "ShareButtons",
    usage: `<ShareButtons url={url} title={title} />`,
    examples: [ex("share-buttons-demo", "default")],
  },
];

export function getEntry(slug: string) {
  return registry.find((e) => e.slug === slug);
}

export function entriesByCategory() {
  return categories.map((category) => ({
    category,
    entries: registry.filter((e) => e.category === category),
  }));
}

/* Prev / next follow the sidebar's order, not the array's */
export function getNeighbours(slug: string) {
  const ordered = entriesByCategory().flatMap((g) => g.entries);
  const i = ordered.findIndex((e) => e.slug === slug);
  return { prev: ordered[i - 1], next: ordered[i + 1] };
}
