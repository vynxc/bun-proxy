
const possibleCorsHeaders = ["access-control-allow-origin",
    "access-control-allow-methods",
    "access-control-allow-headers",
    "access-control-max-age",
    "access-control-allow-credentials",
    "access-control-expose-headers",
    "access-control-request-method",
    "access-control-request-headers",
    "origin",
    "vary",
    "date",
    "referer",
    "server",
    "x-cache",
    "via",
    "x-amz-cf-pop",
    "x-amz-cf-id",
    "transfer-encoding",
    "x-powered-by"];

export function removeHeaders(headers: Record<string, string>) {

    headers = removeDuplicatesFromRecordByKey(headers);
    for (const key in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, key)) {
            if (possibleCorsHeaders.includes(key.toLowerCase())) {
                delete headers[key];
            }
        }
    }
    headers['Access-Control-Allow-Origin'] = '*';

}

function removeDuplicatesFromRecordByKey(inputRecord: Record<string, string>): Record<string, string> {
    const uniqueKeys = Array.from(new Set(Object.keys(inputRecord)));
    const resultRecord: Record<string, string> = {};

    uniqueKeys.forEach((key) => {
        resultRecord[key] = inputRecord[key];
    });

    return resultRecord;
}
