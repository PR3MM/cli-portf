import React, { useState, useRef, useEffect, useMemo } from "react";

const COMMANDS = ["ls", "cd", "cat", "pwd", "clear", "help"];

const filesystem = {
  root: {
    type: "dir",
    children: {
      "about.txt": {
        type: "file",
        content:
          "Software engineer solving real-world problems with modern tech and clean code.\nLifelong learner with expertise in scalable systems, UI/UX, and AI-powered applications."
      },


      "skills.txt": {
        type: "file",
        content:
          "Frontend:\n- React, Next.js, TypeScript, Tailwind CSS\n\nBackend:\n- Node.js, Express, MongoDB, PostgreSQL, REST APIs\n\nAI/ML:\n- Python, NumPy, Pandas, Scikit-learn\n- OpenAI API, Gemini API, LangChain\n\nDevTools:\n- Git, GitHub Actions, Docker, PM2, Prometheus, Grafana\n\nInfra & Cloud:\n- AWS (EC2, S3)\n- Render, Vercel, Netlify\n- Firebase Auth & Hosting"
      },
      "contact.txt": {
        type: "file",
        content:
          "Email: premveddhote@gmail.com\nLinkedIn: linkedin.com/in/premveddhote\nGitHub: github.com/PR3MM\nLocation: Pune, India"
      },
      experience: {
        type: "dir",
        children: {
          "attestr.txt": {
            type: "file",
            content:
              "Software Developer Intern – Attestr (Apr 2025 – Jun 2025)\n\n- Built centralized logging using PM2 and Pino Logger\n- Integrated AWS CloudWatch for real-time log streaming\n- Designed API latency tracking middleware (P95/P99)\n- Built real-time React dashboard for system monitoring"
          }
        }
      },

      projects: {
        type: "dir",
        children: {
          "applybuddy.txt": {
            type: "file",
            content:
              "ApplyBuddy – Smart Form Autofiller\n\nChrome extension using AI-powered field detection.\n95%+ autofill accuracy, reduced form time by 80%.\n\nTech:\n- JavaScript\n- Chrome Extensions API (Manifest V3)\n- React, Tailwind CSS\n- Node.js, MongoDB, Redis\n- Gemini AI, n8n"
          },


          "mediscanai.txt": {
            type: "file",
            content:
              "MediScanAI – AI-powered prescription analysis platform.\n\nFeatures OCR-based prescription scanning, medication identification,\nand cost-effective alternatives.\n\nTech:\n- React, Tailwind CSS\n- Node.js, Express\n- MongoDB\n- Tesseract.js\n- Clerk Auth\n- Gemini AI"
          },

          "youtube_summarizer.txt": {
            type: "file",
            content:
              "YouTube Video Summarizer\n\nFull-stack app that summarizes YouTube videos using transcripts.\nReduced content consumption time by 75%.\n\nTech:\n- React, TypeScript\n- Node.js, Express\n- Tailwind CSS\n- Gemini AI"
          },

          "travelcrow.txt": {
            type: "file",
            content:
              "TravelCrow – AI-powered travel platform.\n\nGenerates personalized itineraries and travel content.\nBoosted user engagement by 40%.\n\nTech:\n- React\n- Tailwind CSS\n- Firebase\n- Gemini API\n- Vercel, Render"
          },

          "jsx_playground.txt": {
            type: "file",
            content:
              "JSXPlayground\n\nWeb-based React playground with real-time preview and AI code generation.\n\nTech:\n- React\n- Vite\n- Tailwind CSS\n- Sandpack\n- Gemini API"
          },

          "internnet.txt": {
            type: "file",
            content:
              "InterNet – Accessible Job Portal\n\nInclusive internship platform with accessibility-first design.\n\nTech:\n- HTML5\n- CSS3\n- JavaScript\n- Web Speech API"
          },

          "delivery_navigator.txt": {
            type: "file",
            content:
              "Delivery Navigator\n\nRoute optimization app using Hungarian Algorithm with real-time maps.\n\nTech:\n- React\n- Leaflet.js\n- GraphHopper API\n- Tailwind CSS"
          },

          "tiptap_editor.txt": {
            type: "file",
            content:
              "TipTap Rich Text Editor\n\nFeature-rich editor with emoji picker and webpage embedding.\n\nTech:\n- React\n- TipTap\n- Vite\n- Tailwind CSS"
          },

          "address_management.txt": {
            type: "file",
            content:
              "Address Management System\n\nAddress manager with Google Maps integration and real-time geocoding.\n\nTech:\n- React\n- Google Maps API\n- Tailwind CSS\n- Context API"
          }
        }
      },

      blogs: {
        type: "dir",
        children: {
          "pm2_pino_logging.txt": {
            type: "file",
            content:
              "Setting Up PM2 and Pino Logging: A Step-by-Step Guide\n\nA comprehensive guide to managing Node.js apps with PM2 and implementing structured logging using Pino."
          }
        }
      },


    }
  }
};


