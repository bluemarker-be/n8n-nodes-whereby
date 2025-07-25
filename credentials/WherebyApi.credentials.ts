import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WherebyApi implements ICredentialType {
	name = 'wherebyApi';
	displayName = 'Whereby API';
	documentationUrl = 'https://docs.whereby.com/reference/whereby-rest-api-reference';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Whereby API Bearer Token',
			required: true,
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
			baseURL: 'https://api.whereby.dev',
			url: '/v1/meetings',
			method: 'GET',
		},
	};
}