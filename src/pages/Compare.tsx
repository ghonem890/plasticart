import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCompare } from "@/contexts/CompareContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompareArrows, X } from "lucide-react";

export default function Compare() {
  const { t, language } = useLanguage();
  const { items, removeItem, clearAll } = useCompare();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (items.length === 0) { setProducts([]); return; }
    const ids = items.map((i) => i.productId);
    supabase.from("products")
      .select("*, product_images(image_url, display_order), categories(name_en, name_ar), seller_profiles:seller_id(business_name)")
      .in("id", ids)
      .then(({ data }) => setProducts(data || []));
  }, [items]);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center text-muted-foreground">
          <GitCompareArrows className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>{t("noProductsToCompare")}</p>
          <p className="text-sm mt-2">{t("selectProductsToCompare")}</p>
        </div>
      </Layout>
    );
  }

  const getImage = (p: any) => {
    const imgs = p.product_images;
    if (imgs?.length > 0) return [...imgs].sort((a: any, b: any) => a.display_order - b.display_order)[0].image_url;
    return undefined;
  };

  const allSpecs = new Set<string>();
  products.forEach((p) => { if (p.specs) Object.keys(p.specs).forEach((k) => allSpecs.add(k)); });

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("compareProducts")}</h1>
          <Button variant="outline" size="sm" onClick={clearAll}>{t("clearCart")}</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-start p-3 text-sm text-muted-foreground w-32"></th>
                {products.map((p) => (
                  <th key={p.id} className="p-3 text-start">
                    <div className="space-y-2">
                      <div className="aspect-square w-32 rounded-lg bg-muted overflow-hidden">
                        {getImage(p) ? <img src={getImage(p)} alt="" className="w-full h-full object-cover" /> : null}
                      </div>
                      <p className="font-medium text-sm">{language === "ar" && p.title_ar ? p.title_ar : p.title_en}</p>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(p.id)}>
                        <X className="h-3 w-3 me-1" />{t("removeFromCompare")}
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 text-sm text-muted-foreground">{t("price")}</td>
                {products.map((p) => <td key={p.id} className="p-3 font-semibold text-primary">{p.price.toLocaleString()} {t("currencySymbol")}</td>)}
              </tr>
              <tr className="border-t">
                <td className="p-3 text-sm text-muted-foreground">{t("minOrder")}</td>
                {products.map((p) => <td key={p.id} className="p-3">{p.min_order_qty} {t("pieces")}</td>)}
              </tr>
              <tr className="border-t">
                <td className="p-3 text-sm text-muted-foreground">{t("stock")}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <Badge variant={p.stock > 0 ? "default" : "destructive"}>{p.stock > 0 ? t("inStock") : t("outOfStock")}</Badge>
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-3 text-sm text-muted-foreground">{t("categories")}</td>
                {products.map((p) => <td key={p.id} className="p-3">{p.categories ? (language === "ar" ? p.categories.name_ar : p.categories.name_en) : "-"}</td>)}
              </tr>
              {Array.from(allSpecs).map((spec) => (
                <tr key={spec} className="border-t">
                  <td className="p-3 text-sm text-muted-foreground">{spec}</td>
                  {products.map((p) => <td key={p.id} className="p-3 text-sm">{p.specs?.[spec] || "-"}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
