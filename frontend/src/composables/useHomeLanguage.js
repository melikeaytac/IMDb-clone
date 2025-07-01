import { ref, onMounted } from 'vue'

const language = ref('tr') 

export function useHomeLanguage() {
  const setLanguage = (lang) => {
    language.value = lang
    localStorage.setItem('home_lang', lang)
  }

  const detectLanguage = () => {
    const saved = localStorage.getItem('home_lang')
    if (saved) {
      language.value = saved
    } else {
      const browserLang = navigator.language.startsWith('en') ? 'en' : 'tr'
      language.value = browserLang
    }
  }

  onMounted(() => {
    detectLanguage()
  })

  return { language, setLanguage }
}
