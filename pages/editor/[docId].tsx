import ExampleTheme from "@/components/plugins/Theme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "@/components/plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import ActionsPlugin from "@/components/plugins/ActionsPlugin";
import CodeHighlightPlugin from "@/components/plugins/CodeHighlightPlugin";
// import prepopulatedText from "@/components/plugins/SampleText";
import CopilotPlugin from "@/components/plugins/CopilotPlugin";
// import DraggableBlockPlugin from '@/components/plugins/DraggableBlockPlugin';
import { useEffect, useRef, useState } from 'react';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { Role, ChatHistory, Message, Doc, DefaultSetting, Setting, Action, DefaultActions } from "@/types/data";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { EditorState, LexicalEditor } from 'lexical';
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import RestorePlugin from "@/components/plugins/RestorePlugin";
import { FiBook, FiDownload, FiMenu, FiMessageSquare, FiSettings, FiUpload, FiX, FiDelete } from 'react-icons/fi'

import {Trash3Fill} from "react-bootstrap-icons"

import { useMediaQuery } from 'react-responsive'
import Link from "next/link";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Prompts from "@/components/prompts";
import Settings from "@/components/settings";
import Modal from "@/components/modal";
import { nanoid } from 'nanoid'
import axios from 'axios';

import { useRouter } from 'next/router';
import Layout from "@/components/layout";
import { toast } from "@/components/ui/use-toast";
import { Toast } from "@/components/ui/toast";


export function getSavedSettings(): Setting {
    let prevSettings: Setting = DefaultSetting;
    let _setting = localStorage.getItem('settings')
    if (_setting) {
        prevSettings = JSON.parse(_setting) as Setting;
        if (prevSettings.actionPrompts === undefined) {
            prevSettings.actionPrompts = DefaultActions
        }
    }
    console.log("GET SETTING", prevSettings)

    // Save the settings to the database
    // await saveSettingsToDatabase(prevSettings);

    return prevSettings;
}

export async function getSavedSettingsPrisma(docId: string): Promise<Setting> {
    let prevSettings: Setting = DefaultSetting;

    try {
        const res = await fetch(`/api/getSettings?docId=${docId}`);
        const settings = await res.json();

        if (res.status === 200) {
            prevSettings = settings as Setting;
            if (prevSettings.actionPrompts === undefined) {
                prevSettings.actionPrompts = DefaultActions;
            }
        } else {
            throw new Error(settings.error);
        }
    } catch (error) {
        console.error('Failed to fetch settings:', error);
    }

    return prevSettings;
}

// async function saveSettingsToDatabase(settings: Setting) {
//   // Replace this with your own logic to save the settings to the database
// }


function Placeholder() {
    return (
        <div className="editor-placeholder">
            Type something...
        </div>
    );
}

interface DocIndex {
    id: string;
    title: string;
}


function toggleClass(condition: boolean, mobileClass: string, desktopClass: string) {
    if (condition) {
        return mobileClass
    } else {
        return desktopClass
    }
}



