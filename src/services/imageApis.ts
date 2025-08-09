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
  private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  private static async fetchWithUserAgent(url: string): Promise<Response> {
    return fetch(url, {
      headers: {
        'User-Agent': this.USER_AGENT
      }
    });
  }

  static async fetchImageFromWaifuIm(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://api.waifu.im/search?is_nsfw=false');
      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        return {
          url: data.images[0].url,
          source: ImageSource.WAIFU_IM
        };
      }
      throw new Error('No images found in waifu.im response');
    } catch (error) {
      throw new Error(`Failed to fetch from waifu.im: ${error}`);
    }
  }

  static async fetchImageFromWaifuPics(): Promise<ImageData> {
    try {
      const categories = ['waifu', 'neko', 'shinobu', 'cuddle', 'hug', 'kiss', 'lick', 'pat', 'bonk', 'blush', 'smile', 'nom', 'bite', 'glomp', 'slap', 'kick', 'happy', 'poke', 'dance'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const response = await this.fetchWithUserAgent(`https://api.waifu.pics/sfw/${randomCategory}`);
      const data = await response.json();
      
      if (data.url) {
        return {
          url: data.url,
          source: ImageSource.WAIFU_PICS
        };
      }
      throw new Error('No URL found in waifu.pics response');
    } catch (error) {
      throw new Error(`Failed to fetch from waifu.pics: ${error}`);
    }
  }

  static async fetchImageFromNekosMoe(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://nekos.moe/api/v1/random/image?nsfw=false');
      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        return {
          url: `https://nekos.moe/image/${data.images[0].id}`,
          source: ImageSource.NEKOS_MOE
        };
      }
      throw new Error('No images found in nekos.moe response');
    } catch (error) {
      throw new Error(`Failed to fetch from nekos.moe: ${error}`);
    }
  }

  static async fetchImageFromNekosApi(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://nekos.best/api/v2/waifu');
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return {
          url: data.results[0].url,
          source: ImageSource.NEKOS_API
        };
      }
      throw new Error('No results found in nekos.best response');
    } catch (error) {
      throw new Error(`Failed to fetch from nekos.best: ${error}`);
    }
  }

  static async fetchImageFromNekosBest(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://nekos.best/api/v2/neko');
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return {
          url: data.results[0].url,
          source: ImageSource.NEKOS_BEST
        };
      }
      throw new Error('No results found in nekos.best response');
    } catch (error) {
      throw new Error(`Failed to fetch from nekos.best: ${error}`);
    }
  }

  static async fetchImageFromNekosLife(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://nekos.life/api/v2/img/waifu');
      const data = await response.json();
      
      if (data.url) {
        return {
          url: data.url,
          source: ImageSource.NEKOS_LIFE
        };
      }
      throw new Error('No URL found in nekos.life response');
    } catch (error) {
      throw new Error(`Failed to fetch from nekos.life: ${error}`);
    }
  }

  static async fetchImageFromSource(source: ImageSource): Promise<ImageData> {
    switch (source) {
      case ImageSource.WAIFU_IM:
        return this.fetchImageFromWaifuIm();
      case ImageSource.WAIFU_PICS:
        return this.fetchImageFromWaifuPics();
      case ImageSource.NEKOS_MOE:
        return this.fetchImageFromNekosMoe();
      case ImageSource.NEKOS_API:
        return this.fetchImageFromNekosApi();
      case ImageSource.NEKOS_BEST:
        return this.fetchImageFromNekosBest();
      case ImageSource.NEKOS_LIFE:
        return this.fetchImageFromNekosLife();
      default:
        throw new Error(`Unknown image source: ${source}`);
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
