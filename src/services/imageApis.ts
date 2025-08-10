export enum ImageSource {
  WAIFU_VAULT = 'waifuVault',
  WAIFU_IM = 'waifuIm',
  WAIFU_PICS = 'waifuPics',
  NEKOS_MOE = 'nekosMoe',
  NEKOS_API = 'nekosApi',
  NEKOS_BEST = 'nekosBest',
  NEKOS_LIFE = 'nekosLife',
  PURR = 'purr',
  NSFW_COM = 'nsfwCom'
}

export interface ImageData {
  url: string;
  source: ImageSource;
}

interface ApiConfig {
  url: string;
  method?: 'GET' | 'POST';
  responseParser: (data: any) => string | null;
  categories?: {
    sfw: string[];
    nsfw: string[];
  };
  requiresProxy?: boolean;
}

export class ImageApiService {
  private static readonly DESKTOP_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  private static readonly MOBILE_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

  // Simple obfuscation for category lists
  private static decodeCategories(encoded: string): string[] {
    return JSON.parse(atob(encoded));
  }

  private static readonly API_CONFIGS: Record<ImageSource, ApiConfig> = {
    [ImageSource.WAIFU_IM]: {
      url: 'https://api.waifu.im/search',
      responseParser: (data) => data.images?.[0]?.url,
    },
    [ImageSource.WAIFU_PICS]: {
      url: 'https://api.waifu.pics',
      responseParser: (data) => data.url,
      categories: {
        sfw: this.decodeCategories('WyJ3YWlmdSIsIm5la28iLCJzaGlub2J1IiwibWVndW1pbiIsImN1ZGRsZSIsImh1ZyIsImtpc3MiLCJsaWNrIiwicGF0IiwiYm9uayIsImJsdXNoIiwic21pbGUiLCJub20iLCJiaXRlIiwiZ2xvbXAiLCJzbGFwIiwia2ljayIsImhhcHB5IiwicG9rZSIsImRhbmNlIiwiY3J5Iiwid2F2ZSIsImF3b28iLCJidWxseSJd'),
        nsfw: this.decodeCategories('WyJ3YWlmdSIsIm5la28iLCJ0cmFwIiwiYmxvd2pvYiJd')
      }
    },
    [ImageSource.NEKOS_MOE]: {
      url: 'https://nekos.moe/api/v1/random/image?nsfw=false',
      responseParser: (data) => data.images?.[0] ? `https://nekos.moe/image/${data.images[0].id}` : null,
    },
    [ImageSource.NEKOS_API]: {
      url: 'https://nekos.best/api/v2/waifu',
      responseParser: (data) => data.results?.[0]?.url,
    },
    [ImageSource.NEKOS_BEST]: {
      url: 'https://nekos.best/api/v2',
      responseParser: (data) => data.results?.[0]?.url,
      categories: {
        sfw: this.decodeCategories('WyJuZWtvIiwid2FpZnUiLCJodXNiYW5kbyIsImtpdHN1bmUiLCJsdXJrIiwic2hvb3QiLCJzbGVlcCIsInNocnVnIiwic3RhcmUiLCJ3YXZlIiwicG9rZSIsInNtaWxlIiwicGVjayIsIndpbmsiLCJibHVzaCIsInNtdWciLCJ0aWNrbGUiLCJ5ZWV0IiwidGhpbmsiLCJoaWdoZml2ZSIsImZlZWQiLCJiaXRlIiwiYm9yZWQiLCJub20iLCJ5YXduIiwiZmFjZXBhbG0iLCJjdWRkbGUiLCJraWNrIiwiaGFwcHkiLCJodWciLCJiYWthIiwicGF0IiwiYW5ncnkiLCJydW4iLCJub2QiLCJub3BlIiwia2lzcyIsImRhbmNlIiwicHVuY2giLCJoYW5kc2hha2UiLCJzbGFwIiwiY3J5IiwicG91dCIsImhhbmRob2xkIiwidGh1bWJzdXAiLCJsYXVnaCJd'),
        nsfw: []
      }
    },
    [ImageSource.NEKOS_LIFE]: {
      url: 'https://nekos.life/api/v2/img',
      responseParser: (data) => data.url,
      categories: {
        sfw: this.decodeCategories('WyJuZ2lmIiwiaHVnIiwiZ2VjZyIsInBhdCIsImN1ZGRsZSIsIm1lb3ciLCJ0aWNrbGUiLCJnYXNtIiwiZ29vc2UiLCJsZXdkIiwic3BhbmsiLCJmZWVkIiwic2xhcCIsIndhbGxwYXBlciIsIm5la28iLCJsaXphcmQiLCJ3b29mIiwiZm94X2dpcmwiLCJraXNzIiwiYXZhdGFyIiwid2FpZnUiLCJzbXVnIl0='),
        nsfw: []
      }
    },
    [ImageSource.WAIFU_VAULT]: {
      url: 'https://api.waifu.pics/sfw/waifu',
      responseParser: (data) => data.url,
    },
    [ImageSource.PURR]: {
      url: 'https://api.purrbot.site/v2/img',
      responseParser: (data) => data.error ? null : data.link,
      requiresProxy: true,
      categories: {
        sfw: this.decodeCategories('WyJhbmdyeS9naWYiLCJiYWNrZ3JvdW5kL2ltZyIsImJpdGUvZ2lmIiwiYmx1c2gvZ2lmIiwiY29tZnkvZ2lmIiwiY3J5L2dpZiIsImN1ZGRsZS9naWYiLCJkYW5jZS9naWYiLCJlZXZlZS9pbWciLCJlZXZlZS9naWYiLCJmbHVmZi9naWYiLCJob2xvL2ltZyIsImh1Zy9naWYiLCJpY29uL2ltZyIsImtpc3MvZ2lmIiwia2l0c3VuZS9pbWciLCJsYXkvZ2lmIiwibGljay9naWYiLCJuZWtvL2ltZyIsIm5la28vZ2lmIiwib2thbWkvaW1nIiwicGF0L2dpZiIsInBva2UvZ2lmIiwicG91dC9naWYiLCJzZW5rby9pbWciLCJzaGlyby9pbWciLCJzbGFwL2dpZiIsInNtaWxlL2dpZiIsInRhaWwvZ2lmIiwidGlja2xlL2dpZiJd'),
        nsfw: this.decodeCategories('WyJhbmFsL2dpZiIsImJsb3dqb2IvZ2lmIiwiY3VtL2dpZiIsImZ1Y2svZ2lmIiwibmVrby9pbWciLCJuZWtvL2dpZiIsInB1c3N5bGljay9naWYiLCJzb2xvL2dpZiIsInNvbG9fbWFsZS9naWYiLCJ0aHJlZXNvbWVfZmZmL2dpZiIsInRocmVlc29tZV9mZm0vZ2lmIiwidGhyZWVzb21lX21tZi9naWYiLCJ5YW9pL2dpZiIsInl1cmkvZ2lmIl0=')
      }
    },
    [ImageSource.NSFW_COM]: {
      url: 'https://api.n-sfw.com',
      responseParser: (data) => data.url_usa,
      categories: {
        sfw: this.decodeCategories('WyJidW5ueS1naXJsIiwiY2hhcmxvdHRlIiwiZGF0ZS1hLWxpdmUiLCJkZWF0aC1ub3RlIiwiZGVtb24tc2xheWVyIiwiaGFpa3l1IiwiaHhoIiwia2FrZWd1cnVpIiwia29ub3N1YmEiLCJrb21pIiwibWVtZXMiLCJuYXJ1dG8iLCJub3JhZ2FtaSIsIm9uZS1waWVjZSIsInJhZyIsInNha3VyYXNvdSIsInNhbyIsInNkcyIsInNweS14LWZhbWlseSIsInRha2FnaS1zYW4iLCJ0b3JhZG9yYSIsInlvdXItbmFtZSJd'),
        nsfw: this.decodeCategories('WyJhbmFsIiwiYXNzIiwiYmxvd2pvYiIsImJyZWVkaW5nIiwiYnV0dHBsdWciLCJjYWdlcyIsImVjY2hpIiwiZmVldCIsImZvIiwiZnVycnkiLCJnaWYiLCJoZW50YWkiLCJsZWdzIiwibWFzdHVyYmF0aW9uIiwibWlsZiIsIm11c2NsZSIsIm5la28iLCJwYWl6dXJpIiwicGV0Z2lybHMiLCJwaWVyY2VkIiwic2VsZmllIiwic21vdGhlcmluZyIsInNvY2tzIiwidHJhcCIsInZhZ2luYSIsInlhb2kiLCJ5dXJpIl0=')
      }
    }
  };

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