function Editor({ editorState, onCreateChat, onChange, dtitle, history, onChatUpdate, onTitleChange, isChatOpen, setIsChatOpen, isMobile, setIsPromptsOpen, setting }) {

    const [title, setTitle] = useState<string>(dtitle)
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    const editorConfig = {
        editorState: editorState,
        theme: ExampleTheme,
        // Handling of errors during update
        onError(error) {
            throw error;
        },
        // Any custom nodes go here
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode
        ]
    };

    return (
        <div className="w-full flex">
            <LexicalComposer initialConfig={editorConfig}>
                <PanelGroup direction="horizontal">
                    <Panel className="editor-inner w-full lg:w-3/5 p-4">

                        <div className="editor-container  min-h-full">

                            <ToolbarPlugin setting={setting} onCreateChat={onCreateChat} setIsChatOpen={setIsChatOpen} isMobile={isMobile} setIsPromptsOpen={setIsPromptsOpen} />
                            <input className="flex px-4 w-full text-4xl outline-none" contentEditable="true" placeholder="Untitled" value={title} onChange={e => { setTitle(e.target.value); onTitleChange(e.target.value); }}></input>
                            <div className="relative">

                                <RichTextPlugin
                                    contentEditable={
                                        <div className="editor-scroller">
                                            <div className="editor" ref={onRef}>
                                                <ContentEditable className="editor-contenteditable min-h-full" />
                                            </div>
                                        </div>
                                    }
                                    placeholder={<Placeholder />}
                                    ErrorBoundary={LexicalErrorBoundary}
                                />
                                <AutoFocusPlugin />
                                <ListPlugin />
                                <LinkPlugin />
                                <HistoryPlugin />
                                {/* <DraggableBlockPlugin anchorElem={floatingAnchorElem} /> */}
                                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                                <CodeHighlightPlugin />
                                <OnChangePlugin onChange={onChange} ignoreSelectionChange={true} />
                                {/* <RestorePlugin state={currentDoc.data}/> */}
                            </div>
                            <ActionsPlugin />
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-gray-50" />
                    <Panel className={isChatOpen ? "p-4 bg-white h-screen z-1 absolute w-full" : "hidden lg:block lg:p-4 lg:w-2/5 lg:overflow-scroll lg:h-screen"} style={{ overflow: 'auto' }}>
                        <CopilotPlugin setting={setting} history={history} onChatUpdate={onChatUpdate} />
                    </Panel>
                </PanelGroup>
            </LexicalComposer>
        </div>
    );
}

