import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package } from "lucide-react";

export default function Catalog() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("*, product_images(image_url, display_order), categories(name_en, name_ar)")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (search) {
      query = query.or(`title_en.ilike.%${search}%,title_ar.ilike.%${search}%`);
    }

    if (selectedCategory && selectedCategory !== "all") {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) query = query.eq("category_id", cat.id);
    }

    const { data } = await query;
    setProducts(data || []);

    if (user) {
      const favRes = await supabase.from("favorites").select("product_id").eq("user_id", user.id);
      setFavorites((favRes.data || []).map((f) => f.product_id));
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => { if (categories.length > 0) fetchProducts(); }, [search, selectedCategory, page, categories, user]);

  const getImage = (p: any) => {
    const imgs = p.product_images;
    if (imgs?.length > 0) return [...imgs].sort((a: any, b: any) => a.display_order - b.display_order)[0].image_url;
    return undefined;
  };

  const getCategoryName = (p: any) => {
    if (!p.categories) return undefined;
    return language === "ar" ? p.categories.name_ar : p.categories.name_en;
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="ps-9"
              placeholder={t("search")}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {language === "ar" ? c.name_ar : c.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-3 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-4 bg-muted rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>{t("noResults")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  titleEn={p.title_en}
                  titleAr={p.title_ar}
                  price={p.price}
                  minOrderQty={p.min_order_qty}
                  stock={p.stock}
                  imageUrl={getImage(p)}
                  categoryName={getCategoryName(p)}
                  isFavorited={favorites.includes(p.id)}
                  onFavoriteToggle={fetchProducts}
                />
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</Button>
              <Button variant="outline" disabled={products.length < pageSize} onClick={() => setPage(page + 1)}>→</Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
