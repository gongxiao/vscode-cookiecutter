// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
var vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var Cookiecutter = vscode.commands.registerCommand('extension.cookiecutter', function (param) {
        let term = vscode.Terminal;

        const ccConf = path.join(process.env.HOME, ".cookiecutterrc");
        var tmpDir = yaml.safeLoad(fs.readFileSync(ccConf, 'utf8')).cookiecutters_dir;
        var re = /^~/;
        const ccDir = tmpDir.replace(re, process.env.HOME);
        const items = (srcPath) => {
            return fs.readdirSync(srcPath).filter(file => fs.lstatSync(path.join(srcPath, file)).isDirectory())
        }
        const template = (ccDir) => {
            return vscode.window.showQuickPick(items(ccDir), {
                placeHolder: "Choosing a template.",
                ignoreFocusOut: true,
            });
        };
        template(ccDir).then(selection => {
            // the user canceled the selection
            if (!selection) {
                return;
            }

            // the user selected some item. You could use `selection.name` too
            var command = "".concat("cookiecutter -o ", param.path, " ", selection);
            
            if (vscode.window.terminals.length < 1) {
                term = vscode.window.createTerminal("bash");
            } else {
                term = vscode.window.activeTerminal;
            }
            term.show();
            term.sendText(command);
        });

    });
    context.subscriptions.push(Cookiecutter);

}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;


