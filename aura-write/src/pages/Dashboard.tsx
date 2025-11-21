import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";

import { 
  Zap, 
  Plus, 
  FileText, 
  Clock, 
  MoreVertical,
  Edit,
  Eye,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type Article = {
  id: string;
  name: string;
  content: string;
  status: string;
  words: number;
}

const Dashboard = () => {

  const [articless , setArticle] = useState<Article[]>([])
  const { getToken } = useAuth();
  const backend_url_for_posts = import.meta.env.VITE_BACKEND_URL_FOR_GET


  const countWords = (content: string) => {

  }

  useEffect(() => {
  // 1. Load cached posts from localStorage (if exist)
  const cachedPosts = localStorage.getItem("posts");
  if (cachedPosts) {
    setArticle(JSON.parse(cachedPosts));
  }

  // 2. Fetch latest posts from backend
  const fetchArticles = async () => {
    try {
      const token = await getToken();
      console.log("from user's token ", token);

      const res = await fetch(`${backend_url_for_posts}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("response is not correct");
      }

      const posts = await res.json();
      
      console.log("post", posts);

      // Update UI
      setArticle(posts);

      // Save to localStorage
      localStorage.setItem("posts", JSON.stringify(posts));

    } catch (error) {
      console.log("error while fetching: ", error);
    }
  };

  fetchArticles();
}, []);



  const articles = [
    {
      id: 1,
      title: "Getting Started with AI Writing",
      excerpt: "Learn how to leverage AI to create amazing content faster than ever before...",
      status: "published",
      lastEdited: "2 hours ago",
      words: 1250
    },
    {
      id: 2,
      title: "10 Tips for Better Blog Posts",
      excerpt: "Discover the secrets to writing engaging blog posts that your audience will love...",
      status: "draft",
      lastEdited: "1 day ago",
      words: 890
    },
    {
      id: 3,
      title: "SEO Best Practices 2024",
      excerpt: "Master the latest SEO techniques to boost your content visibility...",
      status: "published",
      lastEdited: "3 days ago",
      words: 2100
    },
    {
      id: 4,
      title: "Content Marketing Strategy",
      excerpt: "Build a comprehensive content marketing strategy that drives results...",
      status: "draft",
      lastEdited: "1 week ago",
      words: 1560
    }
  ];


  const handleDelete = async (id : string ) => {
    try {
      const response = await fetch(`${backend_url_for_posts}/${Number(id)}`, {
      method: "DELETE",});

      if (!response.ok) {
        throw new Error("not able to delete the post")
      }

      const res = response.json()
      setArticle(prev => prev.filter(article => article.id !== id));

      console.log("res: ", res)
    } catch (error) {
      console.error("error: ", error)
    }
  }

    // Derived dynamic stats
const totalArticles = articless.length;

const publishedCount = articless.filter(a => a.status === "published").length;

const draftCount = articless.filter(a => a.status === "draft").length;

// Example: Articles created this month (assuming you add createdAt in backend)
const currentMonth = new Date().getMonth();


const stats = [
  { label: "Total Articles", value: totalArticles, icon: FileText },
  { label: "Published", value: publishedCount, icon: Eye },
  { label: "Drafts", value: draftCount, icon: Edit },
  // { label: "This Month", value: articlesThisMonth, icon: Clock }
];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-muted/40">

  {/* NAVIGATION */}
  <nav className="border-b border-border bg-background/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Zap className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
          <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
            Blogus
          </span>
        </Link>

        {/* Auth Logic */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="hover:bg-muted/60">
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-primary hover:bg-primary/90 shadow-md">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link to="/">
              <Button variant="ghost" className="hover:bg-muted/60">Home</Button>
            </Link>

            <Link to="/settings">
              <Button variant="ghost" className="hover:bg-muted/60">Settings</Button>
            </Link>

            <Link to="/editor">
              <Button className="bg-primary text-primary-foreground shadow hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </Link>

            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

      </div>
    </div>
  </nav>

  {/* MAIN */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    {/* HEADER */}
    <header className="mb-12">
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        Dashboard
      </h1>
      <p className="text-muted-foreground text-lg">
        Manage your articles, track progress, and create new content effortlessly.
      </p>
    </header>

    {/* ARTICLES */}
    {articless.length > 0  ? (
      <section className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Your Articles</h2>
      </div>

      <div className="grid gap-6">
        {articless.map((article, index) => (
          <Card
            key={article.id}
            className="p-6 hover:shadow-lg bg-card/80 backdrop-blur-sm transition-all duration-300 rounded-xl border-border/60 animate-fade-in"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="flex items-start justify-between gap-4">

              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">

                  <div className="p-2 rounded-md bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        <Link to={`/post/${article.id}`} className="flex items-center cursor-pointer">
                        {article.name}
                        </Link>
                      </h3>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.status === "published"
                            ? "bg-green-200/70 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-yellow-200/70 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                        }`}
                      >
                        {article.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {/* {article.lastEdited} */}
                      </div>

                      <div>{article.words} words</div>
                    </div>
                  </div>

                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/editor" className="flex items-center cursor-pointer">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to={`/post/${article.id}`} className="flex items-center cursor-pointer">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="text-destructive hover:bg-destructive/20" onClick={() => handleDelete(article.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </Card>
        ))}
      </div>

    </section>
    ): (
    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <FileText className="h-12 w-12 opacity-50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Articles Yet</h3>
        <p className="max-w-sm mx-auto mb-6">
          You haven't created any articles. Start writing your first AI-powered blog post!
        </p>

        <Link to="/editor">
          <Button className="px-6 py-2">Create Your First Article</Button>
        </Link>
      </div>
    )}
  </div>
</div>

  );
};

export default Dashboard;
