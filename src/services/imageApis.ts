export enum ImageSource {
  WAIFU_IM = 'waifuIm',
  WAIFU_PICS = 'waifuPics',
  NEKOS_MOE = 'nekosMoe',
  NEKOS_API = 'nekosApi',
  NEKOS_BEST = 'nekosBest',
  NEKOS_LIFE = 'nekosLife',
  WAIFU_VAULT = 'waifuVault',
  PURR = 'purr',
  NSFW_COM = 'nsfwCom'
}

export interface ImageData {
  url: string;
  source: ImageSource;
}

export class ImageApiService {
  private static readonly DESKTOP_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  private static readonly MOBILE_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

  private static isExplicitMode(): boolean {
    return localStorage.getItem('explicitMode') === 'true';
  }

  static setExplicitMode(enabled: boolean): void {
    localStorage.setItem('explicitMode', enabled.toString());
  }

  static getExplicitMode(): boolean {
    return this.isExplicitMode();
  }

  private static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private static async fetchWithRetry(url: string, maxRetries: number = 2): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const userAgent = this.isMobile() ? this.MOBILE_USER_AGENT : this.DESKTOP_USER_AGENT;
        
        if (attempt === 0) {
          // First try with user agent
          return await fetch(url, {
            headers: {
              'User-Agent': userAgent
            }
          });
        } else if (attempt === 1) {
          // Second try without user agent header
          return await fetch(url);
        } else {
          // Last try with different approach for mobile
          return await fetch(url, {
            mode: 'cors',
            cache: 'no-cache'
          });
        }
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt + 1} failed for ${url}:`, error);
        
        // Wait before retrying (except on last attempt)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
        }
      }
    }
    
    throw lastError || new Error('All retry attempts failed');
  }

  private static async fetchWithUserAgent(url: string): Promise<Response> {
    return this.fetchWithRetry(url);
  }

  static async fetchImageFromWaifuIm(): Promise<ImageData> {
    try {
      const nsfwParam = this.isExplicitMode() ? 'true' : 'false';
      const response = await this.fetchWithUserAgent(`https://api.waifu.im/search?is_nsfw=${nsfwParam}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        return {
          url: data.images[0].url,
          source: ImageSource.WAIFU_IM
        };
      }
      throw new Error('No images found in waifu.im response');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch from waifu.im: ${errorMessage}`);
    }
  }

  static async fetchImageFromWaifuPics(): Promise<ImageData> {
    try {
      let categories: string[];
      let endpoint: string;
      
      if (this.isExplicitMode()) {
        categories = ['waifu', 'neko', 'trap', 'blowjob'];
        endpoint = 'nsfw';
      } else {
        categories = ['waifu', 'neko', 'shinobu', 'cuddle', 'hug', 'kiss', 'lick', 'pat', 'bonk', 'blush', 'smile', 'nom', 'bite', 'glomp', 'slap', 'kick', 'happy', 'poke', 'dance'];
        endpoint = 'sfw';
      }
      
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const response = await this.fetchWithUserAgent(`https://api.waifu.pics/${endpoint}/${randomCategory}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.url) {
        return {
          url: data.url,
          source: ImageSource.WAIFU_PICS
        };
      }
      throw new Error('No URL found in waifu.pics response');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch from waifu.pics: ${errorMessage}`);
    }
  }

  static async fetchImageFromNekosMoe(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://nekos.moe/api/v1/random/image?nsfw=false');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        return {
          url: `https://nekos.moe/image/${data.images[0].id}`,
          source: ImageSource.NEKOS_MOE
        };
      }
      throw new Error('No images found in nekos.moe response');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch from nekos.moe: ${errorMessage}`);
    }
  }

  static async fetchImageFromNekosApi(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://nekos.best/api/v2/waifu');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return {
          url: data.results[0].url,
          source: ImageSource.NEKOS_API
        };
      }
      throw new Error('No results found in nekos.best response');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch from nekos.best: ${errorMessage}`);
    }
  }

  static async fetchImageFromNekosBest(): Promise<ImageData> {
    try {
      const categories = ['neko', 'waifu', 'kitsune'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const response = await this.fetchWithUserAgent(`https://nekos.best/api/v2/${randomCategory}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return {
          url: data.results[0].url,
          source: ImageSource.NEKOS_BEST
        };
      }
      throw new Error('No results found in nekos.best response');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch from nekos.best: ${errorMessage}`);
    }
  }

  static async fetchImageFromNekosLife(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://nekos.life/api/v2/img/waifu');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.url) {
        return {
          url: data.url,
          source: ImageSource.NEKOS_LIFE
        };
      }
      throw new Error('No URL found in nekos.life response');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch from nekos.life: ${errorMessage}`);
    }
  }

  static async fetchImageFromWaifuVault(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://api.waifu.pics/sfw/waifu');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.url) {
        return {
          url: data.url,
          source: ImageSource.WAIFU_VAULT
        };
      }
      throw new Error('No URL found in waifu vault response');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch from waifu vault: ${errorMessage}`);
    }
  }

  static async fetchImageFromPurr(): Promise<ImageData> {
    try {
      let categories: string[];
      let endpointPrefix: string;
      
      if (this.isExplicitMode()) {
        // Using v2 API for explicit content
        categories = ['neko/img']; // Limited explicit categories available in v2
        endpointPrefix = 'https://api.purrbot.site/v2/img/nsfw/';
      } else {
        // Using v2 API for SFW content with available categories
        categories = ['neko/img', 'kitsune/img', 'holo/img', 'senko/img', 'shiro/img'];
        endpointPrefix = 'https://api.purrbot.site/v2/img/sfw/';
      }
      
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const response = await this.fetchWithUserAgent(`${endpointPrefix}${randomCategory}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.link && !data.error) {
        return {
          url: data.link,
          source: ImageSource.PURR
        };
      }
      throw new Error('No link found in purr response or API returned error');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch from purr: ${errorMessage}`);
    }
  }

  static async fetchImageFromNsfwCom(): Promise<ImageData> {
    try {
      let categories: string[];
      let endpointPrefix: string;
      
      if (this.isExplicitMode()) {
        // NSFW categories from Swift implementation
        categories = [
          "anal", "ass", "blowjob", "breeding", "buttplug", "cages", "ecchi", 
          "feet", "fo", "furry", "gif", "hentai", "legs", "masturbation", 
          "milf", "muscle", "neko", "paizuri", "petgirls", "pierced", 
          "selfie", "smothering", "socks", "trap", "vagina", "yaoi", "yuri"
        ];
        endpointPrefix = "https://api.n-sfw.com/nsfw/";
      } else {
        // SFW categories from Swift implementation
        categories = [
          "bunny-girl", "charlotte", "date-a-live", "death-note", "demon-slayer", 
          "haikyu", "hxh", "kakegurui", "konosuba", "komi", "memes", "naruto", 
          "noragami", "one-piece", "rag", "sakurasou", "sao", "sds", "spy-x-family", 
          "takagi-san", "toradora", "your-name"
        ];
        endpointPrefix = "https://api.n-sfw.com/sfw/";
      }
      
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const response = await this.fetchWithUserAgent(`${endpointPrefix}${randomCategory}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Using the correct response field from Swift implementation
      if (data.url_usa) {
        return {
          url: data.url_usa,
          source: ImageSource.NSFW_COM
        };
      }
      throw new Error('No url_usa found in n-sfw.com response');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch from n-sfw.com: ${errorMessage}`);
    }
  }

  static async fetchImageFromSource(source: ImageSource): Promise<ImageData> {
    console.log(`Fetching image from ${source} (Mobile: ${this.isMobile()})`);
    
    try {
      switch (source) {
        case ImageSource.WAIFU_IM:
          return await this.fetchImageFromWaifuIm();
        case ImageSource.WAIFU_PICS:
          return await this.fetchImageFromWaifuPics();
        case ImageSource.NEKOS_MOE:
          return await this.fetchImageFromNekosMoe();
        case ImageSource.NEKOS_API:
          return await this.fetchImageFromNekosApi();
        case ImageSource.NEKOS_BEST:
          return await this.fetchImageFromNekosBest();
        case ImageSource.NEKOS_LIFE:
          return await this.fetchImageFromNekosLife();
        case ImageSource.WAIFU_VAULT:
          return await this.fetchImageFromWaifuVault();
        case ImageSource.PURR:
          return await this.fetchImageFromPurr();
        case ImageSource.NSFW_COM:
          return await this.fetchImageFromNsfwCom();
        default:
          throw new Error(`Unknown image source: ${source}`);
      }
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error);
      throw error;
    }
  }

  static getSourceDisplayName(source: ImageSource): string {
    const sourceNames = {
      [ImageSource.WAIFU_IM]: 'Waifu.im',
      [ImageSource.WAIFU_PICS]: 'Waifu Pics',
      [ImageSource.NEKOS_MOE]: 'Nekos.moe',
      [ImageSource.NEKOS_API]: 'Nekos API',
      [ImageSource.NEKOS_BEST]: 'Nekos.best',
      [ImageSource.NEKOS_LIFE]: 'Nekos.life',
      [ImageSource.WAIFU_VAULT]: 'Waifu Vault',
      [ImageSource.PURR]: 'PurrBot',
      [ImageSource.NSFW_COM]: 'N-SFW.com'
    };
    return sourceNames[source] || source;
  }

  static getAllSources(): ImageSource[] {
    return Object.values(ImageSource);
  }
}
