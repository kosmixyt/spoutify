/**
 * Classe utilitaire pour gérer le cache des images
 */
export class ImageCache {
  private static instance: ImageCache;
  private cache: Map<string, HTMLImageElement>;
  private loadingPromises: Map<string, Promise<HTMLImageElement>>;

  private constructor() {
    this.cache = new Map<string, HTMLImageElement>();
    this.loadingPromises = new Map<string, Promise<HTMLImageElement>>();
  }

  /**
   * Obtient l'instance unique du cache d'images
   */
  public static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  /**
   * Méthode statique pour accéder directement à getImage
   * @param url L'URL de l'image à charger
   * @returns Une promesse qui résout avec l'élément image chargé
   */
  public static loadImage(url: string): Promise<HTMLImageElement> {
    return ImageCache.getInstance().getImage(url);
  }

  /**
   * Charge une image depuis le cache ou la télécharge si nécessaire
   * @param url L'URL de l'image à charger
   * @returns Une promesse qui résout avec l'élément image chargé
   */
  public async getImage(url: string): Promise<HTMLImageElement> {
    // Si l'URL est vide, retourne une promesse rejetée
    if (!url) {
      return Promise.reject(new Error("URL d'image invalide"));
    }

    // Vérifier si l'image est déjà dans le cache
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url)!);
    }

    // Vérifier si l'image est déjà en cours de chargement
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    // Sinon, charger l'image
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        // Mettre en cache l'image une fois chargée
        this.cache.set(url, img);
        this.loadingPromises.delete(url);
        resolve(img);
      };

      img.onerror = () => {
        this.loadingPromises.delete(url);
        reject(new Error(`Impossible de charger l'image: ${url}`));
      };

      img.src = url;
    });

    // Stocker la promesse de chargement
    this.loadingPromises.set(url, loadPromise);
    return loadPromise;
  }

  /**
   * Précharge un groupe d'images en les ajoutant au cache
   * @param urls Tableau d'URLs d'images à précharger
   * @returns Une promesse qui résout quand toutes les images sont chargées
   */
  public preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(urls.filter(Boolean).map((url) => this.getImage(url)));
  }

  /**
   * Efface une image spécifique du cache
   * @param url L'URL de l'image à supprimer
   */
  public clearImage(url: string): void {
    this.cache.delete(url);
  }

  /**
   * Efface tout le cache d'images
   */
  public clearCache(): void {
    this.cache.clear();
  }
}

export default ImageCache.getInstance();
