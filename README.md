# n8n-nodes-feedjolt

Community node for [Feedjolt](https://www.feedjolt.com) — customer feedback boards, posts, roadmap, and changelog.

## Install

In n8n (self-hosted): **Settings → Community nodes → Install** → `n8n-nodes-feedjolt`

Or manually:

```bash
mkdir -p ~/.n8n/nodes && cd ~/.n8n/nodes
npm install n8n-nodes-feedjolt
```

Enable community packages (`N8N_COMMUNITY_PACKAGES_ENABLED=true`). On n8n 2.x you may also need `N8N_UNVERIFIED_PACKAGES_ENABLED=true` until the package is verified in the Creator Portal.

Fallback from GitHub (no registry): `npm install github:luodaint/n8n-nodes-feedjolt`

Local development:

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
