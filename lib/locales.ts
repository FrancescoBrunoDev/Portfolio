import { enGB, it } from "date-fns/locale";

export const LOCALES = {
    en: {
        locale: enGB,
        timePreposition: "at",
        dateFormat: "EEE, MMM d, yyyy '${timePreposition}' h:mm a",
    },
    it: {
        locale: it,
        timePreposition: "alle",
        dateFormat: "EEE d MMM yyyy '${timePreposition}' HH:mm",
    },
} as const;

export type SupportedLang = keyof typeof LOCALES;

export const allowedLangs = Object.keys(LOCALES) as SupportedLang[];

export const getLocale = (lang: string) => {
    return LOCALES[lang as SupportedLang]?.locale || LOCALES.en.locale;
}; 