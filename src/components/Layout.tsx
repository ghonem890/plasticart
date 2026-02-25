import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import {
  Package, LogIn, UserPlus, LogOut, ShoppingCart,
  Heart, LayoutDashboard, Menu, X
} from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut, hasRole } = useAuth();
  const { t } = useLanguage();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-14 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight hidden sm:inline">{t("brandName")}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button variant={isActive("/") ? "secondary" : "ghost"} size="sm">{t("home")}</Button>
            </Link>
            <Link to="/catalog">
              <Button variant={isActive("/catalog") ? "secondary" : "ghost"} size="sm">{t("products")}</Button>
            </Link>
            {user && (
              <>
                <Link to="/favorites">
                  <Button variant={isActive("/favorites") ? "secondary" : "ghost"} size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant={isActive("/orders") ? "secondary" : "ghost"} size="sm">{t("myOrders")}</Button>
                </Link>
              </>
            )}
            {user && hasRole("seller") && (
              <Link to="/seller">
                <Button variant={location.pathname.startsWith("/seller") ? "secondary" : "ghost"} size="sm">
                  {t("sellerDashboard")}
                </Button>
              </Link>
            )}
            {user && hasRole("admin") && (
              <Link to="/admin">
                <Button variant={location.pathname.startsWith("/admin") ? "secondary" : "ghost"} size="sm">
                  <LayoutDashboard className="h-4 w-4 me-1" />
                  {t("admin")}
                </Button>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1">
            <LanguageToggle />
            {user && (
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -end-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            {user ? (
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1">
                    <LogIn className="h-4 w-4" />{t("login")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="hidden sm:inline-flex gap-1">
                    <UserPlus className="h-4 w-4" />{t("register")}
                  </Button>
                </Link>
              </>
            )}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-card p-4 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">{t("home")}</Button>
            </Link>
            <Link to="/catalog" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">{t("products")}</Button>
            </Link>
            {user && (
              <>
                <Link to="/favorites" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">{t("favorites")}</Button>
                </Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">{t("myOrders")}</Button>
                </Link>
              </>
            )}
            {user && hasRole("seller") && (
              <Link to="/seller" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">{t("sellerDashboard")}</Button>
              </Link>
            )}
            {user && hasRole("admin") && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">{t("adminDashboard")}</Button>
              </Link>
            )}
            {!user && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">{t("login")}</Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full">{t("register")}</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
