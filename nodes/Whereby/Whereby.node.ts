import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { wherebyApiRequest, wherebyApiRequestAllItems } from './GenericFunctions';

export class Whereby implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whereby',
		name: 'whereby',
		icon: 'file:whereby.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Whereby video conferencing API',
		defaults: {
			name: 'Whereby',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'wherebyApi',
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
						name: 'Meeting',
						value: 'meeting',
					},
					{
						name: 'Recording',
						value: 'recording',
					},
				],
				default: 'meeting',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['meeting'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new meeting',
						action: 'Create a meeting',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a meeting',
						action: 'Delete a meeting',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a meeting',
						action: 'Get a meeting',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all meetings',
						action: 'Get all meetings',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['recording'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a recording',
						action: 'Delete a recording',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a recording',
						action: 'Get a recording',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all recordings',
						action: 'Get all recordings',
					},
					{
						name: 'Get Access Link',
						value: 'getAccessLink',
						description: 'Get access link for a recording',
						action: 'Get access link for a recording',
					},
				],
				default: 'getAll',
			},

			// Meeting Operations
			{
				displayName: 'Meeting ID',
				name: 'meetingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['get', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the meeting',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'The end date and time for the meeting',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['create'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Is Locked',
						name: 'isLocked',
						type: 'boolean',
						default: false,
						description: 'Whether the room should be locked initially',
					},
					{
						displayName: 'Room Name Prefix',
						name: 'roomNamePrefix',
						type: 'string',
						default: '',
						description: 'Prefix for the room name',
					},
					{
						displayName: 'Room Name Pattern',
						name: 'roomNamePattern',
						type: 'options',
						options: [
							{
								name: 'UUID',
								value: 'uuid',
							},
							{
								name: 'Human Short',
								value: 'human-short',
							},
						],
						default: 'uuid',
						description: 'Pattern for generating room names',
					},
				],
			},

			// Recording Operations
			{
				displayName: 'Recording ID',
				name: 'recordingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['recording'],
						operation: ['get', 'delete', 'getAccessLink'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the recording',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['meeting', 'recording'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['meeting', 'recording'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'meeting') {
					if (operation === 'create') {
						const endDate = this.getNodeParameter('endDate', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);

						const body: any = {
							endDate,
						};

						Object.assign(body, additionalFields);

						const responseData = await wherebyApiRequest.call(this, 'POST', '/v1/meetings', body);
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'delete') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;
						await wherebyApiRequest.call(this, 'DELETE', `/v1/meetings/${meetingId}`);
						returnData.push({
							json: { success: true, meetingId },
							pairedItem: { item: i },
						});
					}

					if (operation === 'get') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/meetings/${meetingId}`);
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/meetings');
							returnData.push(...responseData.map((item: any) => ({
								json: item,
								pairedItem: { item: i },
							})));
						} else {
							const limit = this.getNodeParameter('limit', i);
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/meetings', {}, { limit });
							returnData.push(...responseData.results.map((item: any) => ({
								json: item,
								pairedItem: { item: i },
							})));
						}
					}
				}

				if (resource === 'recording') {
					if (operation === 'delete') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						await wherebyApiRequest.call(this, 'DELETE', `/v1/recordings/${recordingId}`);
						returnData.push({
							json: { success: true, recordingId },
							pairedItem: { item: i },
						});
					}

					if (operation === 'get') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/recordings/${recordingId}`);
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/recordings');
							returnData.push(...responseData.map((item: any) => ({
								json: item,
								pairedItem: { item: i },
							})));
						} else {
							const limit = this.getNodeParameter('limit', i);
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/recordings', {}, { limit });
							returnData.push(...responseData.results.map((item: any) => ({
								json: item,
								pairedItem: { item: i },
							})));
						}
					}

					if (operation === 'getAccessLink') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/recordings/${recordingId}/access-link`);
						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: { error: errorMessage },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}