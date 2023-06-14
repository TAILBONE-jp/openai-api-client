import {writeFileSync} from "fs";
import {emptyDirSync, ensureDirSync} from "fs-extra";

import {createRequire} from "module";
import {execSync} from "child_process";
import * as path from "path";
import {fileURLToPath} from "url";

const require = createRequire(import.meta.url);

const {CodeGenerator} = require("@himenon/openapi-typescript-code-generator");
const Templates = require("@himenon/openapi-typescript-code-generator/templates");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const remoteSchemaUrl = "https://github.com/openai/openai-openapi/raw/master/openapi.yaml"
const generatedPath = path.join(__dirname, `../generated/`);
const openApiSchemaPath = path.join(generatedPath, "openapi.yml")

const main = async () => {
  const response = await fetch(remoteSchemaUrl)
  if (!response.ok) {
    throw new Error(`Cannot download schema from: ${remoteSchemaUrl}`)
  }

  ensureDirSync(generatedPath);
  writeFileSync(openApiSchemaPath, await response.text())

  const codeGenerator = new CodeGenerator(openApiSchemaPath, {
    convertOption: {
      formatConversions: [
        {
          selector: {
            format: "binary",
          },
          output: {
            type: ["string", "BlobWithFilename"],
          },
        },
      ],
    },
  });
  codeGenerator.validateOpenApiSchema();

  let code = codeGenerator.generateTypeDefinition([
    codeGenerator.getAdditionalTypeDefinitionCustomCodeGenerator(),
    {
      generator: Templates.ClassApiClient.generator,
      option: {},
    }]);

  code += [
    "",
    "export class BlobWithFilename extends Blob {",
    "  filename: string",
    "  constructor(blobPart: BlobPart[], filename: string) {",
    "    super(blobPart)",
    "    this.filename = filename",
    "  }",
    "}"].join("\n")

  writeFileSync(`${generatedPath}/apiClient.ts`, code, {
    encoding: "utf-8",
  });

  emptyDirSync("./dist");
  execSync("pnpm exec tsc --project tsconfig.build.json");
}

main();
