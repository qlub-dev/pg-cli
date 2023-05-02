

import figlet from 'figlet'
import { Command } from 'commander';
import ora from 'ora';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import fs from 'fs';
import prettier from 'prettier'

const program = new Command();
console.log(figlet.textSync("QLUB Payments", "Standard"));

import ts from 'typescript';
import { capitalizeFirstLetter } from './utils.js';
program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .option('--name <type>', 'New Payment Gateway Name')
    .option('-a, --add', 'Add a new Payment Gateway')
    .option('-l, --list', 'List all Payment Gateways')
    .option('--apple', 'Add Apple Pay')
    .option('--google', 'Add Google Pay')
    .option('--card', 'Add Card Pay')
    .option('--custom <type>', 'Add Custom Payment Method')
    .parse(process.argv);

const options = program.opts();

const isCorrectDirectory = async () => {
    const projectDir = process.cwd();

    // import the package json with await
    const packageJson = await require(`${projectDir}/package.json`);


    const projectName = packageJson.name;
    if (projectName !== 'qlub-pg-cli') {
        console.log('This command must be run in the root of the customer-web-app project');
        return false;
    }
    return true;
}

if (!isCorrectDirectory()) {
    process.exit(1);
}

if (options.add) {
    if (!options.name) {
        program.error('Please specify a name for the new Payment Gateway');
    }
    const spinner = ora('Adding new Payment Gateway').start();
    setTimeout(() => {
        spinner.succeed('Payment Gateway added successfully');
    }, 3000);
    addEnumMember(options.name);
}



function addEnumMember(name: string) {
    const dir = process.cwd();
    const filePath = `${dir}/src/repositories/payment/type.ts`;

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // creates a mock source file
    const sourceFile = ts.createSourceFile(
        'enums.ts',
        fileContent,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
    );

    // find the enum you want to update by name
    let existingEnum: ts.EnumDeclaration;
    let existingPaymentTypeName: ts.VariableStatement;
    ts.forEachChild(sourceFile, (node) => {
        if (ts.isEnumDeclaration(node) && node.name.getText() === 'PaymentTypeEnum') {
            existingEnum = node;
        }
        if (ts.isVariableStatement(node) && node.declarationList.declarations[0].name.getText() === 'PaymentTypeName') {
            existingPaymentTypeName = node;
        }

    });

    const oldText = sourceFile.text;

    // create a new enum member
    const newEnumMember = ts.factory.createEnumMember(
        ts.factory.createIdentifier(capitalizeFirstLetter(name)),
        ts.factory.createNumericLiteral(existingEnum.members.length),
    );

    const printer = ts.createPrinter();
    // update the existing enum with the new member
    const newEnumDeclaration = ts.factory.updateEnumDeclaration(
        existingEnum,
        undefined,
        existingEnum.name,
        ts.factory.createNodeArray([...existingEnum.members, newEnumMember])
    );

    const isEnumAlreadyExist = existingEnum.members.some((member) => {
        return member.name.getText() === capitalizeFirstLetter(name);
    });

    if (isEnumAlreadyExist) {
        program.error('This Payment Gateway already exists');
    }



    const newEnumDeclarationText = printer.printNode(ts.EmitHint.Unspecified, newEnumDeclaration, sourceFile);
    const start = existingEnum.getStart(sourceFile);
    const length = existingEnum.end - start;
    // this took 2 hours to figure out
    const textChangeRange = ts.createTextChangeRange(
        ts.createTextSpan(start, length),
        newEnumDeclarationText.length
    );
    let newText =
        oldText.slice(0, start) +
        newEnumDeclarationText +
        oldText.slice(start + length);

    const newFileContent = printer.printFile(
        ts.updateSourceFile(
            sourceFile,
            newText,
            textChangeRange,
        ),
    );


    // format the file with the project prettier config
    prettier.resolveConfig(`${dir}/.prettierrc`, { editorconfig: true, useCache: true }).then((options) => {
        const formatted = prettier.format(newFileContent, {
            ...options,
            parser: 'typescript',
        });
        fs.writeFileSync(filePath, formatted);
    }).catch((error) => {
        program.error(error);
    });
}


