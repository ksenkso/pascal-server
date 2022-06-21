import {Rule} from './rules';

export class RulesError implements Error {
    message: string;
    name = 'RulesError';

    constructor(rules: Rule[]) {
        this.message = rules.map(rule => rule.getDescription()).join('\n');
    }
}

export class ResultError implements Error {
    message: string;
    name = 'ResultError';

    constructor(public fileName: string, public stdout: string, public expected: string) {
        this.message =
            `Стандартный вывод: ${stdout}
Ожидаемый вывод: ${expected}`;
    }
}

export class PascalRuntimeError implements Error {
    message: string;
    name = 'PascalRuntimeError';

    constructor(public fileName: string, public stdout: string, public stderr: string, public code: number) {
        this.message =
            `Стандартный вывод: ${stdout}
Вывод ошибок: ${stderr}
Код ошибки: ${code}`;
    }
}

export class CompilationError implements Error {
    message: string;
    name = 'CompilationError';

    constructor(public fileName: string, public stderr: string, public code: number) {
        this.message =
          `Вывод ошибок: ${stderr}
Код ошибки: ${code}`;
    }
}
