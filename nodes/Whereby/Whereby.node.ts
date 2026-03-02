import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';

import {
	wherebyApiRequest,
	wherebyApiRequestAllItems,
	wherebyApiRequestMultipart,
} from './GenericFunctions';

import { meetingOperations, meetingFields } from './descriptions/MeetingDescription';
import { recordingOperations, recordingFields } from './descriptions/RecordingDescription';
import { transcriptionOperations, transcriptionFields } from './descriptions/TranscriptionDescription';
import { summaryOperations, summaryFields } from './descriptions/SummaryDescription';
import { insightOperations, insightFields } from './descriptions/InsightDescription';
import { roomOperations, roomFields } from './descriptions/RoomDescription';

export class Whereby implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whereby',
		name: 'whereby',
		icon: 'file:../../icons/whereby.svg',
		group: ['transform'],
		version: 2,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Whereby video conferencing API',
		defaults: {
			name: 'Whereby',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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
						name: 'Insight',
						value: 'insight',
					},
					{
						name: 'Meeting',
						value: 'meeting',
					},
					{
						name: 'Recording',
						value: 'recording',
					},
					{
						name: 'Room',
						value: 'room',
					},
					{
						name: 'Summary',
						value: 'summary',
					},
					{
						name: 'Transcription',
						value: 'transcription',
					},
				],
				default: 'meeting',
			},
			...meetingOperations,
			...meetingFields,
			...recordingOperations,
			...recordingFields,
			...transcriptionOperations,
			...transcriptionFields,
			...summaryOperations,
			...summaryFields,
			...insightOperations,
			...insightFields,
			...roomOperations,
			...roomFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				// ---------------------------------------------------------------
				//                          Meeting
				// ---------------------------------------------------------------
				if (resource === 'meeting') {
					if (operation === 'create') {
						const endDate = this.getNodeParameter('endDate', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const recordingSettings = this.getNodeParameter('recordingSettings', i, {}) as any;
						const liveTranscriptionSettings = this.getNodeParameter('liveTranscriptionSettings', i, {}) as any;
						const streamingSettings = this.getNodeParameter('streamingSettings', i, {}) as any;

						const body: any = { endDate };

						// Add fields query param if set
						if (additionalFields.fields && (additionalFields.fields as string[]).length > 0) {
							body.fields = additionalFields.fields;
						}

						// Copy remaining additionalFields (except fields)
						const { fields, ...rest } = additionalFields;
						Object.assign(body, rest);

						if (Object.keys(recordingSettings).length > 0) {
							body.recording = {
								type: recordingSettings.type || 'none',
								destination: null,
							};
							if (recordingSettings.type && recordingSettings.type !== 'none') {
								body.recording.startTrigger = recordingSettings.startTrigger || null;
							}
						}

						if (Object.keys(liveTranscriptionSettings).length > 0) {
							body.liveTranscription = { destination: null };
							if (liveTranscriptionSettings.startTrigger) {
								body.liveTranscription.startTrigger = liveTranscriptionSettings.startTrigger === '' ? null : liveTranscriptionSettings.startTrigger;
							}
							if (liveTranscriptionSettings.language) {
								body.liveTranscription.language = liveTranscriptionSettings.language;
							}
							if (liveTranscriptionSettings.liveCaptions !== undefined) {
								body.liveTranscription.liveCaptions = liveTranscriptionSettings.liveCaptions;
							}
						}

						if (Object.keys(streamingSettings).length > 0) {
							body.streaming = { destination: null };
							if (streamingSettings.startTrigger) {
								body.streaming.startTrigger = streamingSettings.startTrigger === '' ? null : streamingSettings.startTrigger;
							}
						}

						const responseData = await wherebyApiRequest.call(this, 'POST', '/v1/meetings', body);
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}

					if (operation === 'delete') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;
						await wherebyApiRequest.call(this, 'DELETE', `/v1/meetings/${meetingId}`);
						returnData.push({ json: { success: true, meetingId }, pairedItem: { item: i } });
					}

					if (operation === 'get') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;
						const qs: any = {};
						const responseFields = this.getNodeParameter('fields', i, []) as string[];
						if (responseFields.length > 0) {
							qs.fields = responseFields.join(',');
						}
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/meetings/${meetingId}`, {}, qs);
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const qs: any = {};
						const responseFields = this.getNodeParameter('fields', i, []) as string[];
						if (responseFields.length > 0) {
							qs.fields = responseFields.join(',');
						}

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/meetings', {}, qs);
							returnData.push(...responseData.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/meetings', {}, qs);
							const results = responseData.results || [];
							returnData.push(...results.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						}
					}
				}

				// ---------------------------------------------------------------
				//                          Recording
				// ---------------------------------------------------------------
				if (resource === 'recording') {
					if (operation === 'delete') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						await wherebyApiRequest.call(this, 'DELETE', `/v1/recordings/${recordingId}`);
						returnData.push({ json: { success: true, recordingId }, pairedItem: { item: i } });
					}

					if (operation === 'bulkDelete') {
						const ids = (this.getNodeParameter('recordingIds', i) as string)
							.split(',')
							.map((id) => id.trim())
							.filter((id) => id);
						const responseData = await wherebyApiRequest.call(this, 'POST', '/v1/recordings/bulk-delete', { recordingIds: ids });
						returnData.push({ json: responseData ?? { success: true }, pairedItem: { item: i } });
					}

					if (operation === 'get') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/recordings/${recordingId}`);
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}

					if (operation === 'getAccessLink') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const validForSeconds = this.getNodeParameter('validForSeconds', i) as number;
						const qs: any = {};
						if (validForSeconds) {
							qs.validForSeconds = validForSeconds;
						}
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/recordings/${recordingId}/access-link`, {}, qs);
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as any;
						const qs: any = {};
						if (filters.roomName) qs.roomName = filters.roomName;
						if (filters.sortBy) qs.sortBy = filters.sortBy;

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/recordings', {}, qs);
							returnData.push(...responseData.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/recordings', {}, qs);
							const results = responseData.results || [];
							returnData.push(...results.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						}
					}
				}

				// ---------------------------------------------------------------
				//                          Transcription
				// ---------------------------------------------------------------
				if (resource === 'transcription') {
					if (operation === 'create') {
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'POST', '/v1/transcriptions', { recordingId });
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}

					if (operation === 'delete') {
						const transcriptionId = this.getNodeParameter('transcriptionId', i) as string;
						await wherebyApiRequest.call(this, 'DELETE', `/v1/transcriptions/${transcriptionId}`);
						returnData.push({ json: { success: true, transcriptionId }, pairedItem: { item: i } });
					}

					if (operation === 'bulkDelete') {
						const ids = (this.getNodeParameter('transcriptionIds', i) as string)
							.split(',')
							.map((id) => id.trim())
							.filter((id) => id);
						const responseData = await wherebyApiRequest.call(this, 'POST', '/v1/transcriptions/bulk-delete', { transcriptionIds: ids });
						returnData.push({ json: responseData ?? { success: true }, pairedItem: { item: i } });
					}

					if (operation === 'get') {
						const transcriptionId = this.getNodeParameter('transcriptionId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/transcriptions/${transcriptionId}`);
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}

					if (operation === 'getAccessLink') {
						const transcriptionId = this.getNodeParameter('transcriptionId', i) as string;
						const validForSeconds = this.getNodeParameter('validForSeconds', i) as number;
						const qs: any = {};
						if (validForSeconds) {
							qs.validForSeconds = validForSeconds;
						}
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/transcriptions/${transcriptionId}/access-link`, {}, qs);
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as any;
						const qs: any = {};
						if (filters.roomName) qs.roomName = filters.roomName;
						if (filters.sortBy) qs.sortBy = filters.sortBy;

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/transcriptions', {}, qs);
							returnData.push(...responseData.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/transcriptions', {}, qs);
							const results = responseData.results || [];
							returnData.push(...results.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						}
					}
				}

				// ---------------------------------------------------------------
				//                          Summary
				// ---------------------------------------------------------------
				if (resource === 'summary') {
					if (operation === 'create') {
						const transcriptionId = this.getNodeParameter('transcriptionId', i) as string;
						const template = this.getNodeParameter('template', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'POST', '/v1/summaries', { transcriptionId, template });
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}

					if (operation === 'delete') {
						const summaryId = this.getNodeParameter('summaryId', i) as string;
						await wherebyApiRequest.call(this, 'DELETE', `/v1/summaries/${summaryId}`);
						returnData.push({ json: { success: true, summaryId }, pairedItem: { item: i } });
					}

					if (operation === 'get') {
						const summaryId = this.getNodeParameter('summaryId', i) as string;
						const responseData = await wherebyApiRequest.call(this, 'GET', `/v1/summaries/${summaryId}`);
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as any;
						const qs: any = {};
						if (filters.sortBy) qs.sortBy = filters.sortBy;

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/summaries', {}, qs);
							returnData.push(...responseData.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/summaries', {}, qs);
							const results = responseData.results || [];
							returnData.push(...results.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						}
					}
				}

				// ---------------------------------------------------------------
				//                          Insight
				// ---------------------------------------------------------------
				if (resource === 'insight') {
					if (operation === 'getRooms') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as any;
						const qs: any = {};
						if (filters.roomName) qs.roomName = filters.roomName;
						if (filters.createdAfter) qs.createdAfter = filters.createdAfter;
						if (filters.createdBefore) qs.createdBefore = filters.createdBefore;
						if (filters.sortBy) qs.sortBy = filters.sortBy;

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/insights/rooms', {}, qs);
							returnData.push(...responseData.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/insights/rooms', {}, qs);
							const results = responseData.results || [];
							returnData.push(...results.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						}
					}

					if (operation === 'getRoomSessions') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const roomName = this.getNodeParameter('roomName', i) as string;
						const filters = this.getNodeParameter('filters', i, {}) as any;
						const qs: any = { roomName };
						if (filters.roomSessionId) qs.roomSessionId = filters.roomSessionId;
						if (filters.sortBy) qs.sortBy = filters.sortBy;

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/insights/room-sessions', {}, qs);
							returnData.push(...responseData.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/insights/room-sessions', {}, qs);
							const results = responseData.results || [];
							returnData.push(...results.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						}
					}

					if (operation === 'getParticipants') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const lookupBy = this.getNodeParameter('participantLookup', i) as string;
						const filters = this.getNodeParameter('filters', i, {}) as any;
						const qs: any = {};
						if (lookupBy === 'roomSessionId') {
							qs.roomSessionId = this.getNodeParameter('roomSessionId', i) as string;
						} else {
							qs.externalId = this.getNodeParameter('externalId', i) as string;
						}
						if (filters.sortBy) qs.sortBy = filters.sortBy;

						if (returnAll) {
							const responseData = await wherebyApiRequestAllItems.call(this, 'GET', '/v1/insights/participants', {}, qs);
							returnData.push(...responseData.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/insights/participants', {}, qs);
							const results = responseData.results || [];
							returnData.push(...results.map((item: any) => ({ json: item, pairedItem: { item: i } })));
						}
					}

					if (operation === 'getParticipantDetails') {
						const roomSessionId = this.getNodeParameter('roomSessionId', i) as string;
						const participantId = this.getNodeParameter('participantId', i) as string;
						const qs = { roomSessionId, participantId };
						const responseData = await wherebyApiRequest.call(this, 'GET', '/v1/insights/participant', {}, qs);
						returnData.push({ json: responseData, pairedItem: { item: i } });
					}
				}

				// ---------------------------------------------------------------
				//                          Room (Theming)
				// ---------------------------------------------------------------
				if (resource === 'room') {
					const roomName = this.getNodeParameter('roomName', i) as string;

					if (operation === 'setLogo') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const responseData = await wherebyApiRequestMultipart.call(
							this, 'PUT', `/v1/rooms/${roomName}/theme/logo`, binaryPropertyName, i,
						);
						returnData.push({ json: responseData ?? { success: true }, pairedItem: { item: i } });
					}

					if (operation === 'setBackground') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const responseData = await wherebyApiRequestMultipart.call(
							this, 'PUT', `/v1/rooms/${roomName}/theme/room-background`, binaryPropertyName, i,
						);
						returnData.push({ json: responseData ?? { success: true }, pairedItem: { item: i } });
					}

					if (operation === 'setKnockPageBackground') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const responseData = await wherebyApiRequestMultipart.call(
							this, 'PUT', `/v1/rooms/${roomName}/theme/room-knock-page-background`, binaryPropertyName, i,
						);
						returnData.push({ json: responseData ?? { success: true }, pairedItem: { item: i } });
					}

					if (operation === 'setColors') {
						const tokensPreset = this.getNodeParameter('tokensPreset', i) as string;
						const body: any = { tokensPreset };
						if (tokensPreset === 'custom') {
							const tokens = this.getNodeParameter('tokens', i, {}) as any;
							if (Object.keys(tokens).length > 0) {
								body.tokens = tokens;
							}
						}
						const responseData = await wherebyApiRequest.call(
							this, 'PUT', `/v1/rooms/${roomName}/theme/tokens`, body,
						);
						returnData.push({ json: responseData ?? { success: true }, pairedItem: { item: i } });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({ json: { error: errorMessage }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
