import { defineStore } from 'pinia'
import { Dark } from 'quasar'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: false
  }),

  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      Dark.set(this.darkMode)
      localStorage.setItem('darkMode', this.darkMode)
    },

    initTheme() {
      const savedTheme = localStorage.getItem('darkMode')
      if (savedTheme !== null) {
        this.darkMode = savedTheme === 'true'
      } else {
        // Check system preference
        this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      Dark.set(this.darkMode)
    }
  }
})
