var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { HttpRequest } from "@aws-sdk/protocol-http";
const region = "ap-northeast-1";
const graphqlEndpoint = process.env.APPSYNC_ENDPOINT || "";
const query = JSON.stringify({
    query: `query GetProductPrice {
    getProductPrice(ProductID: "EXAMPLE123", CheckDate: "2021-01-01") {
      ProductID
      CheckDate
      Price
      Title
      URL
    }
  }`,
});
export function handler() {
    return __awaiter(this, void 0, void 0, function* () {
        const fetch = (yield import("node-fetch")).default;
        const endpointUrl = new URL(graphqlEndpoint);
        const signer = new SignatureV4({
            credentials: defaultProvider(),
            region: region,
            service: "appsync",
            sha256: Sha256,
        });
        const request = new HttpRequest({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Host": endpointUrl.hostname,
            },
            hostname: endpointUrl.hostname,
            path: endpointUrl.pathname,
            body: query,
        });
        const signedRequest = yield signer.sign(request);
        try {
            const response = yield fetch(endpointUrl.toString(), {
                method: signedRequest.method,
                headers: Object.assign(Object.assign({}, signedRequest.headers), { "host": endpointUrl.hostname // 明示的にHostヘッダーを追加
                 }),
                body: signedRequest.body,
            });
            const data = yield response.json();
            console.log("Data retrieved from AppSync:", data);
            return data;
        }
        catch (error) {
            console.error("Error querying AppSync:", error);
            throw new Error(`Error querying AppSync: ${error}`);
        }
    });
}