export default function CLI() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [currentDir, setCurrentDir] = useState(["root"]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputBackup, setInputBackup] = useState("");

  // UI state: suggestion dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);

  const username = `dev@premveddhote:${"/" + currentDir.slice(1).join("/") || "~"}$`;
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const suggestions = useMemo(() => {
    const t = input;
    if (!t) return [];
    const parts = t.split(" ");
    const current = parts[parts.length - 1];
    if (parts.length === 1) {
      return COMMANDS.filter(cmd => cmd.startsWith(current));
    } else {
      const node = getNodeFromPath(currentDir);
      if (node && node.type === 'dir') {
        return Object.keys(node.children).filter(name => name.startsWith(current));
      }
      return [];
    }
  }, [input, currentDir]);

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && input.trim().length > 0);
  }, [suggestions, input]);

  const applySuggestion = (s) => {
    const parts = input.split(" ");
    parts[parts.length - 1] = s;
    setInput(parts.join(" "));
    setShowSuggestions(false);
  };
  // HELPER FUNCTIONS
  function getNodeFromPath(path) {
    let node = filesystem;

    for (let segment of path) {

      if (node.type === "dir") {
        node = node.children;
      }

      node = node[segment];
      if (!node) return null;
    }

    return node;
  }



  const pushHistory = (command, output) => {
    const prompt = `dev@premveddhote:${"/" + currentDir.slice(1).join("/") || "~"}$`;

    setHistory(prev => [
      ...prev,
      { prompt, command, output }
    ]);
  };



  // COMMANDS
  const runLs = () => {
    const node = getNodeFromPath(currentDir);
    console.log(node)

    if (!node || node.type !== "dir") {
      return ["Not a directory"];
    }

    return Object.keys(node.children);
  };

  const runCd = (arg) => {
    if (!arg) return [];

    // cd ..
    if (arg === "..") {
      if (currentDir.length > 1) {
        setCurrentDir(prev => prev.slice(0, -1));
      }
      return [];
    }

    // cd <folder>
    const nextPath = [...currentDir, arg];
    const node = getNodeFromPath(nextPath);

    if (!node || node.type !== "dir") {
      return [`cd: no such directory: ${arg}`];
    }

    setCurrentDir(nextPath);
    return [];
  };
  const runCat = (arg) => {
    if (!arg) return ["Usage: cat <filename>"];

    const node = getNodeFromPath([...currentDir, arg]);

    if (!node) {
      return [`cat: no such file: ${arg}`];
    }

    if (node.type !== "file") {
      return [`cat: ${arg}: Is a directory`];
    }

    return [node.content];
  };

  const runPwd = () => {
    if (currentDir.length === 1) return ["/"];
    return ["/" + currentDir.slice(1).join("/")];
  };



  const runCommand = (command) => {
    const [cmd, arg] = command.trim().split(" ");
    let result = [];

    switch (cmd) {
      case "ls":
        result = runLs();
        break;
      case "cd":
        result = runCd(arg);
        break;
      case "cat":
        result = runCat(arg);
        break;
      case "clear":
        setHistory([]);
        return;
      case "pwd":
        result = runPwd();
        break;
      case "help":
        result = [
          "Available commands:",
          "ls - list files and directories",
          "cd <directory> - change directory",
          "cat <file> - display file contents",
          "clear - clear the terminal",
          "help - show this help message"
        ];
        break;
      default:
        result = [`command not found: ${cmd}`];
    }

    pushHistory(command, result);
  };

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    runCommand(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex === -1) {
        setInputBackup(input);
      }
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0 && newIndex < history.length) {
        setInput(history[history.length - 1 - newIndex].command);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      if (newIndex === -1) {
        setInput(inputBackup);
      } else if (newIndex >= 0 && newIndex < history.length) {
        setInput(history[history.length - 1 - newIndex].command);
      }
    }


    if (e.key === "Tab") {
      e.preventDefault();

      const parts = input.split(" ");
      const current = parts[parts.length - 1];

      let suggestions = [];

      // autocomplete command
      if (parts.length === 1) {
        suggestions = COMMANDS.filter(cmd =>
          cmd.startsWith(current)
        );
      }
      // autocomplete files/folders
      else {
        const node = getNodeFromPath(currentDir);
        if (node && node.type === "dir") {
          suggestions = Object.keys(node.children)
            .filter(name => name.startsWith(current));
        }
      }

      if (suggestions.length === 1) {
        parts[parts.length - 1] = suggestions[0];
        setInput(parts.join(" "));
      }
    }

  };


  return (
    <>
      <div className="bg-slate-950 min-h-screen py-12 px-4 flex items-start justify-center font-mono text-sm overflow-hidden relative">
        {/* Animated background elements - neon glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-lime-400/15 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl opacity-40 animate-pulse" />
        </div>

        <div className="max-w-3xl w-full relative z-10">
          <div className="bg-slate-950/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border-2 border-lime-400/60 hover:border-purple-400/60 transition-all duration-300 shadow-lime-400/10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-lime-400/30 bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/80" />
                <span className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/80" />
                <h3 className="ml-3 text-lime-400 font-bold text-lg tracking-tight drop-shadow-lg">CLI Portfolio</h3>
              </div>
              <div className="text-purple-300 text-xs font-medium tracking-wider drop-shadow-lg underline "><a href="https://premveddhote.me/"> premveddhote </a> </div>
            </div>

            {/* Banner */}
            <div className="p-6 overflow-x-auto bg-slate-950 border-b-2 border-lime-400/30">
              <pre
                style={{
                  fontSize: '13px',
                  lineHeight: '1.2',
                }}
                className="text-lime-400 drop-shadow-lg font-bold"
              >
                {String.raw`
██████╗ ██████╗ ███████╗███╗   ███╗██╗   ██╗███████╗██████╗
██╔══██╗██╔══██╗██╔════╝████╗ ████║██║   ██║██╔════╝██╔══██╗
██████╔╝██████╔╝█████╗  ██╔████╔██║██║   ██║█████╗  ██║  ██║
██╔═══╝ ██╔══██╗██╔══╝  ██║╚██╔╝██║╚██╗ ██╔╝██╔══╝  ██║  ██║
██║     ██║  ██║███████╗██║ ╚═╝ ██║ ╚████╔╝ ███████╗██████╔╝
╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═══╝  ╚══════╝╚═════╝
`}
              </pre>
            </div>

            {/* Welcome section */}
            <div className="pt-3 pr-6 pl-6 pb-3 border-b-2 border-lime-400/20 bg-slate-950/50">
              <p className="text-lime-300 font-semibold mb-2 drop-shadow-lg">Welcome to my CLI Portfolio! 👋</p>
              <p className="text-gray-200 text-xs leading-relaxed">Type <span className="text-lime-400 font-bold bg-slate-950/80 px-2 py-1 rounded border border-lime-400/50">help</span> to see available commands or explore the filesystem.</p>
            </div>

            {/* Terminal output - integrated with input */}
            <div className="p-6 min-h-96 max-h-96 overflow-y-auto bg-slate-950 space-y-4 text-sm border-b-2 border-purple-400/30 scrollbar-thin scrollbar-thumb-lime-400 scrollbar-track-slate-950 relative" role="log" aria-live="polite">
              {history.length === 0}
              {history.map((entry, index) => (
                <div key={index} className="space-y-2 animate-fade-in">
                  <div className="flex items-baseline gap-3">
                    <span className="text-purple-400 font-bold select-none whitespace-nowrap drop-shadow-lg">{entry.prompt}</span>
                    <span className="text-gray-100 break-all drop-shadow-sm">{entry.command}</span>
                  </div>
                  <div className="ml-4 pl-3 border-l-2 border-lime-400/40">
                    {entry.output.map((line, i) => (
                      <div key={i} className={`text-gray-200 text-xs leading-relaxed ${i > 0 ? 'mt-1' : ''}`}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Current input in terminal */}
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-purple-400 font-bold select-none whitespace-nowrap drop-shadow-lg text-sm">{username}</span>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    autoFocus
                    className="bg-transparent outline-none flex-1 text-gray-100 caret-lime-400 placeholder-gray-600 text-sm"
                    placeholder="Type command here..."
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Terminal input"
                  />
                </div>

                {showSuggestions && (
                  <ul className="ml-4 bg-slate-900/80 border border-lime-400/50 rounded text-xs divide-y divide-lime-400/20 max-h-32 overflow-auto">
                    {suggestions.map((s) => (
                      <li
                        key={s}
                        onMouseDown={(e) => { e.preventDefault(); applySuggestion(s); }}
                        className="px-3 py-1.5 hover:bg-lime-400/30 hover:text-lime-300 cursor-pointer transition-colors duration-150 text-gray-200"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </form>
              <div ref={bottomRef} />
            </div>

          </div>

          {/* Footer hint */}
          <div className="mt-6 text-center text-purple-400 text-xs drop-shadow-lg">
            <p>💡 Use arrow keys to navigate history • Tab for autocompletion</p>
          </div>
        </div>
      </div>
    </>
  );
}