export default function App() {
    const router = useRouter();

    const { docId } = router.query

    const [history, setHistory] = useState<ChatHistory[]>([]);
    const defaultData: string = '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
    const [editorState, setEditorState] = useState<string>(defaultData)
    const [docs, setDocs] = useState<DocIndex[]>([]);

    let [isSettingsOpen, setIsSettingsOpen] = useState(false)
    let [isPromptsOpen, setIsPromptsOpen] = useState(false)

    const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    // const [isMobile, setIsMobile] = useState<boolean>(true);

    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

    const [docPrompt, setDocPrompt] = useState<string>("");
    const [setting, setSetting] = useState<Setting>(DefaultSetting);
    const [currentDoc, setCurrentDoc] = useState<Doc | null>(null);

    const getAllDocsFromDatabase = async () => {
        try {
            const res = await fetch(`/api/getAllDocs`);
            if (res.status !== 200) {
                throw new Error('Failed to fetch documents');
            }
            const docs = await res.json();
            localStorage.setItem('docs', JSON.stringify(docs));
            return docs;
        } catch (error) {
            console.error(error);
        }
    }
    
    useEffect(() => {
        if (docId) {
            axios.get(`/api/docs/${docId}`).then(response => {
                if (response.data) {
                    // Document exists, load it into the editor
                    setDocs(response.data)
                } else async () =>{
                    // Document doesn't exist, create a new one
                    // const newDoc = { id: docId, data: {} }
                    // If there are no documents, create a new one
                    const newDoc = {
                        id: docId,
                        title: "Untitled",
                        prompt: "",
                        data: defaultData, // replace with your default data
                        history: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    await prisma.doc.create({ data: newDoc });
                    docs = [newDoc];
                    setDocs([newDoc])
                    saveDocsToDatabase([newDoc])
                }
            })
        }
    }, [docId])

    useEffect(() => {
        if (currentDoc === null) {
            const docId = localStorage.getItem("selectedDocId")
            onSelectDoc(docId)
            console.log("Loading doc", docId, currentDoc)
            console.log("setting_useeffect", setting);
            getAllDocsFromDatabase().then(docs => {
                if (docs) {
                    setDocs(docs);
                    saveDocsToDatabase(docs);
                }
            });
            const _docs = localStorage.getItem("docs")
            console.log("DOCS editor", JSON.parse(_docs))

            if (_docs) {
                setDocs(JSON.parse(_docs))
                // Save the documents to the database
                saveDocsToDatabase(JSON.parse(_docs));
            }
        }

    }, [])

    async function saveDocsToDatabase(docs: DocIndex[]) {
        await axios.post('/api/saveDocs', { docs });
    }
    const onChatUpdate = async (id: string, role: Role, response: string) => {
        let _history = []
        for (let i = 0; i < history.length; i++) {
            const chat = history[i];
            if (chat.id == id) {
                let c: ChatHistory = { ...chat }
                console.log("OLD CHAT:", chat)
                c.messages.push({ role: role, content: response } as Message)
                console.log("NEW CHAT:", c)
                _history.push(c)
            } else {
                _history.push(chat)
            }
        }
        setHistory(_history);
        saveDoc(editorState, _history)
        console.log("Saving history..", _history)

        try {
            const doc: Doc = { ...currentDoc, history: _history, updatedAt: +new Date }
            const res = await fetch('/api/saveDoc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(doc)
            });
            if (res.status !== 200) {
                throw new Error('Failed to save document');
            }
        } catch (error) {
            console.error(error);
        }
    };
    async function onCreateChat(task, content) {
        // const setting = getSettings();
        let actionPrompt: Action;
        for (let i = 0; i < setting.actionPrompts.length; i++) {
            const ap: Action = setting.actionPrompts[i];
            if (ap.id == task) {
                actionPrompt = ap
                break
            }
        }
        const messages = [
            {
                role: 'system',
                content: setting.globalPrompt + currentDoc.prompt + actionPrompt.prompt,
            },
            {
                role: "user",
                content: content
            }
        ]

        let chat: ChatHistory = { id: nanoid(), task, selection: content, messages: messages, modelId: setting.modelId, temperature: setting.temperature }
        console.log("NEW", task, content, chat)
        const _history = [chat, ...history]
        setHistory(_history);
        saveDoc(editorState, _history)
        console.log("onCreateChat saving", _history)
        // onChatUpdate(id)
    };


    const onChange = async (editorState: EditorState) => {
        if (currentDoc) {
            const _editorState = JSON.stringify(editorState.toJSON())
            setEditorState(_editorState)
            saveDoc(_editorState, history)
            console.log("Saving changes... onChange", history)

            try {
                const doc: Doc = { ...currentDoc, data: _editorState, history: history, updatedAt: +new Date }
                const res = await fetch('/api/saveDoc', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...doc, id: doc.id.replace('doc-', '') }) // remove "doc-" prefix
                });
                if (res.status !== 200) {
                    throw new Error('Failed to save document');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const onCreateDoc = async () => {
        const doc: Doc = { id: nanoid(), title: "Untitled", prompt: "", data: defaultData, history: [], createdAt: +new Date, updatedAt: +new Date }
        const _docs: DocIndex[] = [{ id: doc.id, title: doc.title } as DocIndex, ...docs]
        setDocs(_docs);
        // saveDocsToDatabase(_docs);
        localStorage.setItem("docs", JSON.stringify(_docs))
        localStorage.setItem(doc.id, JSON.stringify(doc))
        localStorage.setItem("selectedDocId", doc.id)
        setCurrentDoc(doc)
        setEditorState(doc.data)
        setHistory(doc.history)
        console.log("created onCreateDoc", doc.id)

        try {
            const res = await fetch('/api/saveDoc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...doc, id: doc.id.replace('doc-', '') }) // remove "doc-" prefix
            });
            if (res.status !== 200) {
                throw new Error('Failed to save document');
            }
        } catch (error) {
            console.error(error);
        }
    }


    const onSelectDoc = async (docId: string) => {
        try {
            const prismaSettings = await getSavedSettingsPrisma(docId);
            console.log("prismaSettings", prismaSettings);
            setSetting(prismaSettings)
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }

        console.log("selectedDoc", docId)

        try {
            const res = await fetch(`/api/getDoc?docId=${docId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status === 200) {
                const doc = await res.json() as Doc;
                doc.id = doc.id; // add "doc-" prefix
                setCurrentDoc(doc);
                setEditorState(doc.data);
                setHistory(doc.history);
                setDocPrompt(doc.prompt);
                localStorage.setItem("selectedDocId", doc.id);
            } else {
                throw new Error('Failed to fetch document');
            }
        } catch (error) {
            console.error(error);
        }

        setIsNavOpen(false)
        router.push(`/editor/${docId}`);
    }

    const onDeleteDoc = async (docId: string) => {
        console.log("deleteDoc", docId)
        try {
            const res = await fetch(`/api/deleteDoc?docId=${docId}`);
            if (res.status !== 200) {
                throw new Error('Failed to delete document');
            }
            // Remove the document from the docs state
            const updatedDocs = docs.filter(doc => doc.id !== docId);
            setDocs(updatedDocs);
            // Update the docs in localStorage
            localStorage.setItem('docs', JSON.stringify(updatedDocs));
            // Remove the document from localStorage
            localStorage.removeItem(docId);
            console.log("deleteDoc")
            toast({
                title: "Document deleted successfully",
            })
            router.push(`/editor`);
        } catch (error) {
            console.error(error);
        }
    }

    const saveDoc = async (_editorState, _history) => {
        const doc: Doc = { ...currentDoc, data: _editorState, history: _history, updatedAt: +new Date }
        localStorage.setItem(currentDoc.id, JSON.stringify(doc))
        console.log("saved saveDoc currentDoc", currentDoc.id)
        console.log("saved saveDoc", JSON.stringify(doc))
        console.log("saved saveDoc _editorState", _editorState)

        try {
            const res = await fetch('/api/saveDoc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...doc, id: doc.id.replace('doc-', '') }) // remove "doc-" prefix
            });
            if (res.status !== 200) {
                throw new Error('Failed to save document');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onSaveDocPrompt = async (prompt) => {
        const doc: Doc = { ...currentDoc, prompt }
        setCurrentDoc(doc)
        localStorage.setItem(currentDoc.id, JSON.stringify(doc))
        console.log("saved onSaveDocPrompt", currentDoc.id)

        try {
            const res = await fetch('/api/saveDoc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...doc, id: doc.id.replace('doc-', '') }) // remove "doc-" prefix
            });
            if (res.status !== 200) {
                throw new Error('Failed to save document');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onTitleChange = async (title) => {
        console.log("TITLE", title)
        const doc: Doc = { ...currentDoc, title }
        localStorage.setItem(currentDoc.id, JSON.stringify(doc))
        console.log("saved", currentDoc.id)
        const _docs = docs.map(obj => {
            if (obj.id == currentDoc.id) {
                return { ...obj, title }
            }
            return obj
        })
        setDocs(_docs)
        localStorage.setItem("docs", JSON.stringify(_docs))

        try {
            const res = await fetch('/api/saveDoc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...doc, id: doc.id.replace('doc-', '') }) // remove "doc-" prefix
            });
            if (res.status !== 200) {
                throw new Error('Failed to save document');
            }
        } catch (error) {
            console.error(error);
        }
    }

    function downloadObjectAsJson(exportObj, exportName) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
    const onExport = (e) => {
        downloadObjectAsJson(localStorage, "lexeme-" + new Date().toISOString().replaceAll(':', '.'))
    }

    const onImport = (data) => {
        Object.keys(data).forEach(function (k) {
            localStorage.setItem(k, data[k]);
        });
        window.location.reload();
    }

    const onImportChange = (e) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            let json = JSON.parse(e.target?.result as string);
            onImport(json);
        };
        reader.readAsText(file);
    }

    const onMobileRightClick = (e) => {
        if (isNavOpen) {
            setIsNavOpen(false);
        } else {
            setIsNavOpen(true);
        }
        console.log("Right CLICK", "isNavOpen:", isNavOpen, "isChatOpen:", isChatOpen)
    }

    const onMobileLeftClick = (e) => {
        if (isNavOpen) {
            setIsNavOpen(false);
        } else if (isChatOpen) {
            setIsChatOpen(false);
        } else {
            setIsChatOpen(true);
        }
        console.log("LEFT CLICK", "isNavOpen:", isNavOpen, "isChatOpen:", isChatOpen)
    }
    return (
        <Layout>
            <Modal title="Prompts" isOpen={isPromptsOpen} setIsOpen={setIsPromptsOpen}>
                <Prompts setIsOpen={setIsPromptsOpen} docPrompt={docPrompt} setDocPrompt={setDocPrompt} setting={setting} setSetting={setSetting} onSaveDocPrompt={onSaveDocPrompt} />
            </Modal>
            <div className="sticky top-0 z-10 flex items-center border-b border-gray-200 pl-1 pt-1 bg-white text-gray-900 lg:pl-3 lg:hidden">
                <button type="button" onClick={onMobileRightClick} className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open sidebar</span>
                    {(!isNavOpen && !isChatOpen) && <FiMenu size="1rem" className="h-6 w-6" />}
                </button>
                <h1 className="flex-1 text-center text-base font-normal">Lexeme</h1>
                <button type="button" className="px-3" onClick={onMobileLeftClick}>
                    {(isNavOpen || isChatOpen) && <FiX size="1rem" className="h-6 w-6" />}
                    {(!isNavOpen && !isChatOpen) && <FiMessageSquare size="1rem" className="h-6 w-6" />}
                </button>
            </div>

            <div className="flex">

                <Modal
                    title="Settings"
                    isOpen={isSettingsOpen}
                    setIsOpen={setIsSettingsOpen}
                >
                    <Settings
                        setIsOpen={setIsSettingsOpen}
                        setting={setting}
                        setSetting={setSetting}
                        docId={currentDoc ? currentDoc.id : ""}
                    />
                </Modal>
                <div className={isNavOpen ? "w-full z-1 p-4 border-r border-gray-200" : "hidden lg:p-4 lg:flex lg:flex-col lg:w-1/5"}>
                    <Link href="/">
                        <h1 className="text-4xl font-semibold pb-2">Lexeme</h1>
                    </Link>
                    {/* <p>SQL Workbench like editor for AI. Tired of starting new conversation for each thing you're writing?</p> */}
                    <div className="pb-4">Workbench for ChatGPT</div>
                    <a onClick={onCreateDoc} className="flex p-3 items-center gap-3 transition-colors duration-200 cursor-pointer rounded-md border border-gray-200 hover:bg-gray-200 mb-1 flex-shrink-0">
                        New doc
                    </a>
                    <ol className="">
                        {docs.map((item, i) => (
                            <li key={item.id} className="flex gap-3 items-center relative group rounded-md cursor-pointer break-all text-gray-900 hover:bg-gray-100 text-left">
                                <button
                                    className="w-full h-full px-4 py-4 flex text-left line-clamp-1 justify-start " onClick={() => onSelectDoc(item.id)}>
                                    {item.title}
                                </button>
                                <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this document?')) {
                                        onDeleteDoc(item.id);
                                    }
                                }} 
                                className="h-full px-4 py-4 ml-auto rounded-lg hover:bg-stone-300"
                                >
                                    <Trash3Fill className="w-4 h-auto" />
                                </button>
                            </li>
                        ))}
                    </ol>

                    <div className="flex-col flex-1 border-t border-white/2 pt-2 mt-2">
                        <a onClick={(e) => setIsSettingsOpen(true)} className="flex p-3 gap-3 items-center relative group rounded-md cursor-pointer break-all text-gray-900 hover:bg-gray-100 ">
                            <FiSettings /> Settings
                        </a>

                    </div>
                </div>

                {(currentDoc !== null && !isNavOpen) &&
                    <Editor key={currentDoc.id} editorState={editorState} onCreateChat={onCreateChat} onChange={onChange} history={history} onChatUpdate={onChatUpdate} onTitleChange={onTitleChange} dtitle={currentDoc.title} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} isMobile={isMobile} setIsPromptsOpen={setIsPromptsOpen} setting={setting} />
                }
            </div>
        </Layout>
    );
}