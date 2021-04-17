import { Expose, Transform } from "class-transformer";
import { IsOptional, IsString, IsUrl, Matches } from "class-validator";
import { HostsService } from "../modules/hosts/hosts.service";
import escapeString from "escape-string-regexp";

export class MicroHost {
  // https://regex101.com/r/F14kPM/1
  @Matches(/^https?:\/\/[0-9A-z-.:{}]+$/)
  url!: string;

  @IsString({ each: true })
  @IsOptional()
  tags: string[] = [];

  @IsUrl({ require_protocol: true })
  @IsOptional()
  redirect?: string;

  @Expose()
  get key() {
    return HostsService.normaliseHostUrl(this.url);
  }

  @Expose()
  get wildcard() {
    return this.url.includes("{{username}}");
  }

  @Expose()
  @Transform(({ value }) => value.source, { toPlainOnly: true })
  @Transform(({ value }) => new RegExp(value), { toClassOnly: true })
  get pattern() {
    // todo: this means we're compiling regex every time we check
    // using pattern.test. we should cache this or create it once during the transform.
    const escaped = escapeString(this.key);
    const pattern = escaped.replace("\\{\\{username\\}\\}", "(?<username>[a-z0-9-{}]+?)");
    return new RegExp(`^(https?:\\/\\/)?${pattern}\\/?$`);
  }
}
