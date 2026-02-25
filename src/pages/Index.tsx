import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, LogIn, UserPlus, LogOut } from "lucide-react";

const Index = () => {
  const { user, signOut, hasRole } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">{t("brandName")}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            {user ? (
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    {t("login")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container py-20 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Package className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("brandName")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("brandTagline")}
          </p>
          {user && (
            <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              <p>
                {user.email} — {hasRole("seller") ? t("seller") : hasRole("admin") ? "Admin" : t("buyer")}
              </p>
            </div>
          )}
          {!user && (
            <div className="flex justify-center gap-3">
              <Link to="/register">
                <Button size="lg">{t("register")}</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">{t("login")}</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
