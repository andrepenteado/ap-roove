import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Parentesco } from 'src/app/models/enums/parentesco';
import { PacienteService } from '../../../services/paciente.service';
import { ViaCepService } from '../../../services/via-cep.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  abaAtiva = 'top';
  formEnviado = false;
  dataCadastroFormatada: Date = new Date();

  id = new FormControl(null);
  dataCadastro = new FormControl(new Date(Date.now()));
  nome = new FormControl(null, Validators.required);
  cpf = new FormControl(null, Validators.required);
  dataNascimento = new FormControl(null);
  telefone = new FormControl(null, Validators.required);
  whatsapp = new FormControl(false);
  email = new FormControl(null);
  contatoEmergencia = new FormControl(null);
  parentescoContatoEmergencia = new FormControl(null);
  cep = new FormControl(null);
  logradouro = new FormControl(null);
  numeroLogradouro = new FormControl(null);
  bairro = new FormControl(null);
  cidade = new FormControl(null);
  estado = new FormControl(null);
  profissao = new FormControl(null);
  diaVencimento = new FormControl(null);
  frequenciaSemanal = new FormControl(0);
  queixaPrincipal = new FormControl(null, Validators.required);
  historiaMolestiaPregressa = new FormControl(null, Validators.required);
  remedios = new FormControl(null);
  objetivos = new FormControl(null);

  formPaciente = new FormGroup({
    id: this.id,
    dataCadastro: this.dataCadastro,
    nome: this.nome,
    cpf: this.cpf,
    dataNascimento: this.dataNascimento,
    telefone: this.telefone,
    whatsapp: this.whatsapp,
    email: this.email,
    contatoEmergencia: this.contatoEmergencia,
    parentescoContatoEmergencia: this.parentescoContatoEmergencia,
    cep: this.cep,
    logradouro: this.logradouro,
    numeroLogradouro: this.numeroLogradouro,
    bairro: this.bairro,
    cidade: this.cidade,
    estado: this.estado,
    profissao: this.profissao,
    diaVencimento: this.diaVencimento,
    frequenciaSemanal: this.frequenciaSemanal,
    queixaPrincipal: this.queixaPrincipal,
    historiaMolestiaPregressa: this.historiaMolestiaPregressa,
    remedios: this.remedios,
    objetivos: this.objetivos
  });

  parentescos: string[];
  enumParentescos = Parentesco;

  constructor(
    private activedRoute: ActivatedRoute,
    private pacienteService: PacienteService,
    private viaCepService: ViaCepService,
    private datePipe: DatePipe,
    private toastrService: ToastrService
  ) { 
    this.parentescos = Object.keys(Parentesco);
  }

  ngOnInit(): void {
    this.activedRoute.params.subscribe(params => {
      const id: number = params.id;
      if (id) {
        this.pacienteService.buscar(id).subscribe(paciente => {
          this.formPaciente.patchValue(paciente);
          this.dataCadastroFormatada = new Date(paciente.dataCadastro);
        });
      }
    });
  }

  consultaCep = (cep: string) => {
    cep = cep.replace('-', '');
    this.logradouro.setValue('');
    this.bairro.setValue('');
    this.cidade.setValue('');
    this.estado.setValue('');
    this.viaCepService.consultarCep(cep).subscribe({
      next: endereco => {
        if (endereco.erro) {
          this.toastrService.warning('CEP n??o encontrado', 'Aten????o');
        } else {
          this.logradouro.setValue(endereco.logradouro);
          this.bairro.setValue(endereco.bairro);
          this.cidade.setValue(endereco.localidade);
          this.estado.setValue(endereco.uf);
        }
      },
      error: () => {
        this.toastrService.error('Erro ao consultar o CEP', 'Erro de processamento');
      }
    });
  }

  gravar(): void {
    this.formEnviado = true;
    if (this.formPaciente.valid) {
      console.log(this.formPaciente.value);
      this.pacienteService.gravar(this.formPaciente.value).subscribe({
        next: paciente => {
          this.formPaciente.reset();
          this.formPaciente.patchValue(paciente);
          this.toastrService.success(`Dados do paciente ${paciente.nome} gravados com sucesso`, 'Cadastro');
        },
        error: objetoErro => {
          this.toastrService.error(objetoErro.error.message, 'Erro de Processamento');
        }
      });
    }
    else {
      this.toastrService.warning('Dados obrigat??rios n??o foram todos preenchidos', 'Aten????o');
    }
  }

}
