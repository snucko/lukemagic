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
"color-harmony.md": {
	id: "color-harmony.md";
  slug: "color-harmony";
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
"floating-flower-bouquet.md": {
	id: "floating-flower-bouquet.md";
  slug: "floating-flower-bouquet";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"floating-fruit.md": {
	id: "floating-fruit.md";
  slug: "floating-fruit";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"floating-petal.md": {
	id: "floating-petal.md";
  slug: "floating-petal";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"floating-petals-magic-trick.md": {
	id: "floating-petals-magic-trick.md";
  slug: "floating-petals-magic-trick";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"floating-petals.md": {
	id: "floating-petals.md";
  slug: "floating-petals";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"floating-treat.md": {
	id: "floating-treat.md";
  slug: "floating-treat";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"heres-a-unique-mentalism-trick-that-reads-minds-an.md": {
	id: "heres-a-unique-mentalism-trick-that-reads-minds-an.md";
  slug: "heres-a-unique-mentalism-trick-that-reads-minds-an";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"id-like-to-introduce-a-unique-twist-on-the-classic.md": {
	id: "id-like-to-introduce-a-unique-twist-on-the-classic.md";
  slug: "id-like-to-introduce-a-unique-twist-on-the-classic";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"id-like-to-introduce-you-to-a-unique-twist-on-the-.md": {
	id: "id-like-to-introduce-you-to-a-unique-twist-on-the-.md";
  slug: "id-like-to-introduce-you-to-a-unique-twist-on-the-";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"id-like-to-introduce-you-to-the-vanishing-thread-t.md": {
	id: "id-like-to-introduce-you-to-the-vanishing-thread-t.md";
  slug: "id-like-to-introduce-you-to-the-vanishing-thread-t";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"lost-and-found.md": {
	id: "lost-and-found.md";
  slug: "lost-and-found";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"magic-trick-the-color-code.md": {
	id: "magic-trick-the-color-code.md";
  slug: "magic-trick-the-color-code";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"magic-trick-the-lost-memory.md": {
	id: "magic-trick-the-lost-memory.md";
  slug: "magic-trick-the-lost-memory";
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
"mystery-blossom.md": {
	id: "mystery-blossom.md";
  slug: "mystery-blossom";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"number-harmony.md": {
	id: "number-harmony.md";
  slug: "number-harmony";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"rainbow-vortex.md": {
	id: "rainbow-vortex.md";
  slug: "rainbow-vortex";
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
"the-color-code.md": {
	id: "the-color-code.md";
  slug: "the-color-code";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-color-connection.md": {
	id: "the-color-connection.md";
  slug: "the-color-connection";
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
"the-crystal-ball.md": {
	id: "the-crystal-ball.md";
  slug: "the-crystal-ball";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-curious-connection.md": {
	id: "the-curious-connection.md";
  slug: "the-curious-connection";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-dreamcatcher.md": {
	id: "the-dreamcatcher.md";
  slug: "the-dreamcatcher";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-floating-flower.md": {
	id: "the-floating-flower.md";
  slug: "the-floating-flower";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-lost-and-found-prediction.md": {
	id: "the-lost-and-found-prediction.md";
  slug: "the-lost-and-found-prediction";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-memory-box.md": {
	id: "the-memory-box.md";
  slug: "the-memory-box";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-memory-match.md": {
	id: "the-memory-match.md";
  slug: "the-memory-match";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-missing-ace.md": {
	id: "the-missing-ace.md";
  slug: "the-missing-ace";
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
"the-mysterious-clockwork-box.md": {
	id: "the-mysterious-clockwork-box.md";
  slug: "the-mysterious-clockwork-box";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-connection.md": {
	id: "the-mysterious-connection.md";
  slug: "the-mysterious-connection";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-double-prediction.md": {
	id: "the-mysterious-double-prediction.md";
  slug: "the-mysterious-double-prediction";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-exchange.md": {
	id: "the-mysterious-exchange.md";
  slug: "the-mysterious-exchange";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-floating-book.md": {
	id: "the-mysterious-floating-book.md";
  slug: "the-mysterious-floating-book";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-floating-garden.md": {
	id: "the-mysterious-floating-garden.md";
  slug: "the-mysterious-floating-garden";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-floating-orb.md": {
	id: "the-mysterious-floating-orb.md";
  slug: "the-mysterious-floating-orb";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-flower-petal.md": {
	id: "the-mysterious-flower-petal.md";
  slug: "the-mysterious-flower-petal";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-library.md": {
	id: "the-mysterious-library.md";
  slug: "the-mysterious-library";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-match.md": {
	id: "the-mysterious-match.md";
  slug: "the-mysterious-match";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-memory-deck.md": {
	id: "the-mysterious-memory-deck.md";
  slug: "the-mysterious-memory-deck";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-memory.md": {
	id: "the-mysterious-memory.md";
  slug: "the-mysterious-memory";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-number-sequence.md": {
	id: "the-mysterious-number-sequence.md";
  slug: "the-mysterious-number-sequence";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-oracle.md": {
	id: "the-mysterious-oracle.md";
  slug: "the-mysterious-oracle";
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
"the-mysterious-signature.md": {
	id: "the-mysterious-signature.md";
  slug: "the-mysterious-signature";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-time-capsule.md": {
	id: "the-mysterious-time-capsule.md";
  slug: "the-mysterious-time-capsule";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-traveler.md": {
	id: "the-mysterious-traveler.md";
  slug: "the-mysterious-traveler";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-mysterious-vanishing-book.md": {
	id: "the-mysterious-vanishing-book.md";
  slug: "the-mysterious-vanishing-book";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-time-capsule.md": {
	id: "the-time-capsule.md";
  slug: "the-time-capsule";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-timeline-prediction.md": {
	id: "the-timeline-prediction.md";
  slug: "the-timeline-prediction";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-traveling-signature.md": {
	id: "the-traveling-signature.md";
  slug: "the-traveling-signature";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-balloon.md": {
	id: "the-vanishing-balloon.md";
  slug: "the-vanishing-balloon";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-blooming-bouquet.md": {
	id: "the-vanishing-blooming-bouquet.md";
  slug: "the-vanishing-blooming-bouquet";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-book.md": {
	id: "the-vanishing-book.md";
  slug: "the-vanishing-book";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-butterfly.md": {
	id: "the-vanishing-butterfly.md";
  slug: "the-vanishing-butterfly";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-coin-in-the-palm.md": {
	id: "the-vanishing-coin-in-the-palm.md";
  slug: "the-vanishing-coin-in-the-palm";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-coin-in-the-pocket.md": {
	id: "the-vanishing-coin-in-the-pocket.md";
  slug: "the-vanishing-coin-in-the-pocket";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-coin-in-the-vase.md": {
	id: "the-vanishing-coin-in-the-vase.md";
  slug: "the-vanishing-coin-in-the-vase";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-coin-in-the-wooden-box.md": {
	id: "the-vanishing-coin-in-the-wooden-box.md";
  slug: "the-vanishing-coin-in-the-wooden-box";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-copper-coin.md": {
	id: "the-vanishing-copper-coin.md";
  slug: "the-vanishing-copper-coin";
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
"the-vanishing-flower.md": {
	id: "the-vanishing-flower.md";
  slug: "the-vanishing-flower";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-garden.md": {
	id: "the-vanishing-garden.md";
  slug: "the-vanishing-garden";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-glass-of-water.md": {
	id: "the-vanishing-glass-of-water.md";
  slug: "the-vanishing-glass-of-water";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-key-trick-lost-in-the-aisle.md": {
	id: "the-vanishing-key-trick-lost-in-the-aisle.md";
  slug: "the-vanishing-key-trick-lost-in-the-aisle";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-knot.md": {
	id: "the-vanishing-knot.md";
  slug: "the-vanishing-knot";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-loop.md": {
	id: "the-vanishing-loop.md";
  slug: "the-vanishing-loop";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-petal.md": {
	id: "the-vanishing-petal.md";
  slug: "the-vanishing-petal";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-pocket-change.md": {
	id: "the-vanishing-pocket-change.md";
  slug: "the-vanishing-pocket-change";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-pocket.md": {
	id: "the-vanishing-pocket.md";
  slug: "the-vanishing-pocket";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-pup.md": {
	id: "the-vanishing-pup.md";
  slug: "the-vanishing-pup";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-quarter.md": {
	id: "the-vanishing-quarter.md";
  slug: "the-vanishing-quarter";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-sock.md": {
	id: "the-vanishing-sock.md";
  slug: "the-vanishing-sock";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-spoon.md": {
	id: "the-vanishing-spoon.md";
  slug: "the-vanishing-spoon";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-sugar-cube.md": {
	id: "the-vanishing-sugar-cube.md";
  slug: "the-vanishing-sugar-cube";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-tea-light.md": {
	id: "the-vanishing-tea-light.md";
  slug: "the-vanishing-tea-light";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-thread.md": {
	id: "the-vanishing-thread.md";
  slug: "the-vanishing-thread";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-timepiece.md": {
	id: "the-vanishing-timepiece.md";
  slug: "the-vanishing-timepiece";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-vase.md": {
	id: "the-vanishing-vase.md";
  slug: "the-vanishing-vase";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"the-vanishing-water-drop.md": {
	id: "the-vanishing-water-drop.md";
  slug: "the-vanishing-water-drop";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"timeless-fate.md": {
	id: "timeless-fate.md";
  slug: "timeless-fate";
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
"trick-name-minds-eye.md": {
	id: "trick-name-minds-eye.md";
  slug: "trick-name-minds-eye";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"trick-name-the-time-travelers-deck.md": {
	id: "trick-name-the-time-travelers-deck.md";
  slug: "trick-name-the-time-travelers-deck";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"trick-name-the-time-travelers-prediction.md": {
	id: "trick-name-the-time-travelers-prediction.md";
  slug: "trick-name-the-time-travelers-prediction";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"twist-on-the-vanishing-salt-trick.md": {
	id: "twist-on-the-vanishing-salt-trick.md";
  slug: "twist-on-the-vanishing-salt-trick";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"vanishing-petals.md": {
	id: "vanishing-petals.md";
  slug: "vanishing-petals";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
} & { render(): Render[".md"] };
"vanishing-thread.md": {
	id: "vanishing-thread.md";
  slug: "vanishing-thread";
  body: string;
  collection: "idea";
  data: InferEntrySchema<"idea">
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

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
