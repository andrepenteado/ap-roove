import { Parentesco } from "./enums/parentesco";

export class Paciente {

    id: number;
    dataCadastro: Date;
    nome: string;
    cpf: number;
    dataNascimento: Date;
    telefone: number;
    whatsapp: boolean;
    email: string;
    contatoEmergencia: string;
    parentescoContatoEmergencia: Parentesco;
    cep: number;
    logradouro: string;
    numeroLogradouro: number;
    bairro: string;
    cidade: string;
    estado: string;
    profissao: string;
    diaVencimento: number;
    frequenciaSemanal: number;
    historiaMolestiaPregressa: string;
    queixaPrincipal: string;
    remedios: string;
    objetivos: string;

}
