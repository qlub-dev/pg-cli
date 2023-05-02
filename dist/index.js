var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import figlet from 'figlet';
import { Command } from 'commander';
import ora from 'ora';
import { createRequire } from 'node:module';
var require = createRequire(import.meta.url);
import fs from 'fs';
import { capitalizeFirstLetter } from './utils';
var program = new Command();
console.log(figlet.textSync("QLUB Payments", "Standard"));
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
var options = program.opts();
var isCorrectDirectory = function () { return __awaiter(void 0, void 0, void 0, function () {
    var projectDir, packageJson, projectName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                projectDir = process.cwd();
                return [4 /*yield*/, require("".concat(projectDir, "/package.json"))];
            case 1:
                packageJson = _a.sent();
                projectName = packageJson.name;
                if (projectName !== 'qlub-pg-cli') {
                    console.log('This command must be run in the root of the customer-web-app project');
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
if (!isCorrectDirectory()) {
    process.exit(1);
}
if (options.add) {
    if (!options.name) {
        program.error('Please specify a name for the new Payment Gateway');
    }
    var spinner_1 = ora('Adding new Payment Gateway').start();
    setTimeout(function () {
        spinner_1.succeed('Payment Gateway added successfully');
    }, 3000);
    addPGEnum(options.name);
}
function addPGEnum(name) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, filePath, enumRegex, fileContent, enumMatch, lastEnumMatch, lastEnumValue, newEnumValue, modifiedEnum, spinner;
        return __generator(this, function (_a) {
            dir = process.cwd();
            filePath = "".concat(dir, "/src/repositories/payment/type.ts");
            enumRegex = /export\s+enum\s+PaymentTypeEnum\s*{[^{}]*}/s;
            fileContent = fs.readFileSync(filePath, 'utf-8');
            enumMatch = fileContent.match(enumRegex);
            if (!enumMatch) {
                console.log('Could not find PaymentTypeEnum enum in type.ts');
                return [2 /*return*/];
            }
            lastEnumMatch = enumMatch[0].match(/\w+\s*=\s*\d+(?=\s*,?\s*(?:}|\/\/))/);
            console.log(lastEnumMatch);
            lastEnumValue = parseInt(lastEnumMatch[0]);
            newEnumValue = "".concat(capitalizeFirstLetter(name), " = ").concat(lastEnumValue + 1, ",");
            newEnumValue = applyPrettierConfigToString(newEnumValue, '.prettierrc');
            modifiedEnum = enumMatch[0].replace(/}$/, "".concat(newEnumValue, "\n}"));
            fs.writeFileSync(filePath, fileContent.replace(enumRegex, modifiedEnum));
            spinner = ora('Adding new Payment Gateway to PaymentTypeEnum').start();
            setTimeout(function () {
                spinner.succeed('Payment Gateway added successfully');
            }, 3000);
            return [2 /*return*/];
        });
    });
}
function applyPrettierConfigToString(text, prettierConfigPath) {
    var dir = process.cwd();
    var fileContent = fs.readFileSync("".concat(dir, "/").concat(prettierConfigPath), 'utf-8');
    var prettierConfig = JSON.parse(fileContent);
    var tabWidth = prettierConfig.tabWidth;
    // add a space beginning of the text according to the tabWidth
    var spacedText = text.replace(/^/gm, ' '.repeat(tabWidth));
    return spacedText;
}
//# sourceMappingURL=index.js.map