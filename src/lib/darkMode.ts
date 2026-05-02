class DarkModeManager {
  private static instance: DarkModeManager;
  private readonly STORAGE_KEY = 'dark-mode';
  private readonly HTML_ELEMENT = document.documentElement;

  private constructor() {
    this.initializeDarkMode();
  }

  public static getInstance(): DarkModeManager {
    if (!DarkModeManager.instance) {
      DarkModeManager.instance = new DarkModeManager();
    }
    return DarkModeManager.instance;
  }

  private initializeDarkMode(): void {
    const savedMode = this.getStoredMode();

    if (savedMode !== null) {
      this.setDarkMode(savedMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDark);
    }

    this.watchSystemTheme();
  }

  private getStoredMode(): boolean | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === null ? null : stored === 'true';
  }

  private setStoredMode(isDark: boolean): void {
    localStorage.setItem(this.STORAGE_KEY, isDark.toString());
  }

  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (this.getStoredMode() === null) {
        this.setDarkMode(e.matches);
      }
    });
  }

  public setDarkMode(isDark: boolean): void {
    if (isDark) {
      this.HTML_ELEMENT.classList.add('dark');
    } else {
      this.HTML_ELEMENT.classList.remove('dark');
    }
    this.setStoredMode(isDark);
  }

  public toggleDarkMode(): boolean {
    const isCurrentlyDark = this.isDarkMode();
    this.setDarkMode(!isCurrentlyDark);
    return !isCurrentlyDark;
  }

  public isDarkMode(): boolean {
    return this.HTML_ELEMENT.classList.contains('dark');
  }

  public getSystemPreference(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  public resetToSystem(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.setDarkMode(this.getSystemPreference());
  }
}

export const darkModeManager = DarkModeManager.getInstance();
export default DarkModeManager;
