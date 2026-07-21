import * as vscode from 'vscode';
import * as fs from 'node:fs';
import { startInjectingProxy, type InjectingProxy } from './proxy';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('sidetation.openPreview', () => openPreview(context))
  );
  // dev/test hook: launch with SIDETATION_PREVIEW_TARGET=http://... to open without the input box
  const autoTarget = process.env.SIDETATION_PREVIEW_TARGET;
  if (autoTarget) void openPreview(context, autoTarget);
}

async function openPreview(context: vscode.ExtensionContext, presetTarget?: string): Promise<void> {
  const cfg = vscode.workspace.getConfiguration('sidetation');
  let target = presetTarget;
  if (!target) {
    const last =
      context.workspaceState.get<string>('lastTarget') ??
      cfg.get<string>('defaultTarget', 'http://localhost:5173');
    target = await vscode.window.showInputBox({
      prompt: '要预览的 dev server 地址',
      value: last,
      validateInput: (v) => {
        try {
          new URL(v);
          return null;
        } catch {
          return '请输入完整 URL，如 http://localhost:5173';
        }
      },
    });
    if (!target) return;
    await context.workspaceState.update('lastTarget', target);
  }

  const umdSource = fs.readFileSync(context.asAbsolutePath('media/sidetation.umd.cjs'), 'utf8');
  let handle: InjectingProxy;
  try {
    handle = await startInjectingProxy({
      target,
      umdSource,
      mcpEndpoint: cfg.get<string>('mcpEndpoint', 'http://127.0.0.1:8787'),
    });
  } catch (err) {
    void vscode.window.showErrorMessage(`Sidetation 代理启动失败：${String(err)}`);
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    'sidetationPreview',
    `Sidetation — ${target}`,
    vscode.ViewColumn.Beside,
    { enableScripts: true, retainContextWhenHidden: true }
  );
  panel.webview.html = panelHtml(`http://127.0.0.1:${handle.port}`);
  panel.onDidDispose(() => handle.dispose(), null, context.subscriptions);
}

function panelHtml(src: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src http://127.0.0.1:* http://localhost:*; style-src 'unsafe-inline';">
<style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden}iframe{width:100%;height:100vh;border:0;background:#fff}</style>
</head>
<body><iframe src="${src}" allow="clipboard-read; clipboard-write"></iframe></body>
</html>`;
}

export function deactivate(): void {}
