export interface Rule {
    match(source: string): boolean;

    getDescription(): string;
}

export class HasStringRule implements Rule {
    constructor(private str: string) {
    }

    match(source: string): boolean {
        return !!source.match(new RegExp(this.str, 'gmi'));
    }

    getDescription(): string {
        return `Код должен содержать \`${this.str}\``;
    }
}

export class HasForLoopRule implements Rule {
    constructor(private type: 'to' | 'downto') {
    }

    match(source: string): boolean {
        const regex = new RegExp(`for.*${this.type}`, 'gmi');

        return !!source.match(regex);
    }

    getDescription(): string {
        return `Код должен содержать цикл for..${this.type}`;
    }
}

export class RepeatRule implements Rule {
    constructor(private str: string, private n: number) {
    }

    match(source: string): boolean {
        const match = source.match(new RegExp(this.str, 'gmi'));
        if (!match) return false;

        return match.length === this.n - 1;
    }

    getDescription(): string {
        return `Строка \`${this.str}\` должна повторяться ${this.n} раз`;
    }
}
