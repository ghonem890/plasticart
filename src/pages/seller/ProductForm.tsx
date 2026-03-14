import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, X } from "lucide-react";

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [form, setForm] = useState({
    titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "",
    price: "", minOrderQty: "1", stock: "0", categoryId: "", tags: "",
    isRecyclable: false,
  });

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => setCategories(data || []));
    
    if (isEdit) {
      supabase.from("products").select("*").eq("id", id).single().then(({ data }) => {
        if (data) {
          setForm({
            titleEn: data.title_en, titleAr: data.title_ar || "",
            descriptionEn: data.description_en || "", descriptionAr: data.description_ar || "",
            price: String(data.price), minOrderQty: String(data.min_order_qty),
            stock: String(data.stock), categoryId: data.category_id || "",
            tags: (data.tags || []).join(", "),
          });
        }
      });
      supabase.from("product_images").select("*").eq("product_id", id).order("display_order").then(({ data }) => setExistingImages(data || []));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const productData = {
        seller_id: user.id,
        title_en: form.titleEn,
        title_ar: form.titleAr || null,
        description_en: form.descriptionEn || null,
        description_ar: form.descriptionAr || null,
        price: parseFloat(form.price),
        min_order_qty: parseInt(form.minOrderQty),
        stock: parseInt(form.stock),
        category_id: form.categoryId || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };

      let productId = id;

      if (isEdit) {
        const { error } = await supabase.from("products").update(productData).eq("id", id!);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(productData).select().single();
        if (error) throw error;
        productId = data.id;
      }

      // Upload new images
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const path = `${user.id}/${productId}/${Date.now()}-${i}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file);
        if (uploadError) continue;
        
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        await supabase.from("product_images").insert({
          product_id: productId!,
          image_url: urlData.publicUrl,
          display_order: existingImages.length + i,
        });
      }

      toast({ title: isEdit ? t("productUpdated") : t("productCreated") });
      navigate("/seller");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const removeExistingImage = async (imageId: string) => {
    await supabase.from("product_images").delete().eq("id", imageId);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? t("editProduct") : t("addProduct")}</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>{t("productTitle")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("productTitle")} (English) *</Label>
                  <Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>{t("productTitleAr")}</Label>
                  <Input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} dir="rtl" />
                </div>
                <div className="space-y-2">
                  <Label>{t("productDescription")}</Label>
                  <Textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("productDescriptionAr")}</Label>
                  <Textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} dir="rtl" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t("price")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>{t("productPrice")} *</Label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("productMinOrder")}</Label>
                    <Input type="number" value={form.minOrderQty} onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("productStock")}</Label>
                    <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("selectCategory")}</Label>
                  <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                    <SelectTrigger><SelectValue placeholder={t("selectCategory")} /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{language === "ar" ? c.name_ar : c.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("productTags")}</Label>
                  <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tag1, tag2, tag3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t("productImages")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {existingImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(img.id)} className="absolute top-0.5 end-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="text-sm" />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => navigate("/seller")} className="flex-1">{t("cancel")}</Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="h-4 w-4 animate-spin me-2" />}
                {t("save")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