  private static async fetchWithCorsProxy(url: string): Promise<Response> {
    // For APIs that are known to be CORS-blocked, use proxy directly
    try {
      // First try the reliable allorigins proxy
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      console.log(`Using CORS proxy for: ${url}`);
      const response = await fetch(proxyUrl);
      if (response.ok) {
        return response;
      }
      throw new Error(`Proxy failed: ${response.status}`);
    } catch (error) {
      // Fallback to alternative proxy
      try {
        const proxyUrl2 = `https://cors-anywhere.herokuapp.com/${url}`;
        console.log(`Using fallback CORS proxy for: ${url}`);
        return await fetch(proxyUrl2);
      } catch (fallbackError) {
        throw new Error(`All CORS proxies failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  private static buildApiUrl(source: ImageSource): string {
    const config = this.API_CONFIGS[source];
    const isExplicit = this.isExplicitMode();
    
    switch (source) {
      case ImageSource.WAIFU_IM:
        return `${config.url}?is_nsfw=${isExplicit}`;
      
      case ImageSource.WAIFU_PICS:
        if (!config.categories) return config.url;
        const endpoint = isExplicit ? 'nsfw' : 'sfw';
        const categories = isExplicit ? config.categories.nsfw : config.categories.sfw;
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        return `${config.url}/${endpoint}/${randomCategory}`;
      
      case ImageSource.NEKOS_BEST:
        if (!config.categories) return config.url;
        const bestCategories = config.categories.sfw;
        const randomBestCategory = bestCategories[Math.floor(Math.random() * bestCategories.length)];
        return `${config.url}/${randomBestCategory}`;
      
      case ImageSource.NEKOS_LIFE:
        if (!config.categories) return config.url;
        const lifeCategories = config.categories.sfw;
        const randomLifeCategory = lifeCategories[Math.floor(Math.random() * lifeCategories.length)];
        return `${config.url}/${randomLifeCategory}`;
      
      case ImageSource.PURR:
        if (!config.categories) return config.url;
        const purrEndpoint = isExplicit ? 'nsfw' : 'sfw';
        const purrCategories = isExplicit ? config.categories.nsfw : config.categories.sfw;
        const randomPurrCategory = purrCategories[Math.floor(Math.random() * purrCategories.length)];
        return `${config.url}/${purrEndpoint}/${randomPurrCategory}`;
      
      case ImageSource.NSFW_COM:
        if (!config.categories) return config.url;
        const nsfwEndpoint = isExplicit ? 'nsfw' : 'sfw';
        const nsfwCategories = isExplicit ? config.categories.nsfw : config.categories.sfw;
        const randomNsfwCategory = nsfwCategories[Math.floor(Math.random() * nsfwCategories.length)];
        return `${config.url}/${nsfwEndpoint}/${randomNsfwCategory}`;
      
      default:
        return config.url;
    }
  }

  static async fetchImageFromSource(source: ImageSource): Promise<ImageData> {
    console.log(`Fetching image from ${source} (Mobile: ${this.isMobile()})`);
    
    try {
      const config = this.API_CONFIGS[source];
      const apiUrl = this.buildApiUrl(source);
      
      let response: Response;
      if (config.requiresProxy) {
        response = await this.fetchWithCorsProxy(apiUrl);
      } else {
        response = await this.fetchWithUserAgent(apiUrl);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const imageUrl = config.responseParser(data);
      
      if (!imageUrl) {
        throw new Error(`No valid image URL found in ${source} response`);
      }
      
      return {
        url: imageUrl,
        source
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error fetching from ${source}:`, error);
      throw new Error(`Failed to fetch from ${source}: ${errorMessage}`);
    }
  }

  static getSourceDisplayName(source: ImageSource): string {
    const sourceNames = {
      [ImageSource.WAIFU_VAULT]: 'Waifu Vault',
      [ImageSource.WAIFU_IM]: 'Waifu.im',
      [ImageSource.WAIFU_PICS]: 'Waifu Pics',
      [ImageSource.NEKOS_MOE]: 'Nekos.moe',
      [ImageSource.NEKOS_API]: 'Nekos API',
      [ImageSource.NEKOS_BEST]: 'Nekos.best',
      [ImageSource.NEKOS_LIFE]: 'Nekos.life',
      [ImageSource.PURR]: 'PurrBot',
      [ImageSource.NSFW_COM]: 'N-SFW.com'
    };
    return sourceNames[source] || source;
  }

  static getAllSources(): ImageSource[] {
    return Object.values(ImageSource);
  }
}
