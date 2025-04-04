import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar arquivos de tradução
import translationPT from './locales/pt-BR.json';
import translationEN from './locales/en-US.json';
import translationES from './locales/es.json';

// Recursos de tradução
const resources = {
  'pt-BR': {
    translation: translationPT
  },
  'en-US': {
    translation: translationEN
  },
  'es': {
    translation: translationES
  }
};

i18n
  // Detectar idioma do navegador
  .use(LanguageDetector)
  // Passar o i18n para o react-i18next
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    resources,
    fallbackLng: 'pt-BR',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // React já escapa os valores
    }
  });

export default i18n;
