// custom.d.ts
declare module 'jsonwebtoken/lib/JsonWebTokenError' {
    export default class JsonWebTokenError extends Error {
        name: string;
        message: string;
    }
}
