import { Atuacao } from "./atuacao";

export interface Funcionario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    atuacao: Atuacao;
}
