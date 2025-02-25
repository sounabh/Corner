/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import {NavLink} from "react-router-dom"
import { Eye, EyeOff, Moon, Play, Save, Sun, Videotape, X } from "lucide-react";
import axios from "axios";
import useAuthStore from "./store/authStore";
import { useParams } from "react-router";

// Constants for supported languages and their configurations
const SUPPORTED_LANGUAGES = {
  html: {
    label: "HTML",
    defaultCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>`,
    version: "latest",
  },
  css: {
    label: "CSS",
    defaultCode: "body { background-color: #f4f4f4; }",
    version: "latest",
  },
  javascript: {
    label: "JavaScript",
    defaultCode: "// Write your JavaScript code here",
    version: "18.15.0",
  },
  python: {
    label: "Python",
    defaultCode: "# Write your Python code here\nprint('Hello, World!')",
    version: "3.10.0",
  },
  cpp: {
    label: "C++",
    defaultCode:
      '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    version: "latest",
  },
  typescript: {
    label: "TypeScript",
    defaultCode:
      "interface Greeting {\n  message: string;\n}\n\nconst sayHello = (greeting: Greeting): void => {\n  console.log(greeting.message);\n};",
    version: "5.0.3",
  },
};

const EditorComponent = () => {
  // State Management
  const [tab, setTab] = useState("html");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [socket, setSocket] = useState(null);
  const [userList, setUserList] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [compilerOutput, setCompilerOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(true);
  
  // Refs for editors and local edits tracking
  const editorRefs = useRef({});
  const isLocalEdit = useRef(false);

  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);

  const params = useParams();

  // Code states for each language
  const [codeStates, setCodeStates] = useState(
    Object.keys(SUPPORTED_LANGUAGES).reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: SUPPORTED_LANGUAGES[lang].defaultCode,
      }),
      {}
    )
  );

  // Saved code tracking state
  const [savedCodes, setSavedCodes] = useState([]); // Tracks saved code

  // Room and user configuration
  const roomId = params.roomId;
  const userName = user.name;

  // Theme toggle handler
  const toggleTheme = () => {
    setIsLightMode((prev) => !prev);
    document.body.classList.toggle("lightMode");
  };

  // Handle editor mount
  const handleEditorDidMount = (editor, language) => {
    editorRefs.current[language] = editor;
  };

  // Socket connection setup
  useEffect(() => {
    const getCode = async() => {
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_BASE_URL}/editor/${params.roomId}`,{
        headers:{
          authorization : `Bearer ${token}`
        }
      });
      console.log(response);
      //setShowVideoCall(response.data.subscription)
      if (response.data?.data) {
        setCodeStates((prev) => ({
          ...prev,
          ...response.data.data, // Merge saved codes with existing ones
        }));
      }
    };

    getCode();
    
    const newSocket = io("https://corner-sicf.onrender.com");
    setSocket(newSocket);

    newSocket.emit("join", { roomId, userName });

    const socketEventHandlers = {
      userList: (users) => setUserList(users),
      codeUpdate: ({ language, code }) => {
        // Skip update if this is a local edit that we already processed
        if (isLocalEdit.current) {
          isLocalEdit.current = false;
          return;
        }
        
        // Handle remote update - save cursor position before update
        const editor = editorRefs.current[language];
        if (editor && editor.getModel()) {
          const currentPosition = editor.getPosition();
          
          setCodeStates((prev) => {
            if (prev[language] !== code) {
              return { ...prev, [language]: code };
            }
            return prev;
          });
          
          // Restore cursor position after state update in next tick
          setTimeout(() => {
            if (editor && currentPosition) {
              editor.setPosition(currentPosition);
              editor.revealPositionInCenter(currentPosition);
            }
          }, 0);
        } else {
          // No editor reference yet, just update the state
          setCodeStates((prev) => {
            if (prev[language] !== code) {
              return { ...prev, [language]: code };
            }
            return prev;
          });
        }
      },
      codeResponse: (response) => {
        setCompilerOutput(response.run.output);
        setIsCompiling(false);
      },
    };

    Object.entries(socketEventHandlers).forEach(([event, handler]) => {
      newSocket.on(event, handler);
    });

    return () => {
      Object.keys(socketEventHandlers).forEach((event) => {
        newSocket.off(event);
      });
      newSocket.disconnect();
    };
  }, []);

  // Code change handler
  const handleCodeChange = (language) => (value) => {
    const newCode = value || "";
    
    // Mark this as a local edit to avoid cursor position issues
    isLocalEdit.current = true;
    
    setCodeStates((prev) => ({ ...prev, [language]: newCode }));

    socket?.emit("userTyping", { roomId, userName });
    
    // Add a small debounce for network performance
    const timeoutId = setTimeout(() => {
      socket?.emit("codeChange", { 
        roomId, 
        language, 
        code: newCode 
      });
    }, 200);
    
    return () => clearTimeout(timeoutId);
  };

  // Compilation handler
  const handleCompile = () => {
    setIsCompiling(true);
    socket?.emit("compile", {
      code: codeStates[tab],
      language: tab,
      version: SUPPORTED_LANGUAGES[tab].version,
      roomId,
    });
  };

  // Logout handler
  const handleLogout = () => {
    socket?.emit("leave", { roomId, userName });
    socket?.disconnect();
    // Redirect to login page or handle logout as needed
    window.location.href = "/login";
  };

  // Preview runner
  const runPreview = useCallback(() => {
    const iframe = document.getElementById("preview-iframe");
    if (iframe && codeStates.html) {
      const html = codeStates.html;
      const css = `<style>${codeStates.css}</style>`;
      const js = `<script>${codeStates.javascript}</script>`;
      iframe.srcdoc = html + css + js;
    }
  }, [codeStates]);

  useEffect(() => {
    if (!isExpanded) {
      runPreview();
    }
  }, [
    codeStates.html,
    codeStates.css,
    codeStates.javascript,
    runPreview,
    isExpanded,
  ]);

  // Save code handler
  const saveCode = async () => {
    // Filter out empty code entries
    const nonEmptyCode = Object.entries(codeStates).reduce(
      (acc, [lang, code]) => {
        // Only save the code if it's different from the default or contains actual content
        if (
          code.trim() !== SUPPORTED_LANGUAGES[lang].defaultCode.trim() &&
          code.trim() !== ""
        ) {
          acc[lang] = code;
        }
        return acc;
      },
      {}
    );

    // Only save if there's at least one non-empty code
    if (Object.keys(nonEmptyCode).length > 0) {
      const savedCodeObj = {
        id: new Date().getTime(),
        timestamp: new Date().toISOString(),
        codes: nonEmptyCode,
      };

      setSavedCodes((prev) => [...prev, savedCodeObj]);
      console.log("Saved Codes:", savedCodeObj);
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_BASE_URL}/editor/${params.roomId}/code-save`, {codes:savedCodeObj.codes}, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${token}`
        }
      });
    }
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isLightMode ? "bg-white" : "bg-gray-900 text-white"
      }`}
    >
      {/* Improved Navbar */}
      <div className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Collaborative Code Editor
        </h1>

        <div className="flex items-center space-x-3">
          {/* Active Users - More compact */}
          <div className="flex flex-col mr-4">
            <div className="flex flex-wrap gap-1.5">
              {userList.map((user, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                >
                  {user}{" "}
                  {typingUsers.has(user) && (
                    <span className="animate-pulse">✍️</span>
                  )}
                </span>
              ))}
            </div>
            {typingUsers.size > 0 && (
              <div className="text-xs text-gray-300 mt-0.5">
                {Array.from(typingUsers).join(", ")}{" "}
                {typingUsers.size === 1 ? "is" : "are"} typing...
              </div>
            )}
          </div>

          {/* Controls - More compact and consistent */}
          <div className="flex items-center space-x-2">
            {showVideoCall ? <NavLink to={"/video"}>
              <button className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
                <Videotape size={16}></Videotape>
              </button>
            </NavLink> : ""}

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              title={isLightMode ? "Dark Mode" : "Light Mode"}
            >
              {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              title={isExpanded ? "Show Preview" : "Hide Preview"}
            >
              {isExpanded ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            <button
              onClick={saveCode}
              className="p-1.5 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors"
              title="Save Code"
            >
              <Save size={16} />
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md bg-red-600 hover:bg-red-500 transition-colors"
              title="Logout"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Improved Language Tabs */}
      <div className="flex flex-wrap gap-1.5 p-2 bg-gray-800">
        {Object.entries(SUPPORTED_LANGUAGES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              tab === key
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Editor and Preview/Compiler Output */}
      <div className="flex flex-grow">
        {/* Code Editor */}
        <div className={isExpanded ? "w-full" : "w-1/2"}>
          <Editor
            height="100%"
            theme={isLightMode ? "vs-light" : "vs-dark"}
            language={tab}
            value={codeStates[tab]}
            onChange={handleCodeChange(tab)}
            onMount={(editor) => handleEditorDidMount(editor, tab)}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              tabSize: 2,
              scrollBeyondLastLine: false,
              padding: { top: 10 },
            }}
          />
        </div>

        {/* Preview/Compiler Panel */}
        {!isExpanded && (
          <div className="w-1/2 bg-gray-800 flex flex-col">
            {["html", "css", "javascript"].includes(tab) ? (
              <iframe
                id="preview-iframe"
                title="Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-2 border-b border-gray-700">
                  <button
                    onClick={handleCompile}
                    disabled={isCompiling}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 ${
                      isCompiling
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-500"
                    } transition-colors`}
                  >
                    <Play size={16} />
                    {isCompiling ? "Compiling..." : "Run Code"}
                  </button>
                </div>
                <div className="flex-grow p-4 font-mono text-sm overflow-auto bg-gray-900">
                  {compilerOutput || "Output will appear here..."}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorComponent;
