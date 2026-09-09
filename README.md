# n8n-nodes-feedjolt

Community node for [Feedjolt](https://www.feedjolt.com) — customer feedback boards, posts, roadmap, and changelog.

## Install

In n8n: **Settings → Community nodes → Install** → `n8n-nodes-feedjolt`

Or locally:

```bash
npm install
npm run build
npm run dev
```

## Credentials

Create a workspace API key in Feedjolt (starts with `fjk_`). The node sends `Authorization: Bearer fjk_…`.

The workspace slug you pass must match the key’s workspace.

> Cursor / agent MCP uses OAuth 2.1 on `/mcp/reader/` and `/mcp/writer/`. This n8n package talks to the REST API with API keys.

## Nodes

- **Feedjolt** — workspace, boards, posts (list / get / search / create / update status), roadmap, changelog, statuses, tags
- **Feedjolt Trigger** — poll for new posts (optional board filter)

## Docs

- Developers: https://www.feedjolt.com/en/docs/developers
- OpenAPI: https://api.feedjolt.com/openapi.json

## License

MIT
