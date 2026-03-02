import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';

import {
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	NodeApiError,
} from 'n8n-workflow';

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

	try {
		return await this.helpers.requestWithAuthentication.call(
			this,
			'wherebyApi',
			options,
		);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as any);
	}
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
			file: {
				value: dataBuffer,
				options: {
					filename: binaryData.fileName || 'file.png',
					contentType: binaryData.mimeType || 'image/png',
				},
			},
		},
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		json: true,
	};

	try {
		return await this.helpers.requestWithAuthentication.call(
			this,
			'wherebyApi',
			options,
		);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as any);
	}
}
