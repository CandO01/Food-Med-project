import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en.json'
import pidgin from './pidgin.json'

const storedLang = localStorage.getItem('appLang') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pidgin: { translation: pidgin }
    },
    lng: storedLang,           // Sets the initial language
    fallbackLng: 'en',         // Defaults to English if key is missing
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
