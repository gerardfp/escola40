import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface EscolaState {
    files: Record<string, string>;
}

function getFileHash(filePath: string): string {
    if (!fs.existsSync(filePath)) return '';
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('sha256').update(content).digest('hex');
    } catch {
        return '';
    }
}

function syncDirectory(sourceDir: string, destDir: string, relPathBase: string, state: EscolaState): boolean {
    let changed = false;
    if (!fs.existsSync(sourceDir)) return false;
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        changed = true;
    }

    const items = fs.readdirSync(sourceDir);
    for (const item of items) {
        const srcItemPath = path.join(sourceDir, item);
        const destItemPath = path.join(destDir, item);
        const relativePath = path.join(relPathBase, item).replace(/\\/g, '/');

        const isDir = fs.statSync(srcItemPath).isDirectory();
        if (isDir) {
            const subChanged = syncDirectory(srcItemPath, destItemPath, relativePath, state);
            if (subChanged) changed = true;
        } else {
            // It's a file
            const newHash = getFileHash(srcItemPath);
            if (!fs.existsSync(destItemPath)) {
                // File does not exist, copy it!
                fs.copyFileSync(srcItemPath, destItemPath);
                state.files[relativePath] = newHash;
                changed = true;
            } else {
                // File exists
                const currentHash = getFileHash(destItemPath);
                const storedHash = state.files[relativePath];

                if (currentHash !== newHash) {
                    if (!storedHash || currentHash === storedHash) {
                        // User has NOT modified the file (its current hash matches the stored hash),
                        // or it was never tracked. Since the extension's file is different, update it!
                        fs.copyFileSync(srcItemPath, destItemPath);
                        state.files[relativePath] = newHash;
                        changed = true;
                    } else {
                        // User HAS modified the file (currentHash !== storedHash)
                        // Preserve the user's modifications!
                    }
                }
            }
        }
    }
    return changed;
}

