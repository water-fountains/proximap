import { Injectable } from '@angular/core';

export interface Config<C> {
  readonly code: C;
  readonly aliases: readonly string[];
}

@Injectable()
export class ConfigBasedParserService {
  parse<T>(value: string | undefined | null, configs: readonly Config<T>[]): T | undefined {
    if (value === undefined || value === null) return undefined;

    const valueLower = value.toLowerCase();
    return configs.find(x => x.aliases.includes(valueLower))?.code;
  }
}
