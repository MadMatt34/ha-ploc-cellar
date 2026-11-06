import en from "./translations/en.json";
import fr from "./translations/fr.json";

export type TranslationKey = keyof typeof en;

export function translate(language: string, key: TranslationKey): string {
  return (language.toLocaleLowerCase().startsWith("fr") ? fr : en)[key];
}

/**
 * The Home Assistant card picker only accepts static name/description strings
 * in window.customCards and does not provide the hass instance. Use the
 * browser locale for this metadata; card content and editors use hass.language.
 */
export function translatePicker(key: TranslationKey): string {
  const language = typeof navigator === "undefined" ? "en" : navigator.language;
  return translate(language, key);
}
