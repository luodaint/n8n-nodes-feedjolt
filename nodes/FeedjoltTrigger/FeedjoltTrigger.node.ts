import type {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError, type JsonObject } from 'n8n-workflow';

type PollState = {
	lastSeenIds?: string[];
};

export class FeedjoltTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Feedjolt Trigger',
		name: 'feedjoltTrigger',
		icon: { light: 'file:../../icons/feedjolt.svg', dark: 'file:../../icons/feedjolt.dark.svg' },
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when new Feedjolt posts appear',
		defaults: {
			name: 'Feedjolt Trigger',
		},
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'feedjoltApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Workspace Slug',
				name: 'workspaceSlug',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'luodaint',
				description: 'Must match the workspace the API key belongs to',
			},
			{
				displayName: 'Board ID',
				name: 'boardId',
				type: 'string',
				default: '',
				description: 'Optional board UUID filter',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const workspaceSlug = this.getNodeParameter('workspaceSlug') as string;
		const boardId = (this.getNodeParameter('boardId', '') as string) || undefined;

		const qs: IDataObject = {
			page_size: 20,
			sort_by: 'newest',
		};
		if (boardId) {
			qs.board_id = boardId;
		}

		let response: IDataObject;
		try {
			response = (await this.helpers.httpRequestWithAuthentication.call(this, 'feedjoltApi', {
				method: 'GET',
				baseURL: 'https://api.feedjolt.com/api/v1',
				url: `/workspaces/${encodeURIComponent(workspaceSlug)}/posts`,
				qs,
				json: true,
			})) as IDataObject;
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}

		const items = Array.isArray(response)
			? response
			: Array.isArray((response as IDataObject).items)
				? ((response as IDataObject).items as IDataObject[])
				: Array.isArray((response as IDataObject).results)
					? ((response as IDataObject).results as IDataObject[])
					: Array.isArray((response as IDataObject).data)
						? ((response as IDataObject).data as IDataObject[])
						: [];

		const staticData = this.getWorkflowStaticData('node') as PollState;
		const lastSeen = new Set(staticData.lastSeenIds ?? []);
		const isFirst = staticData.lastSeenIds === undefined;

		const currentIds = items
			.map((p) => String((p as IDataObject).id ?? ''))
			.filter(Boolean);

		if (isFirst) {
			staticData.lastSeenIds = currentIds;
			return null;
		}

		const fresh = items.filter((p) => {
			const id = String((p as IDataObject).id ?? '');
			return id && !lastSeen.has(id);
		});

		staticData.lastSeenIds = [...new Set([...currentIds, ...lastSeen])].slice(0, 200);

		if (!fresh.length) {
			return null;
		}

		return [this.helpers.returnJsonArray(fresh)];
	}
}
