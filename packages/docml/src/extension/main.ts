import type { LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node.js';
import type * as vscode from 'vscode';
import * as path from 'node:path';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node.js';

let client: LanguageClient;

/**
 * This function is called when the extension is activated.
 * @param context The VSCode extension context
 */
export function activate(context: vscode.ExtensionContext): void {
  client = startLanguageClient(context);
}

/**
 * This function is called when the extension is deactivated.
 * @returns nothing
 */
export function deactivate(): Promise<void> | undefined {
  if (client) {
    return client.stop();
  }
  return undefined;
}

/** @ignore */
function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
  const serverModule = context.asAbsolutePath(path.join('dist', 'server', 'main.min.cjs'));
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
  // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
  const debugOptions = {
    execArgv: [
      '--nolazy',
      `--inspect${process.env['DEBUG_BREAK'] ? '-brk' : ''}=${process.env['DEBUG_SOCKET'] || '6009'}`,
    ],
  };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: '*', language: 'docml' }],
  };

  // Create the language client and start the client.
  const client = new LanguageClient('docml', 'Docml', serverOptions, clientOptions);

  // Start the client. This will also launch the server
  client.start();
  return client;
}
