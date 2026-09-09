import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FeedjoltApi implements ICredentialType {
	name = 'feedjoltApi';

	displayName = 'Feedjolt API';

	icon: Icon = { light: 'file:../icons/feedjolt.svg', dark: 'file:../icons/feedjolt.dark.svg' };

	documentationUrl = 'https://www.feedjolt.com/en/docs/developers';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Workspace API key (starts with fjk_). Create it in Feedjolt workspace settings.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.feedjolt.com/api/v1',
			url: '/workspaces',
			method: 'GET',
		},
	};
}
