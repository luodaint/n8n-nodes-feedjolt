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

## Usage example

These steps match the Feedjolt REST API (`https://api.feedjolt.com/api/v1`). Replace `your-workspace` and `feature-requests` with your workspace slug and board slug. Store the API key only in n8n credentials — do not put it in the workflow JSON.

### 1. Add Feedjolt credentials

1. In Feedjolt, create a workspace API key (it starts with `fjk_`).
2. In n8n: **Credentials → Add credential → Feedjolt API**.
3. Paste the key. The node sends `Authorization: Bearer <your key>` on every request.

Credential test: `GET /workspaces` against `https://api.feedjolt.com/api/v1`.

### 2. List posts

Add a **Feedjolt** node and set:

| Parameter | Value |
| --- | --- |
| Resource | Post |
| Operation | Get Many |
| Workspace Slug | `your-workspace` |
| Limit | `20` |
| Sort By | `newest` |
| Board ID | leave empty for all boards, or a board UUID |

That node calls:

```http
GET https://api.feedjolt.com/api/v1/workspaces/your-workspace/posts?page_size=20&sort_by=newest
Accept: application/json
Authorization: Bearer <your workspace API key>
```

Example response the node returns (shape of `PostListResponse`):

```json
{
  "posts": [
    {
      "id": "11111111-1111-4111-8111-111111111111",
      "workspace_id": "22222222-2222-4222-8222-222222222222",
      "board_id": "33333333-3333-4333-8333-333333333333",
      "author_type": "END_USER",
      "author_id": "44444444-4444-4444-8444-444444444444",
      "title": "Add Slack notifications for new feedback",
      "body": "When a customer submits a post, ping #feedback.",
      "status_id": "55555555-5555-4555-8555-555555555555",
      "owner_admin_id": null,
      "is_draft": false,
      "is_internal": false,
      "eta": null,
      "vote_count": 12,
      "weighted_score": 12,
      "comment_count": 3,
      "is_spam": false,
      "is_incognito": false,
      "merged_into_id": null,
      "created_at": "2026-09-18T14:22:00Z",
      "updated_at": "2026-09-20T09:01:00Z",
      "tags": []
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```

Use a later node to read a post, for example `{{$json.posts[0].id}}` or `{{$json.posts[0].title}}`.

### 3. Create a post

Add another **Feedjolt** node (or start a new workflow) and set:

| Parameter | Value |
| --- | --- |
| Resource | Post |
| Operation | Create |
| Workspace Slug | `your-workspace` |
| Board Slug | `feature-requests` |
| Title | `Add Slack notifications for new feedback` |
| Body | `When a customer submits a post, ping #feedback.` |
| Is Internal | `false` |

That node calls:

```http
POST https://api.feedjolt.com/api/v1/workspaces/your-workspace/boards/feature-requests/posts
Accept: application/json
Content-Type: application/json
Authorization: Bearer <your workspace API key>
```

```json
{
  "title": "Add Slack notifications for new feedback",
  "body": "When a customer submits a post, ping #feedback.",
  "is_internal": false
}
```

A successful create returns HTTP 201 and a `PostResponse` object (same fields as one entry in `posts` above), including the new `id`, `board_id`, `status_id`, `vote_count`, and `created_at`. Posts created with a workspace API key have `author_type` set to `API_KEY`.

### 4. Optional: poll for new posts

**Feedjolt Trigger** polls `GET /workspaces/{workspaceSlug}/posts?page_size=20&sort_by=newest` and emits only posts whose `id` was not seen on the previous poll. Set **Workspace Slug** and, if you want a single board, **Board ID**.

## Nodes

- **Feedjolt** — workspace, boards, posts (list / get / search / create / update status), roadmap, changelog, statuses, tags
- **Feedjolt Trigger** — poll for new posts (optional board filter)

## Docs

- Developers: https://www.feedjolt.com/en/docs/developers
- OpenAPI: https://api.feedjolt.com/openapi.json

## License

MIT
