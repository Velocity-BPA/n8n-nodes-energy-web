/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-energyweb/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class EnergyWeb implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Energy Web',
    name: 'energyweb',
    icon: 'file:energyweb.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Energy Web API',
    defaults: {
      name: 'Energy Web',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'energywebApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'BlockchainRpc',
            value: 'blockchainRpc',
          },
          {
            name: 'DidRegistry',
            value: 'didRegistry',
          },
          {
            name: 'RenewableEnergyCredits',
            value: 'renewableEnergyCredits',
          },
          {
            name: 'EnergyAssetRegistry',
            value: 'energyAssetRegistry',
          }
        ],
        default: 'blockchainRpc',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['blockchainRpc'] } },
  options: [
    { name: 'Get Block Number', value: 'getBlockNumber', description: 'Get the latest block number on Energy Web Chain', action: 'Get latest block number' },
    { name: 'Get Block', value: 'getBlock', description: 'Get block by number or hash', action: 'Get block details' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction by hash', action: 'Get transaction details' },
    { name: 'Get Transaction Receipt', value: 'getTransactionReceipt', description: 'Get transaction receipt by hash', action: 'Get transaction receipt' },
    { name: 'Get Balance', value: 'getBalance', description: 'Get account balance for an address', action: 'Get account balance' },
    { name: 'Send Raw Transaction', value: 'sendRawTransaction', description: 'Send a signed transaction to the blockchain', action: 'Send raw transaction' },
    { name: 'Call Contract', value: 'call', description: 'Call a contract method', action: 'Call contract method' },
    { name: 'Estimate Gas', value: 'estimateGas', description: 'Estimate gas for a transaction', action: 'Estimate gas cost' }
  ],
  default: 'getBlockNumber',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['didRegistry'],
		},
	},
	options: [
		{
			name: 'Create DID',
			value: 'createDid',
			description: 'Create new DID document',
			action: 'Create DID',
		},
		{
			name: 'Resolve DID',
			value: 'resolveDid',
			description: 'Resolve DID to document',
			action: 'Resolve DID',
		},
		{
			name: 'Update DID',
			value: 'updateDid',
			description: 'Update DID document',
			action: 'Update DID',
		},
		{
			name: 'Deactivate DID',
			value: 'deactivateDid',
			description: 'Deactivate DID',
			action: 'Deactivate DID',
		},
		{
			name: 'Add Service',
			value: 'addService',
			description: 'Add service to DID',
			action: 'Add service',
		},
		{
			name: 'Remove Service',
			value: 'removeService',
			description: 'Remove service from DID',
			action: 'Remove service',
		},
	],
	default: 'createDid',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['renewableEnergyCredits'] } },
  options: [
    { name: 'Issue REC', value: 'issueRec', description: 'Issue new renewable energy certificate', action: 'Issue new renewable energy certificate' },
    { name: 'Transfer REC', value: 'transferRec', description: 'Transfer REC ownership', action: 'Transfer REC ownership' },
    { name: 'Retire REC', value: 'retireRec', description: 'Retire REC for consumption claim', action: 'Retire REC for consumption claim' },
    { name: 'Query REC', value: 'queryRec', description: 'Query REC details', action: 'Query REC details' },
    { name: 'List RECs', value: 'listRecs', description: 'List RECs by owner', action: 'List RECs by owner' },
    { name: 'Verify REC', value: 'verifyRec', description: 'Verify REC authenticity', action: 'Verify REC authenticity' },
  ],
  default: 'issueRec',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['energyAssetRegistry'] } },
  options: [
    { name: 'Register Asset', value: 'registerAsset', description: 'Register new energy asset', action: 'Register asset' },
    { name: 'Update Asset', value: 'updateAsset', description: 'Update asset information', action: 'Update asset' },
    { name: 'Transfer Asset', value: 'transferAsset', description: 'Transfer asset ownership', action: 'Transfer asset' },
    { name: 'Get Asset', value: 'getAsset', description: 'Get asset details', action: 'Get asset' },
    { name: 'List Assets', value: 'listAssets', description: 'List assets by owner', action: 'List assets' },
    { name: 'Verify Asset', value: 'verifyAsset', description: 'Verify asset registration', action: 'Verify asset' },
    { name: 'Deregister Asset', value: 'deregisterAsset', description: 'Remove asset from registry', action: 'Deregister asset' },
  ],
  default: 'registerAsset',
},
{
  displayName: 'Block Number/Hash',
  name: 'blockNumber',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['blockchainRpc'], operation: ['getBlock'] } },
  default: 'latest',
  description: 'Block number (hex) or block hash. Use "latest", "earliest", or "pending" for special blocks.',
},
{
  displayName: 'Include Transactions',
  name: 'includeTransactions',
  type: 'boolean',
  required: false,
  displayOptions: { show: { resource: ['blockchainRpc'], operation: ['getBlock'] } },
  default: false,
  description: 'Whether to include full transaction objects in the block',
},
{
  displayName: 'Transaction Hash',
  name: 'transactionHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['blockchainRpc'], operation: ['getTransaction', 'getTransactionReceipt'] } },
  default: '',
  description: 'The hash of the transaction to retrieve',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['blockchainRpc'], operation: ['getBalance'] } },
  default: '',
  description: 'The address to check the balance for',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['blockchainRpc'], operation: ['getBalance', 'call'] } },
  default: 'latest',
  description: 'Block number for balance check. Use "latest", "earliest", or "pending".',
},
{
  displayName: 'Signed Transaction Data',
  name: 'signedTransactionData',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['blockchainRpc'], operation: ['sendRawTransaction'] } },
  default: '',
  description: 'The signed transaction data in hex format',
},
{
  displayName: 'Contract Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['blockchainRpc'], operation: ['call'] } },
  default: '',
  description: 'The address of the contract to call',
},
{
  displayName: 'Call Data',
  name: 'data',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['blockchainRpc'], operation: ['call'] } },
  default: '',
  description: 'The encoded function call data',
},
{
  displayName: 'Transaction Object',
  name: 'transaction',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['blockchainRpc'], operation: ['estimateGas'] } },
  default: '{}',
  description: 'Transaction object containing to, from, data, value, etc.',
},
{
	displayName: 'DID Document',
	name: 'didDocument',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['didRegistry'],
			operation: ['createDid'],
		},
	},
	default: '{}',
	description: 'The DID document to create',
},
{
	displayName: 'Private Key',
	name: 'privateKey',
	type: 'string',
	typeOptions: {
		password: true,
	},
	required: true,
	displayOptions: {
		show: {
			resource: ['didRegistry'],
			operation: ['createDid', 'updateDid', 'deactivateDid', 'addService', 'removeService'],
		},
	},
	default: '',
	description: 'Private key for signing the transaction',
},
{
	displayName: 'DID',
	name: 'did',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['didRegistry'],
			operation: ['resolveDid', 'updateDid', 'deactivateDid', 'addService', 'removeService'],
		},
	},
	default: '',
	description: 'The DID identifier',
},
{
	displayName: 'Updates',
	name: 'updates',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['didRegistry'],
			operation: ['updateDid'],
		},
	},
	default: '{}',
	description: 'Updates to apply to the DID document',
},
{
	displayName: 'Service',
	name: 'service',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['didRegistry'],
			operation: ['addService'],
		},
	},
	default: '{}',
	description: 'Service to add to the DID document',
},
{
	displayName: 'Service ID',
	name: 'serviceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['didRegistry'],
			operation: ['removeService'],
		},
	},
	default: '',
	description: 'ID of the service to remove',
},
{
  displayName: 'Energy Data',
  name: 'energyData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['renewableEnergyCredits'],
      operation: ['issueRec'],
    },
  },
  default: '{}',
  description: 'Energy generation data for the REC',
},
{
  displayName: 'Issuer Private Key',
  name: 'issuerKey',
  type: 'string',
  typeOptions: { password: true },
  required: true,
  displayOptions: {
    show: {
      resource: ['renewableEnergyCredits'],
      operation: ['issueRec'],
    },
  },
  default: '',
  description: 'Private key of the REC issuer for transaction signing',
},
{
  displayName: 'REC ID',
  name: 'recId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['renewableEnergyCredits'],
      operation: ['transferRec', 'retireRec', 'queryRec', 'verifyRec'],
    },
  },
  default: '',
  description: 'Unique identifier of the renewable energy certificate',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['renewableEnergyCredits'],
      operation: ['transferRec'],
    },
  },
  default: '',
  description: 'Destination wallet address for REC transfer',
},
{
  displayName: 'From Private Key',
  name: 'fromKey',
  type: 'string',
  typeOptions: { password: true },
  required: true,
  displayOptions: {
    show: {
      resource: ['renewableEnergyCredits'],
      operation: ['transferRec'],
    },
  },
  default: '',
  description: 'Private key of the current REC owner for transaction signing',
},
{
  displayName: 'Owner Private Key',
  name: 'ownerKey',
  type: 'string',
  typeOptions: { password: true },
  required: true,
  displayOptions: {
    show: {
      resource: ['renewableEnergyCredits'],
      operation: ['retireRec'],
    },
  },
  default: '',
  description: 'Private key of the REC owner for retirement transaction signing',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['renewableEnergyCredits'],
      operation: ['listRecs'],
    },
  },
  default: '',
  description: 'Wallet address of the REC owner',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Transferred', value: 'transferred' },
    { name: 'Retired', value: 'retired' },
    { name: 'All', value: 'all' },
  ],
  displayOptions: {
    show: {
      resource: ['renewableEnergyCredits'],
      operation: ['listRecs'],
    },
  },
  default: 'all',
  description: 'Filter RECs by status',
},
{
  displayName: 'Asset Data',
  name: 'assetData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['energyAssetRegistry'], operation: ['registerAsset'] } },
  default: '{}',
  description: 'Asset registration data including metadata, capacity, and location',
},
{
  displayName: 'Owner Key',
  name: 'ownerKey',
  type: 'string',
  required: true,
  typeOptions: { password: true },
  displayOptions: { show: { resource: ['energyAssetRegistry'], operation: ['registerAsset', 'updateAsset', 'transferAsset', 'deregisterAsset'] } },
  default: '',
  description: 'Private key or DID for asset owner authentication',
},
{
  displayName: 'Asset ID',
  name: 'assetId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['energyAssetRegistry'], operation: ['updateAsset', 'transferAsset', 'getAsset', 'verifyAsset', 'deregisterAsset'] } },
  default: '',
  description: 'Unique identifier of the energy asset',
},
{
  displayName: 'Updates',
  name: 'updates',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['energyAssetRegistry'], operation: ['updateAsset'] } },
  default: '{}',
  description: 'Asset updates to apply',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['energyAssetRegistry'], operation: ['transferAsset'] } },
  default: '',
  description: 'Destination address or DID for asset transfer',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['energyAssetRegistry'], operation: ['listAssets'] } },
  default: '',
  description: 'Address or DID of the asset owner',
},
{
  displayName: 'Asset Type',
  name: 'assetType',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['energyAssetRegistry'], operation: ['listAssets'] } },
  options: [
    { name: 'Solar Panel', value: 'solar' },
    { name: 'Wind Turbine', value: 'wind' },
    { name: 'Battery Storage', value: 'battery' },
    { name: 'Hydroelectric', value: 'hydro' },
    { name: 'Biomass', value: 'biomass' },
    { name: 'Geothermal', value: 'geothermal' },
    { name: 'All Types', value: '' },
  ],
  default: '',
  description: 'Filter assets by energy generation type',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'blockchainRpc':
        return [await executeBlockchainRpcOperations.call(this, items)];
      case 'didRegistry':
        return [await executeDidRegistryOperations.call(this, items)];
      case 'renewableEnergyCredits':
        return [await executeRenewableEnergyCreditsOperations.call(this, items)];
      case 'energyAssetRegistry':
        return [await executeEnergyAssetRegistryOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeBlockchainRpcOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('energywebApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      let rpcPayload: any;

      switch (operation) {
        case 'getBlockNumber': {
          rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1
          };
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(rpcPayload),
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlock': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const includeTransactions = this.getNodeParameter('includeTransactions', i) as boolean;
          
          rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [blockNumber, includeTransactions],
            id: 1
          };
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(rpcPayload),
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransaction': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;
          
          rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [transactionHash],
            id: 1
          };
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(rpcPayload),
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionReceipt': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;
          
          rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [transactionHash],
            id: 1
          };
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(rpcPayload),
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          
          rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [address, blockNumber],
            id: 1
          };
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(rpcPayload),
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'sendRawTransaction': {
          const signedTransactionData = this.getNodeParameter('signedTransactionData', i) as string;
          
          rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_sendRawTransaction',
            params: [signedTransactionData],
            id: 1
          };
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(rpcPayload),
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'call': {
          const to = this.getNodeParameter('to', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          
          const callObject = { to, data };
          rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [callObject, blockNumber],
            id: 1
          };
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(rpcPayload),
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'estimateGas': {
          const transaction = this.getNodeParameter('transaction', i) as any;
          
          rpcPayload = {
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [transaction],
            id: 1
          };
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(rpcPayload),
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message },
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeDidRegistryOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('energywebApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createDid': {
					const didDocument = this.getNodeParameter('didDocument', i) as any;
					const privateKey = this.getNodeParameter('privateKey', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/did/create`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							didDocument,
							privateKey,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'resolveDid': {
					const did = this.getNodeParameter('did', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/did/resolve`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							did,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateDid': {
					const did = this.getNodeParameter('did', i) as string;
					const updates = this.getNodeParameter('updates', i) as any;
					const privateKey = this.getNodeParameter('privateKey', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/did/update`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							did,
							updates,
							privateKey,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deactivateDid': {
					const did = this.getNodeParameter('did', i) as string;
					const privateKey = this.getNodeParameter('privateKey', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/did/deactivate`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							did,
							privateKey,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'addService': {
					const did = this.getNodeParameter('did', i) as string;
					const service = this.getNodeParameter('service', i) as any;
					const privateKey = this.getNodeParameter('privateKey', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/did/add-service`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							did,
							service,
							privateKey,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'removeService': {
					const did = this.getNodeParameter('did', i) as string;
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const privateKey = this.getNodeParameter('privateKey', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/did/remove-service`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							did,
							serviceId,
							privateKey,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{
							itemIndex: i,
						},
					);
			}

			returnData.push({
				json: result,
				pairedItem: {
					item: i,
				},
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: {
						item: i,
					},
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeRenewableEnergyCreditsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('energywebApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'issueRec': {
          const energyData = this.getNodeParameter('energyData', i) as object;
          const issuerKey = this.getNodeParameter('issuerKey', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              method: 'issueRec',
              params: {
                energyData,
                issuerKey,
              },
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'transferRec': {
          const recId = this.getNodeParameter('recId', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const fromKey = this.getNodeParameter('fromKey', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              method: 'transferRec',
              params: {
                recId,
                toAddress,
                fromKey,
              },
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'retireRec': {
          const recId = this.getNodeParameter('recId', i) as string;
          const ownerKey = this.getNodeParameter('ownerKey', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              method: 'retireRec',
              params: {
                recId,
                ownerKey,
              },
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'queryRec': {
          const recId = this.getNodeParameter('recId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              method: 'queryRec',
              params: {
                recId,
              },
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listRecs': {
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              method: 'listRecs',
              params: {
                ownerAddress,
                status,
              },
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'verifyRec': {
          const recId = this.getNodeParameter('recId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              method: 'verifyRec',
              params: {
                recId,
              },
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeEnergyAssetRegistryOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('energywebApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'registerAsset': {
          const assetData = this.getNodeParameter('assetData', i) as object;
          const ownerKey = this.getNodeParameter('ownerKey', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              method: 'registerAsset',
              params: {
                assetData,
                ownerKey,
              },
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateAsset': {
          const assetId = this.getNodeParameter('assetId', i) as string;
          const updates = this.getNodeParameter('updates', i) as object;
          const ownerKey = this.getNodeParameter('ownerKey', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              method: 'updateAsset',
              params: {
                assetId,
                updates,
                ownerKey,
              },
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'transferAsset': {
          const assetId = this.getNodeParameter('assetId', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const ownerKey = this.getNodeParameter('ownerKey', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              method: 'transferAsset',
              params: {
                assetId,
                toAddress,
                ownerKey,
              },
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAsset': {
          const assetId = this.getNodeParameter('assetId', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              method: 'getAsset',
              params: {
                assetId,
              },
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'listAssets': {
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
          const assetType = this.getNodeParameter('assetType', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              method: 'listAssets',
              params: {
                ownerAddress,
                assetType: assetType || undefined,
              },
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'verifyAsset': {
          const assetId = this.getNodeParameter('assetId', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              method: 'verifyAsset',
              params: {
                assetId,
              },
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'deregisterAsset': {
          const assetId = this.getNodeParameter('assetId', i) as string;
          const ownerKey = this.getNodeParameter('ownerKey', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              method: 'deregisterAsset',
              params: {
                assetId,
                ownerKey,
              },
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}