function ensureProjectResources(workspaceDir: string, extensionPath: string) {
    try {
        const sourceConfig = path.join(extensionPath, '.config');
        const sourceTheme = path.join(extensionPath, 'theme');
        
        // Only run sync if the extension has resources to sync
        if (!fs.existsSync(sourceConfig) && !fs.existsSync(sourceTheme)) {
            return;
        }

        const stateFolder = path.join(workspaceDir, '.config');
        if (!fs.existsSync(stateFolder)) {
            fs.mkdirSync(stateFolder, { recursive: true });
        }

        // Remove legacy typo directory in project workspace if it exists
        const legacyTypoDir = path.join(workspaceDir, '.config', 'hightlight');
        if (fs.existsSync(legacyTypoDir)) {
            try {
                fs.rmSync(legacyTypoDir, { recursive: true, force: true });
                console.log(`[Escola 4.0] Directorio heredado con typo eliminado: ${legacyTypoDir}`);
            } catch (rmErr) {
                // ignore
            }
        }

        const stateFilePath = path.join(stateFolder, 'escola40-state.json');

        // Load existing state
        let state: EscolaState = { files: {} };
        if (fs.existsSync(stateFilePath)) {
            try {
                state = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
            } catch {
                // ignore syntax errors in state file
            }
        }

        let updated = false;

        // 1. Sync .config
        if (fs.existsSync(sourceConfig)) {
            const destConfig = path.join(workspaceDir, '.config');
            const changed = syncDirectory(sourceConfig, destConfig, '.config', state);
            if (changed) updated = true;
        }

        // 2. Sync theme
        if (fs.existsSync(sourceTheme)) {
            const destTheme = path.join(workspaceDir, 'theme');
            const changed = syncDirectory(sourceTheme, destTheme, 'theme', state);
            if (changed) updated = true;
        }

        if (updated) {
            // Save state
            fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), 'utf8');
            vscode.window.showInformationMessage('Escola 4.0: Se han inicializado y actualizado las carpetas de recursos (.config y theme) en la raíz del proyecto.');
        }
    } catch (err: any) {
        console.error('Error al inicializar recursos Escola 4.0:', err);
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('La extensión Escola 4.0 está activa y monitoreando recursos del proyecto.');

    // 1. Initial check for all open workspace folders on startup
    const folders = vscode.workspace.workspaceFolders;
    if (folders) {
        for (const folder of folders) {
            console.log(`[Escola 4.0] Comprobando recursos iniciales para workspace: ${folder.uri.fsPath}`);
            ensureProjectResources(folder.uri.fsPath, context.extensionPath);
        }
    }

    // 1.5 Initial check for active editor on startup (if an editor is already open)
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && (activeEditor.document.languageId === 'edumark' || activeEditor.document.fileName.endsWith('.edu'))) {
        const folder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
        let workspaceDir = folder ? folder.uri.fsPath : undefined;
        if (!workspaceDir && activeEditor.document.uri.scheme === 'file') {
            workspaceDir = path.dirname(activeEditor.document.uri.fsPath);
        }
        if (workspaceDir) {
            console.log(`[Escola 4.0] Comprobando recursos iniciales para editor activo en startup: ${workspaceDir}`);
            ensureProjectResources(workspaceDir, context.extensionPath);
        }
    }

    // 2. Watch for workspace folders additions reactively
    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            for (const folder of event.added) {
                console.log(`[Escola 4.0] Comprobando recursos reactivos para nuevo workspace añadido: ${folder.uri.fsPath}`);
                ensureProjectResources(folder.uri.fsPath, context.extensionPath);
            }
        })
    );

    // 3. Watch for active editor changes reactively (when a .edu document is focused)
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && (editor.document.languageId === 'edumark' || editor.document.fileName.endsWith('.edu'))) {
                const folder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
                let workspaceDir = folder ? folder.uri.fsPath : undefined;
                if (!workspaceDir && editor.document.uri.scheme === 'file') {
                    workspaceDir = path.dirname(editor.document.uri.fsPath);
                }
                if (workspaceDir) {
                    console.log(`[Escola 4.0] Comprobando recursos reactivos para cambio de editor enfocado: ${workspaceDir}`);
                    ensureProjectResources(workspaceDir, context.extensionPath);
                }
            }
        })
    );

    // 4. Watch the extension's own template directories recursively (perfect for live template development!)
    try {
        const sourceConfig = path.join(context.extensionPath, '.config');
        const sourceTheme = path.join(context.extensionPath, 'theme');

        const watchHandler = (eventType: string, filename: string | null) => {
            if (filename) {
                console.log(`[Escola 4.0] Cambios detectados en recurso de la extensión: ${filename}. Resincronizando...`);
                // Trigger sync on all active workspace folders
                const activeFolders = vscode.workspace.workspaceFolders;
                if (activeFolders) {
                    for (const folder of activeFolders) {
                        ensureProjectResources(folder.uri.fsPath, context.extensionPath);
                    }
                }
                // Trigger sync on active text editor standalone file directory
                const editor = vscode.window.activeTextEditor;
                if (editor && (editor.document.languageId === 'edumark' || editor.document.fileName.endsWith('.edu'))) {
                    const folder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
                    let workspaceDir = folder ? folder.uri.fsPath : undefined;
                    if (!workspaceDir && editor.document.uri.scheme === 'file') {
                        workspaceDir = path.dirname(editor.document.uri.fsPath);
                    }
                    if (workspaceDir) {
                        ensureProjectResources(workspaceDir, context.extensionPath);
                    }
                }
            }
        };

        let debounceTimeout: NodeJS.Timeout | null = null;
        const debouncedWatchHandler = (eventType: string, filename: string | null) => {
            if (debounceTimeout) clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                watchHandler(eventType, filename);
            }, 200); // 200ms debounce to avoid duplicate events
        };

        if (fs.existsSync(sourceConfig)) {
            const watcherConfig = fs.watch(sourceConfig, { recursive: true }, debouncedWatchHandler);
            context.subscriptions.push({ dispose: () => watcherConfig.close() });
            console.log(`[Escola 4.0] Watcher activo en: ${sourceConfig}`);
        }
        if (fs.existsSync(sourceTheme)) {
            const watcherTheme = fs.watch(sourceTheme, { recursive: true }, debouncedWatchHandler);
            context.subscriptions.push({ dispose: () => watcherTheme.close() });
            console.log(`[Escola 4.0] Watcher activo en: ${sourceTheme}`);
        }
    } catch (watchErr) {
        console.error('Error al iniciar el watcher de recursos de la extensión:', watchErr);
    }

    // Helper to dynamically scan workspace folders for custom component files
    async function getWorkspaceComponents(): Promise<string[]> {
        const components = new Set<string>();
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) return [];

        for (const folder of folders) {
            const paths = [
                vscode.Uri.joinPath(folder.uri, '.config', 'components'),
                vscode.Uri.joinPath(folder.uri, 'config', 'components'),
                vscode.Uri.joinPath(folder.uri, 'components')
            ];

            for (const dirUri of paths) {
                try {
                    if (dirUri.scheme === 'file' && !fs.existsSync(dirUri.fsPath)) {
                        continue;
                    }
                    const files = await vscode.workspace.fs.readDirectory(dirUri);
                    for (const [name, type] of files) {
                        if (type === vscode.FileType.File && name.endsWith('.js')) {
                            let compName = name.slice(0, -3); // remove .js
                            if (compName.startsWith('sym_')) {
                                compName = compName.slice(4);
                            }
                            if (compName !== '_aliases') {
                                components.add(compName);
                            }
                        }
                    }
                } catch (e) {
                    // ignore if directory doesn't exist
                }
            }
        }
        return Array.from(components);
    }

    const ESCOLA_WELL_KNOWN: Record<string, { type: 'hash' | 'at' | 'both', body: string, desc: string }> = {
        'imagen': { type: 'hash', body: 'imagen ${1:ruta_imagen.png} {ancho: ${2:600}, pie: ${3:Pie de foto}, sombra: ${4|si,no|}, borde: ${5|si,no|}}', desc: 'Inserta una imagen con título y opciones (Escola 4.0).' },
        'portada': { type: 'hash', body: 'portada ${1:ruta_portada.jpg}', desc: 'Inserta la portada del recurso (Escola 4.0).' },
        'descarga': { type: 'hash', body: 'descarga', desc: 'Inserta el iDevice de descarga del archivo fuente (Escola 4.0).' },
        'resum': { type: 'hash', body: 'resum', desc: 'Inserta un resumen de la página (Escola 4.0).' },
        'preguntate': { type: 'at', body: 'preguntate\n${1:Pregunta o reflexión...}\n@end', desc: 'Tarjeta didáctica "Pregúntate" (Escola 4.0).' },
        'atencion': { type: 'at', body: 'atencion\n${1:Contenido...}\n@end', desc: 'Tarjeta didáctica "Atención" (Escola 4.0).' },
        'sabiasque': { type: 'at', body: 'sabiasque\n${1:Contenido...}\n@end', desc: 'Tarjeta didáctica "¿Sabías que...?" (Escola 4.0).' },
        'sugerencia': { type: 'at', body: 'sugerencia\n${1:Contenido...}\n@end', desc: 'Tarjeta didáctica "Sugerencia" (Escola 4.0).' },
        'solucion': { type: 'at', body: 'solucion\n${1:Contenido...}\n@end', desc: 'Tarjeta didáctica "Solución" (Escola 4.0).' },
        'reflexion': { type: 'at', body: 'reflexion\n${1:Contenido...}\n@end', desc: 'Tarjeta didáctica "Reflexión" (Escola 4.0).' },
        'actividad': { type: 'at', body: 'actividad\n${1:Contenido...}\n@end', desc: 'Tarjeta didáctica "Actividad" (Escola 4.0).' },
        'nota': { type: 'at', body: 'nota\n${1:Contenido...}\n@end', desc: 'Tarjeta didáctica "Nota" (Escola 4.0).' },
        'pregunta': { type: 'at', body: 'pregunta\n${1:Contenido...}\n@end', desc: 'Tarjeta didáctica "Pregunta" (Escola 4.0).' },
        'rubrica': { type: 'at', body: 'rubrica ${1:Título}\n\n| ${2:Criterio} | ${3:Excelente} | ${4:A mejorar} |\n| :--- | :--- | :--- |\n| ${5:Criterio 1} | ${6:Excelente...} | ${7:A mejorar...} |\n\n@end', desc: 'Rúbrica de evaluación (Escola 4.0).' },
        'informacion': { type: 'at', body: 'informacion\n${1:Contenido...}\n@end', desc: 'Tarjeta didáctica "Información" (Escola 4.0).' },
        'pc': { type: 'at', body: 'pc\nDescomposicion:\n[Describe aquí en qué momento y cómo el alumnado pondrá en práctica esta dimensión.]\n- Ejemplo: ${1:Dividir el reto...}\n\nReconocimiento de patrones:\n[Describe aquí en qué momento y cómo el alumnado pondrá en práctica esta dimensión.]\n- Ejemplo: ${2:Registrar resultados...}\n\nAbstracción:\n[Describe aquí en qué momento y cómo el alumnado pondrá en práctica esta dimensión.]\n- Ejemplo: ${3:Extraer datos clave...}\n\nDiseño algorítmico:\n[Describe aquí en qué momento y cómo el alumnado pondrá en práctica esta dimensión.]\n- Ejemplo: ${4:Redactar instrucciones...}\n\nEvaluación:\n[Describe aquí en qué momento y cómo el alumnado pondrá en práctica esta dimensión.]\n- Ejemplo: ${5:Probar y corregir...}\n@end', desc: 'Tabla de activación del Pensamiento Computacional (Escola 4.0).' }
    };

    // Completion provider for Escola 4.0 directives and custom workspace components
    const escolaCompletionProvider = vscode.languages.registerCompletionItemProvider(
        'edumark',
        {
            async provideCompletionItems(
                document: vscode.TextDocument,
                position: vscode.Position,
                token: vscode.CancellationToken,
                context: vscode.CompletionContext
            ): Promise<vscode.CompletionItem[]> {
                const lineText = document.lineAt(position.line).text;
                const textBeforeCursor = lineText.substring(0, position.character);

                const hashIndex = textBeforeCursor.lastIndexOf('#');
                const atIndex = textBeforeCursor.lastIndexOf('@');

                let triggerChar = '';
                let triggerIndex = -1;

                if (hashIndex !== -1 && (atIndex === -1 || hashIndex > atIndex)) {
                    triggerChar = '#';
                    triggerIndex = hashIndex;
                } else if (atIndex !== -1 && (hashIndex === -1 || atIndex > hashIndex)) {
                    triggerChar = '@';
                    triggerIndex = atIndex;
                }

                if (triggerIndex === -1) {
                    return [];
                }

                const prefixBeforeTrigger = textBeforeCursor.substring(0, triggerIndex);
                if (prefixBeforeTrigger.trim() !== '') {
                    return [];
                }

                const items: vscode.CompletionItem[] = [];

                // 1. Process predefined Escola 4.0 components
                for (const [name, meta] of Object.entries(ESCOLA_WELL_KNOWN)) {
                    if (triggerChar === '#') {
                        if (meta.type === 'hash' || meta.type === 'both') {
                            const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Snippet);
                            item.insertText = new vscode.SnippetString(meta.body);
                            item.filterText = name;
                            item.documentation = new vscode.MarkdownString(meta.desc);
                            items.push(item);
                        }
                    } else if (triggerChar === '@') {
                        if (meta.type === 'at' || meta.type === 'both') {
                            const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Snippet);
                            item.insertText = new vscode.SnippetString(meta.body);
                            item.filterText = name;
                            item.documentation = new vscode.MarkdownString(meta.desc);
                            items.push(item);
                        }
                    }
                }

                // 2. Process dynamically scanned components
                try {
                    const scanned = await getWorkspaceComponents();
                    for (const name of scanned) {
                        if (ESCOLA_WELL_KNOWN[name]) {
                            continue;
                        }

                        if (triggerChar === '#') {
                            const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Snippet);
                            item.insertText = new vscode.SnippetString(name + ' ${1:opciones}');
                            item.filterText = name;
                            item.documentation = new vscode.MarkdownString(`Componente personalizado Escola 4.0: #${name}`);
                            items.push(item);
                        } else if (triggerChar === '@') {
                            const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Snippet);
                            item.insertText = new vscode.SnippetString(name + '\n\t${1:Contenido...}\n@end');
                            item.filterText = name;
                            item.documentation = new vscode.MarkdownString(`Directiva personalizada Escola 4.0: @${name}`);
                            items.push(item);
                        }
                    }
                } catch (e) {
                    // ignore scanning errors
                }

                return items;
            }
        },
        '#', '@'
    );

    context.subscriptions.push(escolaCompletionProvider);
}

export function deactivate() {}
