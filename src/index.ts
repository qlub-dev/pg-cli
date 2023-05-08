
import { ObjectLiteralExpression, Project, PropertyAssignment, ScriptTarget } from "ts-morph";
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


const project = new Project({
    tsConfigFilePath: "./tsconfig.json",
})












if (options.add) {
    if (!options.name) {
        program.error('Please specify a name for the new Payment Gateway');
    }
    const spinner = ora('Adding new Payment Gateway\n').start();
    setTimeout(() => {
        spinner.succeed('Payment Gateway added successfully');
    }, 3000);
    addEnumMember();
}

function addEnumMember(){
    const sourceFile = project.addSourceFileAtPathIfExists("./src/repositories/payment/type.ts");

    const enumDeclaration = sourceFile.getEnum("PaymentTypeEnum");
    
    const enumMembers = enumDeclaration.getMembers();

    const isEnumExist = enumMembers.some((member) => {
        return member.getName() === capitalizeFirstLetter(options.name);
    })

    
    if (isEnumExist) {
        program.error('This Payment Gateway already exists');
    }

    const enumLength = enumMembers.length;
    
    enumDeclaration.addMember({
        name: capitalizeFirstLetter(options.name),
        value: enumLength,
    });
    
    const paymentTypeName = sourceFile.getVariableDeclaration("PaymentTypeName");
    const objectExpression = paymentTypeName.getInitializer() as ObjectLiteralExpression;

    const isPaymentNameExist = objectExpression.getProperties().some((property: PropertyAssignment) => {
        const isValueExist = property.getInitializer().getText().toLowerCase() === (options.name).toLowerCase()
        const isNameExist = property.getName() === `[PaymentTypeEnum.${capitalizeFirstLetter(options.name)}]`;
        return isValueExist || isNameExist;
    })

    if (isPaymentNameExist) {
        program.error('This Payment Gateway already exists');
    }
    
    objectExpression.addPropertyAssignment({
        name:  `[PaymentTypeEnum.${capitalizeFirstLetter(options.name)}]`,
        initializer: `'${capitalizeFirstLetter(options.name)}'`,
    })
    sourceFile.saveSync();

    sourceFile.forget();
}