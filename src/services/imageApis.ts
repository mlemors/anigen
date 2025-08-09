export enum ImageSource {
  WAIFU_IM = 'waifuIm',
  PIC_RE = 'picRe',
  WAIFU_PICS = 'waifuPics',
  PURR = 'purr',
  NEKOS_MOE = 'nekosMoe',
  NEKO_BOT = 'nekoBot',
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

  static async fetchImageFromPicRe(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://api.pic.re/waifu');
      const data = await response.json();
      
      if (data.url) {
        return {
          url: data.url,
          source: ImageSource.PIC_RE
        };
      }
      throw new Error('No URL found in pic.re response');
    } catch (error) {
      throw new Error(`Failed to fetch from pic.re: ${error}`);
    }
  }

  static async fetchImageFromPurr(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://purrbot.site/api/img/sfw/waifu/gif');
      const data = await response.json();
      
      if (data.link) {
        return {
          url: data.link,
          source: ImageSource.PURR
        };
      }
      throw new Error('No link found in purr response');
    } catch (error) {
      throw new Error(`Failed to fetch from purr: ${error}`);
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

  static async fetchImageFromNekoBot(): Promise<ImageData> {
    try {
      const response = await this.fetchWithUserAgent('https://nekobot.xyz/api/image?type=waifu');
      const data = await response.json();
      
      if (data.message) {
        return {
          url: data.message,
          source: ImageSource.NEKO_BOT
        };
      }
      throw new Error('No message found in nekobot response');
    } catch (error) {
      throw new Error(`Failed to fetch from nekobot: ${error}`);
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
      case ImageSource.PIC_RE:
        return this.fetchImageFromPicRe();
      case ImageSource.WAIFU_PICS:
        return this.fetchImageFromWaifuPics();
      case ImageSource.PURR:
        return this.fetchImageFromPurr();
      case ImageSource.NEKOS_MOE:
        return this.fetchImageFromNekosMoe();
      case ImageSource.NEKO_BOT:
        return this.fetchImageFromNekoBot();
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
      [ImageSource.WAIFU_IM]: 'Waifu.im',
      [ImageSource.PIC_RE]: 'Pic.re',
      [ImageSource.WAIFU_PICS]: 'Waifu.pics',
      [ImageSource.PURR]: 'Purr',
      [ImageSource.NEKOS_MOE]: 'Nekos.moe',
      [ImageSource.NEKO_BOT]: 'NekoBot',
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
