# Vercel React best practices notes

Source:
- https://vercel.com/blog/introducing-react-best-practices
- https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices

## Main idea

Start with the highest-impact problems first.

Vercel emphasizes this order:

1. eliminate async waterfalls
2. reduce bundle size
3. improve server-side performance
4. improve client-side fetching
5. reduce unnecessary re-renders

## Repeated root causes called out by Vercel

- async work that accidentally becomes sequential
- large client bundles that grow over time
- components that re-render more than needed

## Useful examples to remember

### Avoid waiting before branching

Bad:

```ts
const data = await fetchSomething()
if (skip) return early
return useData(data)
```

Better:

```ts
if (skip) return early
const data = await fetchSomething()
return useData(data)
```

### Use lazy initialization

If expensive initialization only needs to happen once, prefer lazy state initialization:

```ts
const [value] = useState(() => expensiveInit())
```

## How to apply in this repo

- Prefer Server Components by default.
- Keep `use client` boundaries tight.
- Avoid effect-driven derived state.
- Watch for client bundle creep as the app grows.
- Fix waterfalls before chasing smaller render tweaks.
