const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">RetailVision AI</h1>

      <p className="text-lg text-muted-foreground mb-8">
        AI-powered retail analytics and customer behavior insights
      </p>

      <a
        href="/dashboard"
        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Enter Dashboard
      </a>
    </div>
  );
};

export default LandingPage;
