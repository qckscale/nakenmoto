import { Client as NotionClient } from "@notionhq/client";
import { createClient as createSanityClient } from "@sanity/client";
import { randomUUID } from "crypto";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const NOTION_DATABASE_IDS = {
  collections: "8f450043-0f5e-4bdd-bbec-3ce6900cd3a7",
  products: "ede04074-b854-4d72-b792-734bb1bf7256",
  journal: "6047f2f4-7d00-466e-8579-1b23af190e1d",
  pages: "16ea9972-423b-4475-9322-eec6612e59e2",
} as const;

const SYNC_ORDER = ["collections", "products", "journal", "pages"] as const;

const STATUS_READY = "Klar för Sanity";
const STATUS_PUBLISHED = "Publicerad";

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

function getNotionClient() {
  const token = process.env.NOTION_API_KEY;
  if (!token) throw new Error("Missing NOTION_API_KEY");
  return new NotionClient({ auth: token });
}

function getSanityClient() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId) throw new Error("Missing SANITY_PROJECT_ID");
  if (!token) throw new Error("Missing SANITY_API_TOKEN");
  return createSanityClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type NotionPage = Awaited<
  ReturnType<NotionClient["pages"]["retrieve"]>
> & { properties: Record<string, any> };

function getPlainText(prop: any): string {
  if (!prop) return "";
  if (prop.type === "title") return prop.title?.map((t: any) => t.plain_text).join("") ?? "";
  if (prop.type === "rich_text") return prop.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
  if (prop.type === "select") return prop.select?.name ?? "";
  if (prop.type === "date") return prop.date?.start ?? "";
  if (prop.type === "status") return prop.status?.name ?? "";
  return "";
}

function toPortableText(text: string) {
  if (!text) return undefined;
  return [
    {
      _type: "block" as const,
      _key: randomUUID().slice(0, 8),
      children: [
        {
          _type: "span" as const,
          _key: randomUUID().slice(0, 8),
          text,
        },
      ],
      markDefs: [],
      style: "normal" as const,
    },
  ];
}

