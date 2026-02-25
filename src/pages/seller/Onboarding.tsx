import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, CheckCircle } from "lucide-react";

export default function SellerOnboarding() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: "", businessNameAr: "",
    description: "", descriptionAr: "",
    shippingPreference: "self_managed" as "self_managed" | "platform_provided",
  });
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [idPhotoFile, setIdPhotoFile] = useState<File | null>(null);

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from("seller-documents").upload(path, file);
    if (error) throw error;
    return data.path;
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let contractUrl = "";
      let idPhotoUrl = "";

      if (contractFile) {
        contractUrl = await uploadFile(contractFile, `${user.id}/contract-${Date.now()}.pdf`);
      }
      if (idPhotoFile) {
        idPhotoUrl = await uploadFile(idPhotoFile, `${user.id}/id-photo-${Date.now()}`);
      }

      const { error } = await supabase.from("seller_profiles").insert({
        user_id: user.id,
        business_name: form.businessName,
        business_name_ar: form.businessNameAr || null,
        description: form.description || null,
        description_ar: form.descriptionAr || null,
        contract_document_url: contractUrl || null,
        id_photo_url: idPhotoUrl || null,
        shipping_preference: form.shippingPreference,
        verification_status: "pending",
      });

      if (error) throw error;
      toast({ title: t("verificationPending") });
      navigate("/seller");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-lg">
        <h1 className="text-2xl font-bold mb-6">{t("sellerOnboarding")}</h1>
        
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("step")} 1</CardTitle>
              <CardDescription>{t("businessName")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("businessName")} *</Label>
                <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>{t("businessNameAr")}</Label>
                <Input value={form.businessNameAr} onChange={(e) => setForm({ ...form, businessNameAr: e.target.value })} dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>{t("businessDescription")}</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t("businessDescriptionAr")}</Label>
                <Textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>{t("shippingPreference")}</Label>
                <div className="flex gap-2">
                  <Button type="button" variant={form.shippingPreference === "self_managed" ? "default" : "outline"} className="flex-1" onClick={() => setForm({ ...form, shippingPreference: "self_managed" })}>
                    {t("selfManaged")}
                  </Button>
                  <Button type="button" variant={form.shippingPreference === "platform_provided" ? "default" : "outline"} className="flex-1" onClick={() => setForm({ ...form, shippingPreference: "platform_provided" })}>
                    {t("platformProvided")}
                  </Button>
                </div>
              </div>
              <Button className="w-full" onClick={() => setStep(2)} disabled={!form.businessName}>{t("next")}</Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("step")} 2</CardTitle>
              <CardDescription>{t("uploadContract")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <input type="file" accept=".pdf" onChange={(e) => setContractFile(e.target.files?.[0] || null)} className="text-sm" />
                {contractFile && <p className="text-sm text-muted-foreground mt-2">{contractFile.name}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>{t("previous")}</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>{t("next")}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("step")} 3</CardTitle>
              <CardDescription>{t("uploadIdPhoto")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <input type="file" accept="image/*" onChange={(e) => setIdPhotoFile(e.target.files?.[0] || null)} className="text-sm" />
                {idPhotoFile && <p className="text-sm text-muted-foreground mt-2">{idPhotoFile.name}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>{t("previous")}</Button>
                <Button className="flex-1" onClick={handleComplete} disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin me-2" />}
                  {t("complete")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
