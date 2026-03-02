import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';

import {
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	NodeApiError,
} from 'n8n-workflow';

const MAX_RETRIES = 3;

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function wherebyApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: any = {},
	qs: IDataObject = {},
): Promise<any> {
	const options: IHttpRequestOptions = {
		method,
		body,
		qs,
		url: `https://api.whereby.dev${resource}`,
		json: true,
	};

	if (Object.keys(body as IDataObject).length === 0) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			return await this.helpers.requestWithAuthentication.call(
				this,
				'wherebyApi',
				options,
			);
		} catch (error: any) {
			const statusCode = error?.statusCode || error?.httpCode || error?.code;

			if (statusCode === 429 && attempt < MAX_RETRIES) {
				const retryAfter = error?.response?.headers?.['retry-after'];
				const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * (attempt + 1);
				await sleep(waitMs);
				continue;
			}

			throw new NodeApiError(this.getNode(), error as any);
		}
	}

	throw new NodeApiError(this.getNode(), { message: 'Max retries exceeded' } as any);
}

export async function wherebyApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	const qs = { ...query };

	do {
		responseData = await wherebyApiRequest.call(this, method, endpoint, body, qs);

		if (responseData.results) {
			returnData.push(...responseData.results);
		} else {
			returnData.push(responseData);
			break;
		}

		if (responseData.cursor) {
			qs.cursor = responseData.cursor;
		} else {
			break;
		}
	} while (true);

	return returnData;
}

export async function wherebyApiRequestMultipart(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	resource: string,
	binaryPropertyName: string,
	itemIndex: number,
): Promise<any> {
	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const dataBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	const options: IHttpRequestOptions = {
		method,
		url: `https://api.whereby.dev${resource}`,
		body: {
			image: {
				value: dataBuffer,
				options: {
					filename: binaryData.fileName || 'image.png',
					contentType: binaryData.mimeType || 'image/png',
				},
			},
		},
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		json: true,
	};

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			return await this.helpers.requestWithAuthentication.call(
				this,
				'wherebyApi',
				options,
			);
		} catch (error: any) {
			const statusCode = error?.statusCode || error?.httpCode || error?.code;

			if (statusCode === 429 && attempt < MAX_RETRIES) {
				const retryAfter = error?.response?.headers?.['retry-after'];
				const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * (attempt + 1);
				await sleep(waitMs);
				continue;
			}

			throw new NodeApiError(this.getNode(), error as any);
		}
	}

	throw new NodeApiError(this.getNode(), { message: 'Max retries exceeded' } as any);
}
