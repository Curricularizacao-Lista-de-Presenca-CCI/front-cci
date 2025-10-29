import { Funcionario } from "./funcionario";

export interface Evento {
    id: number;
    titulo: string;
    data: string;
    local: string;
    arquivo: string;
    funcionario: Funcionario;
}
