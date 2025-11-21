import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import { 
  Zap, 
  Save, 
  Sparkles, 
  Moon, 
  Sun,
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Quote,
  Image as ImageIcon,
  Link2,
  Eye,
  Edit3
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Editor = () => {
  const [title, setTitle] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const { toast } = useToast();
  const {getToken} = useAuth()
  const backend_url_for_post = import.meta.env.VITE_BACKEND_URL_FOR_POST

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose-editor max-w-none focus:outline-none min-h-[500px] px-12 py-8",
      },
    },
    onUpdate: ({ editor }) => {
      // Autosave trigger
      debouncedSave(editor.getHTML(), editor.getJSON());
    },
  });

  // // Load from localStorage on mount
  // useEffect(() => {
  //   const savedTitle = localStorage.getItem("draft-article-title");
  //   const savedContent = localStorage.getItem("draft-article");
    
  //   if (savedTitle) setTitle(savedTitle);
  //   if (savedContent && editor) {
  //     editor.commands.setContent(savedContent);
  //   }
  // }, [editor]);

  // Autosave function
  const saveToLocalStorage = useCallback((html: string, json: any) => {
    localStorage.setItem("draft-article", html);
    localStorage.setItem("draft-article-json", JSON.stringify(json));
    localStorage.setItem("draft-article-title", title);
  }, [title]);

  // Debounced autosave (every 3 seconds)
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (html: string, json: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          saveToLocalStorage(html, json);
          toast({
            title: "Draft saved",
            description: "Your work has been saved automatically",
          });
        }, 3000);
      };
    })(),
    [saveToLocalStorage, toast]
  );

  // Save title changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("draft-article-title", title);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [title]);

 const handlePublish = async () => {
  if (!title.trim()) return;
  if (!editor) return;

  try {
    const token = await getToken(); // <-- FIX

    const response = await fetch(`${backend_url_for_post}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: title,
        content: editor.getHTML(),
      }),
    });

    if (!response.ok) throw new Error("Failed");

    toast({
      title: "Published!",
      description: "Your article is live."
    });

  } catch (err) {
    console.error(err);
  }
};



  const handleAIGenerate = async (action: string) => {
    if (!editor) return;
    
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          content: editor.getHTML(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (action === "title") {
          setTitle(data.result);
        } else {
          editor.commands.insertContent(data.result);
        }
        
        toast({
          title: "AI generated",
          description: `Successfully generated ${action}`,
        });
      }
    } catch (error) {
      toast({
        title: "AI generation failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          editor?.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setShowLinkDialog(true);
  };

  const saveLink = () => {
    if (linkUrl) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
    setShowLinkDialog(false);
    setLinkUrl("");
  };

  if (!editor) {
    return <div className="flex items-center justify-center min-h-screen">Loading editor...</div>;
  }

  const aiTools = [
    { label: "Generate Title", action: "title", icon: Sparkles },
    { label: "Generate Outline", action: "outline", icon: Sparkles },
    { label: "Summarize", action: "summarize", icon: Sparkles },
    { label: "Expand Content", action: "expand", icon: Sparkles },
    { label: "Improve Writing", action: "improve", icon: Sparkles },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
  <div className="bg-gradient-to-b from-background via-background/60 to-background/40 min-h-screen transition-colors">

    {/* ✨ GLASS NAVBAR */}
    <div className="border-b border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">

            {/* Back */}
            <RouterLink to="/dashboard">
              <Button variant="ghost" size="sm" className="h-9 rounded-lg hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </RouterLink>

            {/* Dashboard */}
            <RouterLink to="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg backdrop-blur-md bg-white/5 hover:bg-white/10"
              >
                Dashboard
              </Button>
            </RouterLink>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* Preview Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-lg hover:bg-white/10"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </>
              )}
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-lg hover:bg-white/10"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Save */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-lg hover:bg-white/10"
              onClick={() => {
                saveToLocalStorage(editor.getHTML(), editor.getJSON());
                toast({
                  title: "Saved",
                  description: "Draft saved successfully",
                });
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            {/* Publish */}
            <Button
              size="sm"
              className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              onClick={() => handlePublish()}
            >
              Publish
            </Button>

          </div>
        </div>
      </div>
    </div>

    {/* MAIN CONTENT */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-[1fr_320px] gap-10">

        {/* ===================== EDITOR AREA ===================== */}
        <div className="space-y-8">

          {/* TOOLBAR */}
          {!isPreview && (
            <Card className="p-3 border-white/10 bg-white/10 backdrop-blur-xl rounded-xl shadow-md">
              <div className="flex flex-wrap gap-1">

                <Button
                  variant={editor.isActive("bold") ? "secondary" : "ghost"}
                  size="sm"
                  className="tool-btn"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("italic") ? "secondary" : "ghost"}
                  size="sm"
                  className="tool-btn"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                  size="sm"
                  className="tool-btn"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                  size="sm"
                  className="tool-btn"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                  size="sm"
                  className="tool-btn"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                  <List className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                  size="sm"
                  className="tool-btn"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                  size="sm"
                  className="tool-btn"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                  <Quote className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
                  size="sm"
                  className="tool-btn"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                  <Code className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="tool-btn"
                  onClick={addImage}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("link") ? "secondary" : "ghost"}
                  size="sm"
                  className="tool-btn"
                  onClick={setLink}
                >
                  <Link2 className="h-4 w-4" />
                </Button>

              </div>
            </Card>
          )}

          {/* TITLE INPUT */}
          {!isPreview && (
            <div className="px-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-5xl md:text-3xl font-display font-bold border-none shadow-none px-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/40"
                placeholder="Your amazing title..."
              />
            </div>
          )}

          {/* EDITOR BODY */}
          <Card className="min-h-[650px] bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/10 rounded-xl shadow-lg">
            {isPreview ? (
              <div className="px-10 py-8">
                <h1 className="font-display text-5xl font-bold mb-8">{title || "Untitled"}</h1>
                <div
                  className="prose prose-lg prose-invert max-w-none opacity-95"
                  dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
              </div>
            ) : (
              <EditorContent editor={editor} className="prose-editor editor-container p-5" />
            )}
          </Card>
        </div>

        {/* ===================== SIDEBAR ===================== */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">

          {/* STATS CARD */}
          <Card className="p-5 space-y-4 border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-xl shadow-lg">
            <h3 className="font-semibold text-sm opacity-90">Document Stats</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Words</span>
                <span className="font-medium">
                  {editor.state.doc.textContent.split(/\s+/).filter(Boolean).length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Characters</span>
                <span className="font-medium">
                  {editor.state.doc.textContent.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Reading time</span>
                <span className="font-medium">
                  {Math.ceil(
                    editor.state.doc.textContent.split(/\s+/).filter(Boolean).length / 200
                  )}{" "}
                  min
                </span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  </div>

  {/* Link Dialog */}
  <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogDescription>Add a URL to link from your text.</DialogDescription>
      </DialogHeader>

      <Input
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="https://example.com"
        onKeyDown={(e) => e.key === "Enter" && saveLink()}
      />

      <DialogFooter>
        <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
          Cancel
        </Button>
        <Button onClick={saveLink}>Insert</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>

  );
};

export default Editor;
