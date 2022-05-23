import { Scan } from 'dynamoose/dist/DocumentRetriever';
import { ObjectType } from 'dynamoose/dist/General';
import { HttpDynamoDBResponsePagination, IDynamooseDocument } from '../interfaces/app';

const DYNAMODB_USER_SEARCH_SCAN_LIMIT = 15;

export const fetchDynamoDBPaginatedDocuments = async <T extends { id: string }>(
    initialQuery: Scan<IDynamooseDocument<T>>,
    attributes: Array<string>,
    requestLimit: number,
    dDBAssistStartFromId: string | undefined
): Promise<{
    documents: Partial<T>[];
    dDBPagination: HttpDynamoDBResponsePagination;
}> => {
    let startSearchFromId: ObjectType | undefined = dDBAssistStartFromId ? { id: dDBAssistStartFromId } : undefined;
    let documents: Array<Partial<T>> = [];
    do {
        const query = initialQuery;
        if (startSearchFromId) {
            query.startAt(startSearchFromId);
        }
        query.limit(DYNAMODB_USER_SEARCH_SCAN_LIMIT);
        if (attributes.length > 0) {
            query.attributes(attributes);
        }
        const searchedDocuments = await query.exec();
        startSearchFromId = searchedDocuments.lastKey;
        (searchedDocuments as Array<Partial<T>>).forEach((searchedDocument) => {
            documents.push(searchedDocument);
        });
    } while (documents.length < requestLimit && startSearchFromId);

    let nextSearchStartFromId: string | undefined = startSearchFromId?.id;
    if (requestLimit < documents.length) {
        documents = [...documents.slice(0, requestLimit)];
        nextSearchStartFromId = documents?.[documents.length - 1]?.id as string;
    }
    const dDBPagination: HttpDynamoDBResponsePagination = {
        nextSearchStartFromId,
        count: documents.length,
    };
    return { documents, dDBPagination };
};

const DB_HELPERS = {};

export default DB_HELPERS;
