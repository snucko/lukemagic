declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"idea": {
"ambitious-card.md": {
	id: "ambitious-card.md";
  slug: "ambitious-card";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"card-on-ceiling.md": {
	id: "card-on-ceiling.md";
  slug: "card-on-ceiling";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"chinese-linking-rings.md": {
	id: "chinese-linking-rings.md";
  slug: "chinese-linking-rings";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"cups-and-balls.md": {
	id: "cups-and-balls.md";
  slug: "cups-and-balls";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"cut-and-restored-rope.md": {
	id: "cut-and-restored-rope.md";
  slug: "cut-and-restored-rope";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"floating-bill.md": {
	id: "floating-bill.md";
  slug: "floating-bill";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"mental-epic.md": {
	id: "mental-epic.md";
  slug: "mental-epic";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"misers-dream.md": {
	id: "misers-dream.md";
  slug: "misers-dream";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"ring-flight.md": {
	id: "ring-flight.md";
  slug: "ring-flight";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"sponge-balls.md": {
	id: "sponge-balls.md";
  slug: "sponge-balls";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-colorful-enigma.md": {
	id: "the-colorful-enigma.md";
  slug: "the-colorful-enigma";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-calendar.md": {
	id: "the-mysterious-calendar.md";
  slug: "the-mysterious-calendar";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-prediction.md": {
	id: "the-mysterious-prediction.md";
  slug: "the-mysterious-prediction";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-fiddle.md": {
	id: "the-vanishing-fiddle.md";
  slug: "the-vanishing-fiddle";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"torn-and-restored-newspaper.md": {
	id: "torn-and-restored-newspaper.md";
  slug: "torn-and-restored-newspaper";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
};
"posts": {
"welcome.md": {
	id: "welcome.md";
  slug: "welcome";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
};
"shows": {
"providence-street-fair.md": {
	id: "providence-street-fair.md";
  slug: "providence-street-fair";
  body: string;
  collection: "shows";
  data: InferEntrySchema<"shows">
} & { render(): Render[".md"] };
};
"tricks": {
"ambitious-card.md": {
	id: "ambitious-card.md";
  slug: "ambitious-card";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
"card-to-pocket.md": {
	id: "card-to-pocket.md";
  slug: "card-to-pocket";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
"chicago-opener.md": {
	id: "chicago-opener.md";
  slug: "chicago-opener";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
"coin-matrix.md": {
	id: "coin-matrix.md";
  slug: "coin-matrix";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
"coin-through-table.md": {
	id: "coin-through-table.md";
  slug: "coin-through-table";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
"coins-across.md": {
	id: "coins-across.md";
  slug: "coins-across";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
"copper-silver-brass.md": {
	id: "copper-silver-brass.md";
  slug: "copper-silver-brass";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
"french-drop.md": {
	id: "french-drop.md";
  slug: "french-drop";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
"spellbound.md": {
	id: "spellbound.md";
  slug: "spellbound";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
"three-card-monte.md": {
	id: "three-card-monte.md";
  slug: "three-card-monte";
  body: string;
  collection: "tricks";
  data: InferEntrySchema<"tricks">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
