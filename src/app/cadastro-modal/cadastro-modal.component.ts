import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatabaseService } from '../database.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { IPontoDistribuicao, IProdutor } from '../models/produtor.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipGridChange, MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-cadastro-modal',
  templateUrl: './cadastro-modal.component.html',
  styleUrls: ['./cadastro-modal.component.scss']
})
export class CadastroModalComponent {
  form: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  fileName: string = '';

  separatorKeysCodes: number[] = [ENTER, COMMA];
  produtos: string[] = [];

  tiposProdutos = [
    { value: 'legumes', viewValue: '🥕 Legumes' },
    { value: 'hortalicas', viewValue: '🥬 Hortaliças' },
    { value: 'frutas', viewValue: '🍎 Frutas' },
    { value: 'graos', viewValue: '🌾 Grãos' },
    { value: 'tuberculos', viewValue: '🥔 Tubérculos' },
    { value: 'animal', viewValue: '🐮 Animal' },
  ];


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CadastroModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dbService: DatabaseService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(10)]],
      tipo: ['', Validators.required],
      whatsapp: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      instagram: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      descricaoHistoria: ['', [Validators.required, Validators.maxLength(500)]],
      descricaoFuncionamento: ['', [Validators.required, Validators.maxLength(500)]],
      cep: ['', [Validators.required, Validators.minLength(8)]],
      tiposProdutos: [[], [Validators.required, Validators.minLength(1)]],
      produtos: [[],[Validators.required, Validators.minLength(1)]],
      regiao: [{value: '', disabled: true}],
      cidade: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}],
      rua: [{value: '', disabled: true}],
      bairro: [{value: '', disabled: true}],
      latitude: [{value: '', disabled: true}],
      longitude: [{value: '', disabled: true}],
      imagem: [null, Validators.required]
    });
  }

  addProduto(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.produtos.push(value);
      this.form.patchValue({produtos: this.produtos});
    }
    event.chipInput!.clear();
  }

  removeProduto(produto: string): void {
    const index = this.produtos.indexOf(produto);
    if (index >= 0) {
      this.produtos.splice(index, 1);
      this.form.patchValue({produtos: this.produtos});
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB em bytes
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
          this.form.patchValue({imagem: reader.result as string});
        };
        reader.readAsDataURL(file);
        this.fileName = file.name;
      } else {
        this.snackBar.open('A imagem deve ter no máximo 5MB', 'Fechar', {duration: 5000});
      }
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.form.patchValue({imagem: null});
    this.fileName = '';
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const formData = this.form.getRawValue();
        console.log(formData.tiposProdutos)
        const commonData = {
          nome: formData.nome,
          descricaoFuncionamento: formData.descricaoFuncionamento,
          contatos: {
            whatsapp: `https://wa.me/55${formData.whatsapp.replace(/\D/g, '')}`,
            email: formData.email,
            instagram: formData.instagram.startsWith('https://www.instagram.com/') 
              ? formData.instagram 
              : `https://www.instagram.com/${formData.instagram}`
          },
          tiposProdutos: formData.tiposProdutos || [], 
          regiao: formData.regiao,
          cidade: formData.cidade,
          estado: formData.estado,
          rua: formData.rua,
          bairro: formData.bairro,
          cep: formData.cep,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          descricaoHistoria: formData.descricaoHistoria,
          produtos: formData.produtos || [],
          imagens: [formData.imagem] // Assumindo que você está enviando apenas uma imagem por enquanto
        };
  
        if (formData.tipo === 'produtor') {
          const produtorData: IProdutor = {
            ...commonData,
            tipo: 'produtor',
          };
          await this.dbService.addProdutor(produtorData);
        } else {
          const pontoDistribuicaoData: IPontoDistribuicao = {
            ...commonData,
            tipo: formData.tipo as 'feira' | 'mercado',
            diasFeira: formData.tipo === 'feira' ? formData.diasFeira || [] : undefined
          };
          console.log(pontoDistribuicaoData)
          await this.dbService.addPontoDistribuicao(pontoDistribuicaoData);
        }
  
        this.dialogRef.close(true);
        this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {duration: 5000, panelClass: ['success-snackbar']});
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
        this.snackBar.open('Erro ao realizar o cadastro', 'Fechar', {duration: 5000, panelClass: ['error-snackbar']});
      }
    } else {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios corretamente', 'Fechar', {duration: 5000, panelClass: ['warning-snackbar']});
    }
  }
  
  async buscarCEP() {
    const cep = this.form.get('cep')?.value.replace('-', '');
    if (cep && cep.length === 8) {
      try {
        const response = await this.http.get(`https://viacep.com.br/ws/${cep}/json/`).toPromise();
        const data = response as any;
        if (!data.erro) {
          this.form.patchValue({
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
            regiao: this.determinarRegiao(data.uf)
          });
          
          const geoResponse = await this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.logradouro + ',' + data.localidade + ',' + data.uf)}`).toPromise();
          const geoData = geoResponse as any[];
          if (geoData && geoData.length > 0) {
            this.form.patchValue({
              latitude: geoData[0].lat,
              longitude: geoData[0].lon
            });
          }
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  }

  determinarRegiao(uf: string): string {
    const regioes = {
      'Norte': ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
      'Nordeste': ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
      'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
      'Sudeste': ['ES', 'MG', 'RJ', 'SP'],
      'Sul': ['PR', 'RS', 'SC']
    };

    for (const [regiao, estados] of Object.entries(regioes)) {
      if (estados.includes(uf)) {
        return regiao;
      }
    }
    return '';
  }
}