function detectContentType(
  databaseId: string
): "product" | "post" | "page" | "collection" | null {
  const normalized = databaseId.replace(/-/g, "");
  for (const [type, id] of Object.entries(NOTION_DATABASE_IDS)) {
    if (id.replace(/-/g, "") === normalized) {
      if (type === "collections") return "collection";
      if (type === "products") return "product";
      if (type === "journal") return "post";
      if (type === "pages") return "page";
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

type CollectionMap = Map<string, string>; // title (lowercased) → Sanity _id

async function buildCollectionMap(sanity: ReturnType<typeof getSanityClient>) {
  const collections: Array<{ _id: string; title: any }> = await sanity.fetch(
    `*[_type == "collection"]{ _id, title }`
  );
  const map: CollectionMap = new Map();
  for (const c of collections) {
    const sv = c.title?.sv?.toLowerCase();
    const en = c.title?.en?.toLowerCase();
    if (sv) map.set(sv, c._id);
    if (en) map.set(en, c._id);
  }
  return map;
}

function mapCollection(page: NotionPage, slug: string) {
  const p = page.properties;
  return {
    _id: `collection-${slug}`,
    _type: "collection",
    title: {
      _type: "localeString",
      sv: getPlainText(p["Kollektionsnamn (SV)"]),
      en: getPlainText(p["Kollektionsnamn (EN)"]),
    },
    slug: { _type: "slug", current: slug },
    description: {
      _type: "localeText",
      sv: getPlainText(p["Beskrivning (SV)"]),
      en: getPlainText(p["Beskrivning (EN)"]),
    },
    order: p["Ordning"]?.number ?? undefined,
    seo: {
      _type: "seo",
      title: {
        _type: "localeString",
        sv: getPlainText(p["SEO-titel (SV)"]),
        en: getPlainText(p["SEO-titel (EN)"]),
      },
      content: {
        _type: "localeText",
        sv: getPlainText(p["SEO-beskrivning (SV)"]),
        en: getPlainText(p["SEO-beskrivning (EN)"]),
      },
    },
  };
}

function mapProduct(
  page: NotionPage,
  slug: string,
  collectionMap: CollectionMap
) {
  const p = page.properties;
  const doc: Record<string, any> = {
    _id: `product-${slug}`,
    _type: "product",
    name: {
      _type: "localeString",
      sv: getPlainText(p["Produktnamn (SV)"]),
      en: getPlainText(p["Produktnamn (EN)"]),
    },
    slug: { _type: "slug", current: slug },
    description: {
      _type: "localeBlockContent",
      sv: toPortableText(getPlainText(p["Beskrivning (SV)"])),
      en: toPortableText(getPlainText(p["Beskrivning (EN)"])),
    },
    seo: {
      _type: "seo",
      title: {
        _type: "localeString",
        sv: getPlainText(p["SEO-titel (SV)"]),
        en: getPlainText(p["SEO-titel (EN)"]),
      },
      content: {
        _type: "localeText",
        sv: getPlainText(p["SEO-beskrivning (SV)"]),
        en: getPlainText(p["SEO-beskrivning (EN)"]),
      },
    },
  };

  const collectionValue = getPlainText(p["Collection"]);
  if (collectionValue) {
    const collectionId = collectionMap.get(collectionValue.toLowerCase());
    if (collectionId) {
      doc.collection = { _type: "reference", _ref: collectionId };
    } else {
      console.warn(`  Collection "${collectionValue}" not found in Sanity`);
    }
  }

  return doc;
}

function mapPost(page: NotionPage, slug: string) {
  const p = page.properties;
  return {
    _id: `post-${slug}`,
    _type: "post",
    title: {
      _type: "localeString",
      sv: getPlainText(p["Titel (SV)"]),
      en: getPlainText(p["Titel (EN)"]),
    },
    slug: { _type: "slug", current: slug },
    ingress: {
      _type: "localeString",
      sv: getPlainText(p["Ingress (SV)"]),
      en: getPlainText(p["Ingress (EN)"]),
    },
    body: {
      _type: "localeBlockContent",
      sv: toPortableText(getPlainText(p["Brödtext (SV)"])),
      en: toPortableText(getPlainText(p["Brödtext (EN)"])),
    },
    seo: {
      _type: "seo",
      title: {
        _type: "localeString",
        sv: getPlainText(p["SEO-titel (SV)"]),
        en: getPlainText(p["SEO-titel (EN)"]),
      },
      content: {
        _type: "localeText",
        sv: getPlainText(p["SEO-beskrivning (SV)"]),
        en: getPlainText(p["SEO-beskrivning (EN)"]),
      },
    },
    publishedAt: getPlainText(p["Publiceringsdatum"]) || undefined,
  };
}

function mapPage(page: NotionPage, slug: string) {
  const p = page.properties;
  return {
    _id: `page-${slug}`,
    _type: "page",
    title: {
      _type: "localeTitle",
      sv: getPlainText(p["Rubrik (SV)"]),
      en: getPlainText(p["Rubrik (EN)"]),
    },
    slug: { _type: "slug", current: slug },
    body: {
      _type: "localeBlockContent",
      sv: toPortableText(getPlainText(p["Brödtext (SV)"])),
      en: toPortableText(getPlainText(p["Brödtext (EN)"])),
    },
    seo: {
      _type: "seo",
      title: {
        _type: "localeString",
        sv: getPlainText(p["SEO-titel (SV)"]),
        en: getPlainText(p["SEO-titel (EN)"]),
      },
      content: {
        _type: "localeText",
        sv: getPlainText(p["SEO-beskrivning (SV)"]),
        en: getPlainText(p["SEO-beskrivning (EN)"]),
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Sync logic
// ---------------------------------------------------------------------------

async function syncPage(
  notion: ReturnType<typeof getNotionClient>,
  sanity: ReturnType<typeof getSanityClient> | null,
  pageId: string,
  collectionMap: CollectionMap,
  dryRun = false
) {
  const page = (await notion.pages.retrieve({ page_id: pageId })) as NotionPage;

  // Determine parent database
  const parentDb =
    "database_id" in (page as any).parent
      ? (page as any).parent.database_id
      : null;
  if (!parentDb) {
    console.error(`Page ${pageId} is not in a database, skipping.`);
    return;
  }

  const contentType = detectContentType(parentDb);
  if (!contentType) {
    console.error(`Unknown database ${parentDb} for page ${pageId}, skipping.`);
    return;
  }

  const slug = getPlainText(page.properties["Slug"]);
  if (!slug) {
    console.error(`Page ${pageId} has no Slug, skipping.`);
    return;
  }

  console.log(`Syncing ${contentType}: "${slug}"`);

  let doc: Record<string, any>;
  switch (contentType) {
    case "collection":
      doc = mapCollection(page, slug);
      break;
    case "product":
      doc = mapProduct(page, slug, collectionMap);
      break;
    case "post":
      doc = mapPost(page, slug);
      break;
    case "page":
      doc = mapPage(page, slug);
      break;
  }

  if (dryRun) {
    console.log(`  [DRY RUN] Would upsert:`);
    console.log(JSON.stringify(doc, null, 2));
    return;
  }

  // Upsert: patch existing docs to preserve images/thumbnails set in Sanity Studio
  const { _id, _type, ...fields } = doc;
  const exists = await sanity!.fetch("count(*[_id == $id])", { id: _id });
  if (exists) {
    await sanity!.patch(_id).set(fields).commit();
    console.log(`  -> Patched ${contentType} "${slug}" in Sanity`);
  } else {
    await sanity!.create(doc);
    console.log(`  -> Created ${contentType} "${slug}" in Sanity`);
  }

  // Update Notion status to "Publicerad"
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: { select: { name: STATUS_PUBLISHED } },
      },
    });
    console.log(`  -> Notion status set to "${STATUS_PUBLISHED}"`);
  } catch (err) {
    console.warn(`  -> Could not update Notion status: ${err}`);
  }
}

async function syncBatch(
  notion: ReturnType<typeof getNotionClient>,
  sanity: ReturnType<typeof getSanityClient> | null,
  dryRun = false
) {
  let total = 0;
  let collectionMap: CollectionMap = new Map();

  for (const type of SYNC_ORDER) {
    const dbId = NOTION_DATABASE_IDS[type];
    console.log(`\nQuerying ${type} database for "${STATUS_READY}" rows...`);

    const response = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Status",
        select: { equals: STATUS_READY },
      },
    });

    console.log(`  Found ${response.results.length} rows`);

    for (const page of response.results) {
      await syncPage(notion, sanity, page.id, collectionMap, dryRun);
      total++;
    }

    // After collections are synced, rebuild the map so products can resolve references
    if (type === "collections" && sanity) {
      collectionMap = await buildCollectionMap(sanity);
    }
  }

  console.log(`\nDone. ${dryRun ? "Previewed" : "Synced"} ${total} pages total.`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printHelp() {
  console.log(`
Usage: npx tsx scripts/notion-to-sanity.ts [options]

Options:
  --page-id <id>   Sync a single Notion page by ID
  --batch          Sync all rows with status "${STATUS_READY}"
  --dry-run        Preview sync output without writing to Sanity
  --help           Show this help message

Environment variables:
  NOTION_API_KEY      Notion integration token
  SANITY_PROJECT_ID   Sanity project ID (not required with --dry-run)
  SANITY_DATASET      Sanity dataset (default: production)
  SANITY_API_TOKEN    Sanity write token (not required with --dry-run)
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const dryRun = args.includes("--dry-run");
  const notion = getNotionClient();
  const sanity = dryRun ? null : getSanityClient();
  const collectionMap: CollectionMap = sanity
    ? await buildCollectionMap(sanity)
    : new Map();

  if (args.includes("--page-id")) {
    const idx = args.indexOf("--page-id");
    const pageId = args[idx + 1];
    if (!pageId) {
      console.error("Missing page ID after --page-id");
      process.exit(1);
    }
    await syncPage(notion, sanity, pageId, collectionMap, dryRun);
  } else if (args.includes("--batch")) {
    await syncBatch(notion, sanity, dryRun);
  } else {
    console.error("Unknown arguments. Use --help for usage.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
