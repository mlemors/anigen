export enum ImageSource {
  WAIFU_IM = 'waifuIm',
  WAIFU_PICS = 'waifuPics',
  NEKOS_MOE = 'nekosMoe',
  NEKOS_API = 'nekosApi',
  NEKOS_BEST = 'nekosBest',
  NEKOS_LIFE = 'nekosLife'
}

export interface ImageData {
  url: string;
  source: ImageSource;
}

export class ImageApiService {
  private static readonly DESKTOP_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  private static readonly MOBILE_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

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
      const response = await this.fetchWithUserAgent('https://api.waifu.im/search?is_nsfw=false');
      
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
      const categories = ['waifu', 'neko', 'shinobu', 'cuddle', 'hug', 'kiss', 'lick', 'pat', 'bonk', 'blush', 'smile', 'nom', 'bite', 'glomp', 'slap', 'kick', 'happy', 'poke', 'dance'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const response = await this.fetchWithUserAgent(`https://api.waifu.pics/sfw/${randomCategory}`);
      
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
      const response = await this.fetchWithUserAgent('https://nekos.best/api/v2/neko');
      
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
        default:
          throw new Error(`Unknown image source: ${source}`);
      }
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error);
      throw error;
    }
  }

  static getSourceDisplayName(source: ImageSource): string {
    const names: Record<ImageSource, string> = {
      [ImageSource.WAIFU_PICS]: 'Waifu.pics',
      [ImageSource.WAIFU_IM]: 'Waifu.im',
      [ImageSource.NEKOS_MOE]: 'Nekos.moe',
      [ImageSource.NEKOS_API]: 'Nekos API',
      [ImageSource.NEKOS_BEST]: 'Nekos.best',
      [ImageSource.NEKOS_LIFE]: 'Nekos.life'
    };
    return names[source] || source;
  }

  static getAllSources(): ImageSource[] {
    return Object.values(ImageSource);
  }
}
