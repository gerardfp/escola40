"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var crypto = __toESM(require("crypto"));
function getFileHash(filePath) {
  if (!fs.existsSync(filePath))
    return "";
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(content).digest("hex");
  } catch {
    return "";
  }
}
function syncDirectory(sourceDir, destDir, relPathBase, state) {
  let changed = false;
  if (!fs.existsSync(sourceDir))
    return false;
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    changed = true;
  }
  const items = fs.readdirSync(sourceDir);
  for (const item of items) {
    const srcItemPath = path.join(sourceDir, item);
    const destItemPath = path.join(destDir, item);
    const relativePath = path.join(relPathBase, item).replace(/\\/g, "/");
    const isDir = fs.statSync(srcItemPath).isDirectory();
    if (isDir) {
      const subChanged = syncDirectory(srcItemPath, destItemPath, relativePath, state);
      if (subChanged)
        changed = true;
    } else {
      const newHash = getFileHash(srcItemPath);
      if (!fs.existsSync(destItemPath)) {
        fs.copyFileSync(srcItemPath, destItemPath);
        state.files[relativePath] = newHash;
        changed = true;
      } else {
        const currentHash = getFileHash(destItemPath);
        const storedHash = state.files[relativePath];
        if (currentHash !== newHash) {
          if (!storedHash || currentHash === storedHash) {
            fs.copyFileSync(srcItemPath, destItemPath);
            state.files[relativePath] = newHash;
            changed = true;
          } else {
          }
        }
      }
    }
  }
  return changed;
}
function hasEduFileImmediately(dir) {
  try {
    if (!fs.existsSync(dir))
      return false;
    const items = fs.readdirSync(dir);
    return items.some((item) => {
      const itemPath = path.join(dir, item);
      return fs.statSync(itemPath).isFile() && item.endsWith(".edu");
    });
  } catch {
    return false;
  }
}
function findProjectRoot(filePath) {
  const fileUri = vscode.Uri.file(filePath);
  const folder = vscode.workspace.getWorkspaceFolder(fileUri);
  const workspaceRoot = folder ? folder.uri.fsPath : null;
  const parentDir = path.dirname(filePath);
  if (!workspaceRoot) {
    return parentDir;
  }
  let current = parentDir;
  let highestProjectRoot = parentDir;
  while (true) {
    if (hasEduFileImmediately(current)) {
      highestProjectRoot = current;
    }
    if (current === workspaceRoot) {
      break;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return highestProjectRoot;
}
function ensureProjectResources(workspaceDir, extensionPath) {
  try {
    const sourceConfig = path.join(extensionPath, ".config");
    const sourceTheme = path.join(extensionPath, "theme");
    if (!fs.existsSync(sourceConfig) && !fs.existsSync(sourceTheme)) {
      return;
    }
    const stateFolder = path.join(workspaceDir, ".config");
    if (!fs.existsSync(stateFolder)) {
      fs.mkdirSync(stateFolder, { recursive: true });
    }
    const legacyTypoDir = path.join(workspaceDir, ".config", "hightlight");
    if (fs.existsSync(legacyTypoDir)) {
      try {
        fs.rmSync(legacyTypoDir, { recursive: true, force: true });
        console.log(`[Escola 4.0] Directorio heredado con typo eliminado: ${legacyTypoDir}`);
      } catch (rmErr) {
      }
    }
    const stateFilePath = path.join(stateFolder, "escola40-state.json");
    let state = { files: {} };
    if (fs.existsSync(stateFilePath)) {
      try {
        state = JSON.parse(fs.readFileSync(stateFilePath, "utf8"));
      } catch {
      }
    }
    let updated = false;
    let stateChanged = false;
    const legacyCustomCss = path.join(workspaceDir, ".config", "highlight", "custom.css");
    if (fs.existsSync(legacyCustomCss)) {
      try {
        fs.rmSync(legacyCustomCss, { force: true });
        console.log(`[Escola 4.0] Archivo heredado custom.css eliminado: ${legacyCustomCss}`);
      } catch (rmErr) {
      }
    }
    if (state.files[".config/highlight/custom.css"]) {
      delete state.files[".config/highlight/custom.css"];
      stateChanged = true;
    }
    const redundantComponents = ["acordeon.js", "carrusel.js", "descarga.js", "imagen.js", "paginacion.js", "pestanas.js", "rubrica.js"];
    for (const comp of redundantComponents) {
      const compPath = path.join(workspaceDir, ".config", "components", comp);
      if (fs.existsSync(compPath)) {
        try {
          fs.rmSync(compPath, { force: true });
          console.log(`[Escola 4.0] Componente base redundante eliminado del workspace: ${compPath}`);
        } catch (rmErr) {
        }
      }
      const relPath = `.config/components/${comp}`;
      if (state.files[relPath]) {
        delete state.files[relPath];
        stateChanged = true;
      }
    }
    if (stateChanged) {
      updated = true;
    }
    if (fs.existsSync(sourceConfig)) {
      const destConfig = path.join(workspaceDir, ".config");
      const changed = syncDirectory(sourceConfig, destConfig, ".config", state);
      if (changed)
        updated = true;
    }
    if (fs.existsSync(sourceTheme)) {
      const destTheme = path.join(workspaceDir, "theme");
      const changed = syncDirectory(sourceTheme, destTheme, "theme", state);
      if (changed)
        updated = true;
    }
    if (updated) {
      fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), "utf8");
      vscode.window.showInformationMessage("Escola 4.0: Se han inicializado y actualizado las carpetas de recursos (.config y theme) en la ra\xEDz del proyecto.");
    }
  } catch (err) {
    console.error("Error al inicializar recursos Escola 4.0:", err);
  }
}
function activate(context) {
  console.log("La extensi\xF3n Escola 4.0 est\xE1 activa y monitoreando recursos del proyecto.");
  async function scanAndSyncWorkspace() {
    const files = await vscode.workspace.findFiles("**/*.edu");
    const projectRoots = /* @__PURE__ */ new Set();
    for (const file of files) {
      if (file.scheme === "file") {
        const projRoot = findProjectRoot(file.fsPath);
        if (projRoot) {
          projectRoots.add(projRoot);
        }
      }
    }
    for (const root of projectRoots) {
      console.log(`[Escola 4.0] Sincronizando recursos para ra\xEDz de proyecto encontrada: ${root}`);
      ensureProjectResources(root, context.extensionPath);
    }
  }
  scanAndSyncWorkspace();
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && (activeEditor.document.languageId === "edumark" || activeEditor.document.fileName.endsWith(".edu"))) {
    if (activeEditor.document.uri.scheme === "file") {
      const projRoot = findProjectRoot(activeEditor.document.uri.fsPath);
      console.log(`[Escola 4.0] Comprobando recursos iniciales para editor activo en startup: ${projRoot}`);
      ensureProjectResources(projRoot, context.extensionPath);
    }
  }
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders((event) => {
      console.log(`[Escola 4.0] Cambio en workspace folders. Resincronizando...`);
      scanAndSyncWorkspace();
    })
  );
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && (editor.document.languageId === "edumark" || editor.document.fileName.endsWith(".edu"))) {
        if (editor.document.uri.scheme === "file") {
          const projRoot = findProjectRoot(editor.document.uri.fsPath);
          console.log(`[Escola 4.0] Comprobando recursos reactivos para cambio de editor enfocado: ${projRoot}`);
          ensureProjectResources(projRoot, context.extensionPath);
        }
      }
    })
  );
  try {
    const sourceConfig = path.join(context.extensionPath, ".config");
    const sourceTheme = path.join(context.extensionPath, "theme");
    const watchHandler = (eventType, filename) => {
      if (filename) {
        console.log(`[Escola 4.0] Cambios detectados en recurso de la extensi\xF3n: ${filename}. Resincronizando...`);
        scanAndSyncWorkspace();
        const editor = vscode.window.activeTextEditor;
        if (editor && (editor.document.languageId === "edumark" || editor.document.fileName.endsWith(".edu"))) {
          if (editor.document.uri.scheme === "file") {
            const projRoot = findProjectRoot(editor.document.uri.fsPath);
            ensureProjectResources(projRoot, context.extensionPath);
          }
        }
      }
    };
    let debounceTimeout = null;
    const debouncedWatchHandler = (eventType, filename) => {
      if (debounceTimeout)
        clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        watchHandler(eventType, filename);
      }, 200);
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
    console.error("Error al iniciar el watcher de recursos de la extensi\xF3n:", watchErr);
  }
  async function getProjectComponents(projectRoot) {
    const components = /* @__PURE__ */ new Set();
    const rootUri = vscode.Uri.file(projectRoot);
    const paths = [
      vscode.Uri.joinPath(rootUri, ".config", "components"),
      vscode.Uri.joinPath(rootUri, "config", "components"),
      vscode.Uri.joinPath(rootUri, "components")
    ];
    for (const dirUri of paths) {
      try {
        if (dirUri.scheme === "file" && !fs.existsSync(dirUri.fsPath)) {
          continue;
        }
        const files = await vscode.workspace.fs.readDirectory(dirUri);
        for (const [name, type] of files) {
          if (type === vscode.FileType.File && name.endsWith(".js")) {
            let compName = name.slice(0, -3);
            if (compName.startsWith("sym_")) {
              compName = compName.slice(4);
            }
            if (compName !== "_aliases") {
              components.add(compName);
            }
          }
        }
      } catch (e) {
      }
    }
    return Array.from(components);
  }
  const ESCOLA_WELL_KNOWN = {
    "imagen": { type: "hash", body: "imagen ${1:ruta_imagen.png} {ancho: ${2:600}, pie: ${3:Pie de foto}, sombra: ${4|si,no|}, borde: ${5|si,no|}}", desc: "Inserta una imagen con t\xEDtulo y opciones (Escola 4.0)." },
    "portada": { type: "hash", body: "portada ${1:ruta_portada.jpg}", desc: "Inserta la portada del recurso (Escola 4.0)." },
    "descarga": { type: "hash", body: "descarga", desc: "Inserta el iDevice de descarga del archivo fuente (Escola 4.0)." },
    "resum": { type: "hash", body: "resum", desc: "Inserta un resumen de la p\xE1gina (Escola 4.0)." },
    "preguntate": { type: "at", body: "preguntate\n${1:Pregunta o reflexi\xF3n...}\n@end", desc: 'Tarjeta did\xE1ctica "Preg\xFAntate" (Escola 4.0).' },
    "atencion": { type: "at", body: "atencion\n${1:Contenido...}\n@end", desc: 'Tarjeta did\xE1ctica "Atenci\xF3n" (Escola 4.0).' },
    "sabiasque": { type: "at", body: "sabiasque\n${1:Contenido...}\n@end", desc: 'Tarjeta did\xE1ctica "\xBFSab\xEDas que...?" (Escola 4.0).' },
    "sugerencia": { type: "at", body: "sugerencia\n${1:Contenido...}\n@end", desc: 'Tarjeta did\xE1ctica "Sugerencia" (Escola 4.0).' },
    "solucion": { type: "at", body: "solucion\n${1:Contenido...}\n@end", desc: 'Tarjeta did\xE1ctica "Soluci\xF3n" (Escola 4.0).' },
    "reflexion": { type: "at", body: "reflexion\n${1:Contenido...}\n@end", desc: 'Tarjeta did\xE1ctica "Reflexi\xF3n" (Escola 4.0).' },
    "actividad": { type: "at", body: "actividad\n${1:Contenido...}\n@end", desc: 'Tarjeta did\xE1ctica "Actividad" (Escola 4.0).' },
    "nota": { type: "at", body: "nota\n${1:Contenido...}\n@end", desc: 'Tarjeta did\xE1ctica "Nota" (Escola 4.0).' },
    "pregunta": { type: "at", body: "pregunta\n${1:Contenido...}\n@end", desc: 'Tarjeta did\xE1ctica "Pregunta" (Escola 4.0).' },
    "rubrica": { type: "at", body: "rubrica ${1:T\xEDtulo}\n\n| ${2:Criterio} | ${3:Excelente} | ${4:A mejorar} |\n| :--- | :--- | :--- |\n| ${5:Criterio 1} | ${6:Excelente...} | ${7:A mejorar...} |\n\n@end", desc: "R\xFAbrica de evaluaci\xF3n (Escola 4.0)." },
    "informacion": { type: "at", body: "informacion\n${1:Contenido...}\n@end", desc: 'Tarjeta did\xE1ctica "Informaci\xF3n" (Escola 4.0).' },
    "pc": { type: "at", body: "pc\nDescomposicion:\n[Describe aqu\xED en qu\xE9 momento y c\xF3mo el alumnado pondr\xE1 en pr\xE1ctica esta dimensi\xF3n.]\n- Ejemplo: ${1:Dividir el reto...}\n\nReconocimiento de patrones:\n[Describe aqu\xED en qu\xE9 momento y c\xF3mo el alumnado pondr\xE1 en pr\xE1ctica esta dimensi\xF3n.]\n- Ejemplo: ${2:Registrar resultados...}\n\nAbstracci\xF3n:\n[Describe aqu\xED en qu\xE9 momento y c\xF3mo el alumnado pondr\xE1 en pr\xE1ctica esta dimensi\xF3n.]\n- Ejemplo: ${3:Extraer datos clave...}\n\nDise\xF1o algor\xEDtmico:\n[Describe aqu\xED en qu\xE9 momento y c\xF3mo el alumnado pondr\xE1 en pr\xE1ctica esta dimensi\xF3n.]\n- Ejemplo: ${4:Redactar instrucciones...}\n\nEvaluaci\xF3n:\n[Describe aqu\xED en qu\xE9 momento y c\xF3mo el alumnado pondr\xE1 en pr\xE1ctica esta dimensi\xF3n.]\n- Ejemplo: ${5:Probar y corregir...}\n@end", desc: "Tabla de activaci\xF3n del Pensamiento Computacional (Escola 4.0)." }
  };
  const escolaCompletionProvider = vscode.languages.registerCompletionItemProvider(
    "edumark",
    {
      async provideCompletionItems(document, position, token, context2) {
        const lineText = document.lineAt(position.line).text;
        const textBeforeCursor = lineText.substring(0, position.character);
        if (position.line === 0 && textBeforeCursor === "---") {
          const metadataItem = new vscode.CompletionItem("--- plantilla de metadatos", vscode.CompletionItemKind.Snippet);
          metadataItem.insertText = new vscode.SnippetString([
            "---",
            "titulo: ${1:T\xEDtulo}",
            "subtitulo: ${2:Subt\xEDtulo}",
            "idioma: ${3|Espa\xF1ol,Valenci\xE0,English|}",
            "autoria: ${4:Nombre del Profesor o Autores}",
            "licencia: ${5|Dominio P\xFAblico,Creative Commons BY-NC-SA,Creative Commons BY-SA|}",
            "descripcion: ${6:Descripci\xF3n de la unidad}",
            "etapa: ${7|Primaria,Secundaria,Bachillerato,F.P.|}",
            "nivel: ${8:1\xBA ESO}",
            "area: ${9:Tecnolog\xEDa / Digitalizaci\xF3n}",
            "tipo: ${10|Desenchufada,Programaci\xF3n,Rob\xF3tica,Dise\xF1o 3D,IA|}",
            "sesiones: ${11:4}",
            "---",
            "$0"
          ].join("\n"));
          metadataItem.range = new vscode.Range(new vscode.Position(0, 0), position);
          metadataItem.documentation = new vscode.MarkdownString("Inserta la plantilla de metadatos (Frontmatter) oficial para Escola 4.0.");
          return [metadataItem];
        }
        const hashIndex = textBeforeCursor.lastIndexOf("#");
        const atIndex = textBeforeCursor.lastIndexOf("@");
        let triggerChar = "";
        let triggerIndex = -1;
        if (hashIndex !== -1 && (atIndex === -1 || hashIndex > atIndex)) {
          triggerChar = "#";
          triggerIndex = hashIndex;
        } else if (atIndex !== -1 && (hashIndex === -1 || atIndex > hashIndex)) {
          triggerChar = "@";
          triggerIndex = atIndex;
        }
        if (triggerIndex === -1) {
          return [];
        }
        const prefixBeforeTrigger = textBeforeCursor.substring(0, triggerIndex);
        if (prefixBeforeTrigger.trim() !== "") {
          return [];
        }
        const items = [];
        for (const [name, meta] of Object.entries(ESCOLA_WELL_KNOWN)) {
          if (triggerChar === "#") {
            if (meta.type === "hash" || meta.type === "both") {
              const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Snippet);
              item.insertText = new vscode.SnippetString(meta.body);
              item.filterText = name;
              item.documentation = new vscode.MarkdownString(meta.desc);
              items.push(item);
            }
          } else if (triggerChar === "@") {
            if (meta.type === "at" || meta.type === "both") {
              const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Snippet);
              item.insertText = new vscode.SnippetString(meta.body);
              item.filterText = name;
              item.documentation = new vscode.MarkdownString(meta.desc);
              items.push(item);
            }
          }
        }
        try {
          const projRoot = findProjectRoot(document.uri.fsPath);
          const scanned = await getProjectComponents(projRoot);
          for (const name of scanned) {
            if (ESCOLA_WELL_KNOWN[name]) {
              continue;
            }
            if (triggerChar === "#") {
              const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Snippet);
              item.insertText = new vscode.SnippetString(name + " ${1:opciones}");
              item.filterText = name;
              item.documentation = new vscode.MarkdownString(`Componente personalizado Escola 4.0: #${name}`);
              items.push(item);
            } else if (triggerChar === "@") {
              const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Snippet);
              item.insertText = new vscode.SnippetString(name + "\n	${1:Contenido...}\n@end");
              item.filterText = name;
              item.documentation = new vscode.MarkdownString(`Directiva personalizada Escola 4.0: @${name}`);
              items.push(item);
            }
          }
        } catch (e) {
        }
        return items;
      }
    },
    "#",
    "@",
    "-"
  );
  context.subscriptions.push(escolaCompletionProvider);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
