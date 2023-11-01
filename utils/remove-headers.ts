const possibleCorsHeaders = [
    "access-control-allow-origin",
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
    "x-powered-by",
];

export function removeHeaders(headers: any) {
    for (const key of possibleCorsHeaders) {
        delete headers[key];
    }
    headers["Access-Control-Allow-Origin"] = "*";
}
