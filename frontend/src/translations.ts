import en from "./translations/en.json";
import fr from "./translations/fr.json";

export type TranslationKey = keyof typeof en;

export function translate(language: string, key: TranslationKey): string {
  return (language.toLocaleLowerCase().startsWith("fr") ? fr : en)[key];
}
