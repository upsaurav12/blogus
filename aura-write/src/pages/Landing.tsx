import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, FileText, Wand2, BarChart3, Zap, Check , Layers , Upload , Settings} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Landing = () => {
const features = [
  {
    icon: FileText,
    title: "Rich Text Editor",
    description: "Write and format clean, structured content with an intuitive editor."
  },
  {
    icon: Layers,
    title: "Document Organization",
    description: "Manage drafts, published content, and notes all in one place."
  },
  {
    icon: Upload,
    title: "Export & Sharing",
    description: "Download your documents or share them directly with others."
  },
  {
    icon: Settings,
    title: "Custom Styling",
    description: "Use themes, formatting tools, and layout options to personalize your workspace."
  }
];


  const benefits = [
    "Generate full articles in seconds",
    "Smart grammar and tone improvements",
    "SEO-optimized content suggestions",
    "Beautiful publishing dashboard",
    "Responsive reading experience"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/50 to-muted/20 scroll-smooth">

  {/* Navigation */}
  <nav className="border-b border-white/10 bg-white/10 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary drop-shadow-sm" />
          <span className="text-xl font-bold tracking-tight">Blogus</span>
        </div>

        <div className="flex items-center gap-4">

          <Link to="/editor">
            <Button className="btn-hero rounded-xl shadow-md">
              Start Writing
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/sign-in">
              <Button 
                variant="outline"
                className="h-9 rounded-lg px-4 text-sm backdrop-blur-md bg-white/10 hover:bg-white/20"
              >
                Sign In
              </Button>
            </Link>

            <Link to="/sign-up">
              <Button 
                className="h-9 rounded-lg px-4 text-sm font-medium bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  </nav>

  {/* Hero Section */}
  <section className="relative overflow-hidden bg-gradient-to-b from-background/40 via-muted/20 to-background py-24 md:py-40">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent)]" />
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">

      {/* Hero Left */}
      <div className="space-y-8 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Write smarter with <span className="gradient-text">Rich Editor</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-xl backdrop-blur-md bg-white/5 p-4 rounded-xl shadow-sm border border-white/10">
          A modern writing workspace with rich editor tools.  
          Create professional content in minutes, not hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/editor">
            <Button 
              size="lg" 
              className="btn-hero text-lg h-12 px-8 rounded-xl shadow-lg backdrop-blur-md"
            >
              Start Writing
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative animate-scale-in">
        <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-3xl scale-110"></div>

        <img 
          src={heroImage}
          alt="Workspace"
          className="rounded-3xl shadow-2xl w-full border border-white/10 transform transition-transform duration-700 hover:scale-[1.02]"
        />
      </div>

    </div>
  </section>


  {/* Features */}
  <section className="py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="text-center mb-20 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">Powerful Features</h2>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Everything you need to craft, edit, and publish incredible content.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/10 p-6 space-y-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

    </div>
  </section>


  {/* CTA Section */}
  <section className="py-32 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background/30 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent)]"></div>

    <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
        Ready to Transform Your Writing?
      </h2>

      <p className="text-xl text-muted-foreground">
        Join creators producing top-tier content with speed and clarity.
      </p>

      <Link to="/editor">
        <Button 
          size="lg"
          className="btn-hero text-lg h-14 px-10 rounded-2xl shadow-xl backdrop-blur-xl"
        >
          Start Writing for Free
          <Sparkles className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </div>
  </section>

</div>

  );
};

export default Landing;
