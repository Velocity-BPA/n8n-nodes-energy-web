import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class EnergyWebApi implements ICredentialType {
	name = 'energyWebApi';
	displayName = 'Energy Web API';
	documentationUrl = 'https://energy-web-chain.gitbook.io/energy-web/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for authenticated RPC access (optional for public endpoints)',
		},
		{
			displayName: 'RPC Endpoint',
			name: 'rpcEndpoint',
			type: 'string',
			default: 'https://rpc.energyweb.org',
			description: 'Energy Web Chain RPC endpoint URL',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Private key for signing transactions and DID operations (optional)',
		},
	];
}