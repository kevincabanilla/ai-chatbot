import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "node:util";
import { ReadableStream } from "node:stream/web";

Object.assign(globalThis, { TextDecoder, TextEncoder, ReadableStream });

if (typeof HTMLElement !== "undefined") {
	HTMLElement.prototype.scrollIntoView = jest.fn();
}
