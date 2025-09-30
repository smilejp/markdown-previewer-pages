import g from"https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&t(n)}).observe(document,{childList:!0,subtree:!0});function o(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(r){if(r.ep)return;r.ep=!0;const i=o(r);fetch(r.href,i)}})();/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */const d="markdown_files_index",l="markdown_file_",m="sidebar_collapsed_state",f=`# Markdown Previewer with Local Storage

This is a real-time markdown editor. Your files are saved directly in your browser.

## Features

- **Live Preview:** Your markdown is rendered as you type.
- **Mermaid Support:** Create diagrams easily.
- **PDF Export:** Save your work as a PDF.
- **Themeable:** Switch between light and dark themes.
- **Local Storage:** Your files are saved in your browser, no login required!

### Example Diagram
Correct rendering of HTML tags like <br/> is now supported:
\`\`\`mermaid
graph TB
    subgraph "UI Layer"
        Pages["Pages/Components<br/>(React)"]
    end
    
    subgraph "Presenter Layer"
        Controller["Controllers<br/>(UI Event Handling)"]
        Transfer["Transfer<br/>(Entity → ViewModel)"]
        ViewModel["ViewModels<br/>(UI State)"]
    end
    
    Pages --> Controller
    Controller --> Transfer
    Transfer --> ViewModel
    Pages --> ViewModel
\`\`\`
`;class p{constructor(){this.state={currentFile:null},this.dom={editor:document.getElementById("editor"),preview:document.getElementById("preview"),styleSelector:document.getElementById("style-selector"),savePdfButton:document.getElementById("save-pdf"),saveButton:document.getElementById("save-button"),newDocButton:document.getElementById("new-doc-button"),fileList:document.getElementById("file-list"),helpButton:document.getElementById("help-button"),helpModal:document.getElementById("help-modal"),closeModalButton:document.getElementById("close-modal-button"),sidebar:document.getElementById("file-sidebar"),sidebarToggle:document.getElementById("sidebar-toggle"),resizer:document.getElementById("resizer"),editorSection:document.getElementById("editor-section"),mainContent:document.getElementById("main-content"),fileInfo:document.getElementById("file-info"),currentFileName:document.getElementById("current-file-name")},this.init()}async init(){this.checkLocalStorageSupport()||alert("경고: 이 브라우저는 로컬 저장소를 지원하지 않습니다. 파일 저장 기능이 제한될 수 있습니다."),mermaid.initialize({startOnLoad:!1,theme:"default"}),this.bindEvents();const e=this.storageGet(m)==="true";this.setSidebarState(e);const t=new URLSearchParams(window.location.search).get("url");t?await this.loadExternalMarkdown(t):this.dom.editor.value=f,this.updatePreview(),this.renderFileList()}checkLocalStorageSupport(){try{const e="localStorage_test";return localStorage.setItem(e,"test"),localStorage.removeItem(e),!0}catch{return!1}}bindEvents(){this.dom.editor.addEventListener("input",()=>this.updatePreview()),this.dom.styleSelector.addEventListener("change",()=>this.handleThemeChange()),this.dom.savePdfButton.addEventListener("click",()=>this.handleSavePdf()),this.dom.saveButton.addEventListener("click",()=>this.saveFile()),this.dom.newDocButton.addEventListener("click",()=>this.createNewFile()),this.dom.fileList.addEventListener("click",e=>this.handleFileListClick(e)),this.dom.helpButton.addEventListener("click",()=>this.toggleHelpModal(!0)),this.dom.closeModalButton.addEventListener("click",()=>this.toggleHelpModal(!1)),this.dom.helpModal.addEventListener("click",e=>{e.target===this.dom.helpModal&&this.toggleHelpModal(!1)}),this.dom.sidebarToggle.addEventListener("click",()=>this.handleSidebarToggle()),this.dom.resizer.addEventListener("mousedown",e=>this.initResizer(e))}updatePreview(){const e=this.dom.editor.value,o=marked.parse(e),t=DOMPurify.sanitize(o);this.dom.preview.innerHTML=t,this.dom.preview.querySelectorAll("code.language-mermaid").forEach(i=>{const n=i.parentElement;if(n){const s=document.createElement("div");s.classList.add("mermaid");const a=document.createElement("textarea");a.innerHTML=i.innerHTML,s.textContent=a.value,n.replaceWith(s)}}),this.dom.preview.querySelectorAll("pre code:not(.language-mermaid)").forEach(i=>{hljs.highlightElement(i)});try{mermaid.run()}catch(i){console.error("Error rendering Mermaid diagram:",i)}}renderFileList(){this.dom.fileList.innerHTML="";const e=this.storageGetFileIndex();if(e.length===0){this.dom.fileList.innerHTML="<li>No files found.</li>";return}e.sort((o,t)=>o.name.localeCompare(t.name)),e.forEach(o=>{const t=document.createElement("li");t.dataset.id=o.id,t.dataset.name=o.name,t.setAttribute("role","button"),t.tabIndex=0,t.innerHTML=`
                <span class="file-name">${o.name}</span>
                <button class="delete-btn" data-id="${o.id}" data-name="${o.name}" aria-label="Delete ${o.name}">&times;</button>
            `,this.dom.fileList.appendChild(t)})}updateFileInfo(){this.state.currentFile?(this.dom.fileInfo.style.display="block",this.dom.currentFileName.textContent=this.state.currentFile.name):this.dom.fileInfo.style.display="none"}setSidebarState(e){this.dom.sidebar.classList.toggle("collapsed",e),this.dom.sidebarToggle.classList.toggle("collapsed",e),this.dom.sidebarToggle.setAttribute("aria-expanded",String(!e)),this.dom.sidebarToggle.innerHTML=e?"›":"‹",this.storageSet(m,String(e))}toggleHelpModal(e){this.dom.helpModal.style.display=e?"flex":"none"}handleThemeChange(){const e=this.dom.styleSelector.value;this.dom.preview.className=`preview-style ${e}`,this.updatePreview()}handleSavePdf(){try{window.print()}catch(e){console.error("Failed to open print dialog:",e),alert("Could not open the print dialog. Please check browser settings.")}}handleFileListClick(e){const o=e.target,t=o.closest(".delete-btn"),r=o.closest("li");t&&t.dataset.id?this.deleteFile(t.dataset.id,t.dataset.name):r&&r.dataset.id&&this.loadFile(r.dataset.id)}handleSidebarToggle(){const e=this.dom.sidebar.classList.contains("collapsed");this.setSidebarState(!e)}createNewFile(){this.state.currentFile=null,this.dom.editor.value=`# New Document

Start writing!`,this.updatePreview(),this.updateFileInfo()}loadFile(e){const t=this.storageGetFileIndex().find(i=>i.id===e);if(!t){alert("File not found!");return}const r=this.storageGet(`${l}${e}`);r!==null?(this.dom.editor.value=r,this.state.currentFile=t,this.updatePreview(),this.updateFileInfo()):alert("Could not load file content.")}saveFile(){const e=this.dom.editor.value;let o=this.storageGetFileIndex();if(this.state.currentFile)this.storageSet(`${l}${this.state.currentFile.id}`,e),alert(`File "${this.state.currentFile.name}" updated.`);else{const t=prompt("Enter filename (e.g., my-document.md):","untitled.md");if(!t||!t.trim())return;const r=t.trim(),i=o.find(n=>n.name.toLowerCase()===r.toLowerCase());if(i){if(!confirm(`A file named "${r}" already exists. Do you want to overwrite it?`))return;this.storageSet(`${l}${i.id}`,e),this.state.currentFile=i,alert(`File "${i.name}" overwritten.`)}else{const n={id:Date.now().toString(),name:r};o.push(n),this.storageSet(`${l}${n.id}`,e),this.storageSetFileIndex(o),this.state.currentFile=n,alert(`File "${n.name}" saved.`)}this.renderFileList(),this.updateFileInfo()}}deleteFile(e,o){if(!confirm(`Are you sure you want to delete "${o}"? This cannot be undone.`))return;let t=this.storageGetFileIndex();t=t.filter(r=>r.id!==e);try{localStorage.removeItem(`${l}${e}`)}catch(r){console.error("Error removing file from localStorage:",r)}this.storageSetFileIndex(t),this.state.currentFile&&this.state.currentFile.id===e&&this.createNewFile(),this.renderFileList()}convertGoogleDocsUrl(e){const o=/docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)/,t=e.match(o);return t?`https://docs.google.com/document/d/${t[1]}/export?format=txt`:e}async loadExternalMarkdown(e){try{const o=this.convertGoogleDocsUrl(e),t=await fetch(o);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);const r=t.headers.get("content-type")||"";let i=await t.text();e.includes("docs.google.com")&&!r.includes("markdown")&&(i=`> **Note:** Loaded from Google Docs as plain text. Formatting may not be preserved.

`+i),this.dom.editor.value=i;const s=e.split("/"),a=s[s.length-1]||"external-document.md";this.state.currentFile={id:"external",name:a},this.updateFileInfo()}catch(o){console.error("Error loading external markdown:",o);const t=o instanceof Error?o.message:"Unknown error";alert(`❌ Failed to load document

URL: ${e}

Error: ${t}

Please check:
• The URL is correct and accessible
• The document is publicly available
• CORS headers are configured on the server`);const r=`# Error Loading External Document

Could not load the document from the provided URL.

**URL:** ${e}

**Error:** ${t}

## Troubleshooting

### For GitHub files:
Use raw URLs like:
\`\`\`
https://raw.githubusercontent.com/user/repo/main/file.md
\`\`\`

### For Google Docs:
1. File → Share → Change to "Anyone with the link"
2. Use the document URL directly:
\`\`\`
https://docs.google.com/document/d/YOUR_DOC_ID/edit
\`\`\`

### For other sources:
- Ensure the document is publicly accessible
- Check that CORS is enabled on the server
- Verify the URL is correct

You can still use this editor normally.`;this.dom.editor.value=r}}initResizer(e){e.preventDefault(),document.body.style.userSelect="none",document.body.style.cursor="col-resize";const o=r=>{const i=this.dom.sidebar.classList.contains("collapsed")?0:this.dom.sidebar.offsetWidth,n=this.dom.sidebarToggle.offsetWidth,s=this.dom.mainContent.getBoundingClientRect(),a=r.clientX-s.left-i-n,c=150,u=s.width;a>c&&u-a-this.dom.resizer.offsetWidth>c&&(this.dom.editorSection.style.flexGrow="0",this.dom.editorSection.style.flexBasis=`${a}px`)},t=()=>{document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",t),document.body.style.userSelect="",document.body.style.cursor=""};document.addEventListener("mousemove",o),document.addEventListener("mouseup",t)}storageGet(e){try{return localStorage.getItem(e)}catch(o){return console.error("Error reading from localStorage:",o),null}}storageSet(e,o){try{localStorage.setItem(e,o)}catch(t){console.error("Error writing to localStorage:",t),alert("저장 실패: 브라우저 저장소에 접근할 수 없습니다. 개인정보 보호 모드이거나 저장소가 가득 찬 것일 수 있습니다.")}}storageGetFileIndex(){const e=this.storageGet(d);if(!e)return[];try{const o=JSON.parse(e);return Array.isArray(o)?o:[]}catch(o){return console.error("Error parsing file index from localStorage:",o),this.storageSet(d,JSON.stringify([])),[]}}storageSetFileIndex(e){try{this.storageSet(d,JSON.stringify(e))}catch(o){console.error("Error saving file index to localStorage:",o),alert("파일 목록 저장에 실패했습니다.")}}}document.addEventListener("DOMContentLoaded",()=>{new p});window.mermaid=g;
//# sourceMappingURL=index-COnCPbWO.js.map
