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
		const responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'wherebyApi',
			options,
		);
		return responseData;
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
	let nextUrl: string | undefined;

	do {
		responseData = await wherebyApiRequest.call(this, method, endpoint, body, query);
		
		if (responseData.results) {
			returnData.push(...responseData.results);
		} else {
			returnData.push(responseData);
		}

		// Check if there's a next page
		if (responseData.links && responseData.links.next) {
			nextUrl = responseData.links.next;
			// Simple next page handling - extract endpoint from next URL
			const nextUrlObj = new (globalThis as any).URL(responseData.links.next);
			endpoint = nextUrlObj.pathname;
			const params = new (globalThis as any).URLSearchParams(nextUrlObj.search);
			query = {};
			for (const [key, value] of params) {
				query[key] = value;
			}
		} else {
			nextUrl = undefined;
		}
	} while (nextUrl);

	return returnData;
}