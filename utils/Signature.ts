const SIGNATURE_LENGTH = 64;

/**
 * Signature, as an immutable object.
 */
export class Signature {
    private valueHex: string = "";

    constructor(value?: string | Buffer) {
        if (!value) {
            return;
        }
        if (typeof value === "string") {
            return Signature.fromHex(value);
        }
        if (value instanceof Buffer) {
            return Signature.fromBuffer(value);
        }
    }

    static empty(): Signature {
        return new Signature();
    }

    static fromHex(value: string): Signature {
        if (value.startsWith("0x")) {
            value = value.slice(2);
        }
        if (!Signature.isValidHex(value)) {
            throw "cannot create";
        }

        return Signature.fromValidHex(value);
    }

    private static isValidHex(value: string) {
        return Buffer.from(value, "hex").length == SIGNATURE_LENGTH;
    }

    private static fromValidHex(value: string): Signature {
        let result = new Signature();
        result.valueHex = value;
        return result;
    }

    static fromBuffer(buffer: Buffer): Signature {
        if (buffer.length != SIGNATURE_LENGTH) {
            throw "cannot create";
        }

        return Signature.fromValidHex(buffer.toString("hex"));
    }

    hex() {
        this.assertNotEmpty();

        return this.valueHex;
    }

    isEmpty(): boolean {
        return !this.valueHex;
    }

    private assertNotEmpty() {
        if (this.isEmpty()) {
            throw "empty";
        }
    }
}
