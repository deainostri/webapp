//
import * as conversions from "./conversions";

const create = (...args: any[]) => {
  console.group(args);
  args = args.map((tuple) => {
    switch (tuple[1]) {
      case "string":
        return conversions.string_to_hex(tuple[0]);

      case "decimal":
        return conversions.decimal_to_hex(tuple[0]);

      case "number":
        return conversions.number_to_hex(tuple[0]);

      default:
        return tuple[0];
    }
  });

  const dataMessage = args.join("@");
  console.log(dataMessage);

  return dataMessage;
};

const encode = create;

const decode = (message: string) => {
  const output = [];
  const message_parts = message.split("@");

  for (let i = 0; i < message_parts.length; i++) {
    const message_part = message_parts[i];

    output.push({
      raw: message_part,
      string: conversions.hex_to_string(message_part),
      decimal: conversions.hex_to_decimal(message_part),
      // number: conversions.hex_to_number(message_part),
    });
  }

  if (message === "") {
    output.push({
      raw: "",
      string: "",
      decimal: "",
      // number: conversions.hex_to_number(message_part),
    });
  }

  console.table(output);

  return output;
};

const decode64 = (message: string) =>
  decode(Buffer.from(message, "base64").toString("hex"));

export { create, encode, decode, decode64 };
