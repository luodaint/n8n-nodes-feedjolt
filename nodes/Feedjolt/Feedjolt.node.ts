import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

export class Feedjolt implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Feedjolt',
		name: 'feedjolt',
		icon: { light: 'file:../../icons/feedjolt.svg', dark: 'file:../../icons/feedjolt.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Customer feedback boards and posts via the Feedjolt API',
		defaults: {
			name: 'Feedjolt',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'feedjoltApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.feedjolt.com/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Board', value: 'board' },
					{ name: 'Changelog', value: 'changelog' },
					{ name: 'Post', value: 'post' },
					{ name: 'Roadmap', value: 'roadmap' },
					{ name: 'Status', value: 'status' },
					{ name: 'Tag', value: 'tag' },
					{ name: 'Workspace', value: 'workspace' },
				],
				default: 'post',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['workspace'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'List workspaces',
						description: 'List workspaces for this API key',
						routing: {
							request: { method: 'GET', url: '/workspaces' },
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['board'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'List boards',
						routing: {
							request: {
								method: 'GET',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/boards',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['post'] } },
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a post',
						routing: {
							request: {
								method: 'POST',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/boards/{{$parameter.boardSlug}}/posts',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a post',
						routing: {
							request: {
								method: 'GET',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/posts/{{$parameter.postId}}',
							},
						},
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'List posts',
						routing: {
							request: {
								method: 'GET',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/posts',
							},
						},
					},
					{
						name: 'Search',
						value: 'search',
						action: 'Search posts',
						routing: {
							request: {
								method: 'GET',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/posts/search',
							},
						},
					},
					{
						name: 'Update Status',
						value: 'updateStatus',
						action: 'Change post status',
						routing: {
							request: {
								method: 'PUT',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/posts/{{$parameter.postId}}/status',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['roadmap'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get roadmap',
						routing: {
							request: {
								method: 'GET',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/roadmap',
							},
						},
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['changelog'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'List changelog',
						routing: {
							request: {
								method: 'GET',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/changelog',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['status'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'List statuses',
						routing: {
							request: {
								method: 'GET',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/statuses',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['tag'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'List tags',
						routing: {
							request: {
								method: 'GET',
								url: '=/workspaces/{{$parameter.workspaceSlug}}/tags',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Workspace Slug',
				name: 'workspaceSlug',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'luodaint',
				description: 'Must match the workspace the API key belongs to',
				displayOptions: {
					show: {
						resource: ['board', 'post', 'roadmap', 'changelog', 'status', 'tag'],
					},
				},
			},
			{
				displayName: 'Board Slug',
				name: 'boardSlug',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['post'], operation: ['create'] },
				},
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['post'], operation: ['create'] },
				},
				routing: {
					send: { type: 'body', property: 'title' },
				},
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				displayOptions: {
					show: { resource: ['post'], operation: ['create'] },
				},
				routing: {
					send: { type: 'body', property: 'body' },
				},
			},
			{
				displayName: 'Is Internal',
				name: 'isInternal',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: { resource: ['post'], operation: ['create'] },
				},
				routing: {
					send: { type: 'body', property: 'is_internal' },
				},
			},
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['post'], operation: ['get', 'updateStatus'] },
				},
			},
			{
				displayName: 'Status ID',
				name: 'statusId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: { resource: ['post'], operation: ['updateStatus'] },
				},
				routing: {
					send: { type: 'body', property: 'status_id' },
				},
			},
			{
				displayName: 'Search Query',
				name: 'q',
				type: 'string',
				required: true,
				default: '',
				description: 'Min 2 characters',
				displayOptions: {
					show: { resource: ['post'], operation: ['search'] },
				},
				routing: {
					send: { type: 'query', property: 'q' },
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 50,
				description: 'Max number of results to return',
				displayOptions: {
					show: { resource: ['post'], operation: ['getAll'] },
				},
				routing: {
					send: { type: 'query', property: 'page_size' },
				},
			},
			{
				displayName: 'Board ID',
				name: 'boardId',
				type: 'string',
				default: '',
				displayOptions: {
					show: { resource: ['post'], operation: ['getAll'] },
				},
				routing: {
					send: { type: 'query', property: 'board_id' },
				},
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'string',
				default: 'newest',
				displayOptions: {
					show: { resource: ['post'], operation: ['getAll'] },
				},
				routing: {
					send: { type: 'query', property: 'sort_by' },
				},
			},
			{
				displayName: 'Limit',
				name: 'changelogLimit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 20,
				displayOptions: {
					show: { resource: ['changelog'], operation: ['getAll'] },
				},
				routing: {
					send: { type: 'query', property: 'page_size' },
				},
			},
		],
	};
}
