import { IsOptional, IsString, IsUrl, Matches } from "class-validator";
import escapeString from "escape-string-regexp";
import { HostService } from "../modules/host/host.service";

export class MicroHost {
  // https://regex101.com/r/ZR9rpp/1
  @Matches(/^https?:\/\/[\d.:A-z{}-]+$/)
  url!: string;

  @IsString({ each: true })
  @IsOptional()
  tags: string[] = [];

  @IsUrl({ require_protocol: true })
  @IsOptional()
  redirect?: string;

  get normalised() {
    return HostService.normaliseHostUrl(this.url);
  }

  get isWildcard() {
    return this.url.includes("{{username}}");
  }

  private _pattern?: RegExp;
  get pattern() {
    if (this._pattern) return this._pattern;
    const escaped = escapeString(this.normalised);
    const pattern = escaped.replace("\\{\\{username\\}\\}", "(?<username>[a-z0-9-{}]+?)");
    this._pattern = new RegExp(`^(https?:\\/\\/)?${pattern}\\/?`);
    return this._pattern;
  }
}
