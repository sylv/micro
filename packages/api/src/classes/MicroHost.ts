import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import escapeString from 'escape-string-regexp';
import { HostService } from '../modules/host/host.service';

export class MicroHost {
  constructor(url: string, tags?: string[], redirect?: string) {
    this.url = url;
    this.tags = tags;
    this.redirect = redirect;
  }

  // https://regex101.com/r/ZR9rpp/1
  @Matches(/^https?:\/\/[\d.:A-z{}-]+$/u)
  url: string;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsUrl({ require_protocol: true })
  @IsOptional()
  redirect?: string;

  get normalised() {
    return HostService.normaliseHostUrl(this.url);
  }

  get isWildcard() {
    return this.url.includes('{{username}}');
  }

  private _pattern?: RegExp;
  get pattern() {
    if (this._pattern) return this._pattern;
    this._pattern = MicroHost.getWildcardPattern(this.url);
    return this._pattern;
  }

  static getWildcardPattern(url: string) {
    const normalised = HostService.normaliseHostUrl(url);
    const escaped = escapeString(normalised);
    const pattern = escaped.replace('\\{\\{username\\}\\}', '(?<username>[a-z0-9-{}]+?)');
    return new RegExp(`^(https?:\\/\\/)?${pattern}\\/?`, 'u');
  }
}
