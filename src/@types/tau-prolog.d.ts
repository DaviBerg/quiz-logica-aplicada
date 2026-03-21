// tau-prolog.d.ts
declare module 'tau-prolog' {
    interface PrologOptions {
        success?: (goal?: any) => void;
        error?: (err: any) => void;
    }

    interface Session {
        // Agora aceita o segundo argumento opcional de configurações
        consult(program: string, options?: PrologOptions): boolean | string;
        query(query: string, options?: PrologOptions): boolean | string;
        answer(callback: (answer: any) => void): void;
    }

    interface Prolog {
        create(limit?: number): Session;
    }

    const pl: Prolog;
    export default pl;
}