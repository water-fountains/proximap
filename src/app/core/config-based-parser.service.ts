import { Injectable } from '@angular/core';

export interface Config<C = string> {
  code: C;
  aliases: string[];
}

@Injectable()
export class ConfigBasedParserService {
  parse(value: string | undefined | null, configs: Config[]): string | undefined {
    if (value === undefined || value === null) return undefined;

    const valueLower = value.toLowerCase();
    return configs.find(x => x.aliases.includes(valueLower))?.code;
  }
}
