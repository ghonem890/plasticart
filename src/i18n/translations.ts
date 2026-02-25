export const translations = {
  en: {
    // Nav
    home: "Home",
    login: "Login",
    register: "Register",
    logout: "Logout",
    dashboard: "Dashboard",
    
    // Auth
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    phone: "Phone Number",
    displayName: "Full Name",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    newPassword: "New Password",
    sendResetLink: "Send Reset Link",
    updatePassword: "Update Password",
    
    // Roles
    buyer: "Buyer",
    seller: "Seller",
    registerAs: "Register as",
    
    // Auth messages
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to your account",
    registerTitle: "Create Account",
    registerSubtitle: "Join Plasticart marketplace",
    resetTitle: "Reset Password",
    resetSubtitle: "Enter your email to receive a reset link",
    newPasswordTitle: "Set New Password",
    newPasswordSubtitle: "Enter your new password below",
    
    // Actions
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    search: "Search",
    filter: "Filter",
    
    // Auth feedback
    checkEmail: "Check your email for verification link",
    resetEmailSent: "Password reset email sent",
    passwordUpdated: "Password updated successfully",
    loginSuccess: "Logged in successfully",
    registerSuccess: "Account created! Please verify your email.",
    
    // Errors
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 6 characters",
    passwordsMustMatch: "Passwords must match",
    phoneRequired: "Phone number is required",
    nameRequired: "Full name is required",
    invalidCredentials: "Invalid email or password",
    
    // Common
    loading: "Loading...",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    language: "Language",
    currency: "EGP",
    currencySymbol: "ج.م",
    
    // Brand
    brandName: "Plasticart",
    brandTagline: "Your Packaging Marketplace",
  },
  ar: {
    // Nav
    home: "الرئيسية",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    
    // Auth
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    phone: "رقم الهاتف",
    displayName: "الاسم الكامل",
    forgotPassword: "نسيت كلمة المرور؟",
    resetPassword: "إعادة تعيين كلمة المرور",
    newPassword: "كلمة المرور الجديدة",
    sendResetLink: "إرسال رابط إعادة التعيين",
    updatePassword: "تحديث كلمة المرور",
    
    // Roles
    buyer: "مشتري",
    seller: "بائع",
    registerAs: "التسجيل كـ",
    
    // Auth messages
    loginTitle: "مرحباً بعودتك",
    loginSubtitle: "تسجيل الدخول إلى حسابك",
    registerTitle: "إنشاء حساب",
    registerSubtitle: "انضم إلى سوق بلاستيكارت",
    resetTitle: "إعادة تعيين كلمة المرور",
    resetSubtitle: "أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين",
    newPasswordTitle: "تعيين كلمة مرور جديدة",
    newPasswordSubtitle: "أدخل كلمة المرور الجديدة أدناه",
    
    // Actions
    submit: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    search: "بحث",
    filter: "تصفية",
    
    // Auth feedback
    checkEmail: "تحقق من بريدك الإلكتروني لرابط التحقق",
    resetEmailSent: "تم إرسال بريد إعادة تعيين كلمة المرور",
    passwordUpdated: "تم تحديث كلمة المرور بنجاح",
    loginSuccess: "تم تسجيل الدخول بنجاح",
    registerSuccess: "تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني.",
    
    // Errors
    emailRequired: "البريد الإلكتروني مطلوب",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordMinLength: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    passwordsMustMatch: "يجب أن تتطابق كلمتا المرور",
    phoneRequired: "رقم الهاتف مطلوب",
    nameRequired: "الاسم الكامل مطلوب",
    invalidCredentials: "بريد إلكتروني أو كلمة مرور غير صالحة",
    
    // Common
    loading: "جاري التحميل...",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    language: "اللغة",
    currency: "جنيه",
    currencySymbol: "ج.م",
    
    // Brand
    brandName: "بلاستيكارت",
    brandTagline: "سوقك للتغليف",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
