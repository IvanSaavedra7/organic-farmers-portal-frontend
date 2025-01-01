export interface IProdutor {
    id?: number;
    nome: string;
    tipo: 'produtor';
    descricaoFuncionamento: string;
    contatos: {
      whatsapp?: string;
      email?: string;
      instagram?: string;
    };
    tiposProdutos: string[];
    regiao: string;
    cidade: string;
    estado: string;
    rua: string;
    bairro: string;
    cep:string;
    descricaoHistoria: string;
    produtos: string[];
    pontoDistribuicaoId?: number;
    imagens: string[]; // URLs ou base64 das imagens
  }
  
  // src/app/models/ponto-distribuicao.model.ts
  export interface IPontoDistribuicao {
    id?: number;
    nome: string;
    tipo: 'feira' | 'mercado';
    descricaoFuncionamento: string;
    contatos: {
      whatsapp?: string;
      email?: string;
      instagram?: string;
    };
    tiposProdutos: string[];
    regiao: string;
    cidade: string;
    estado: string;
    rua: string;
    bairro: string;
    cep:string;
    descricaoHistoria: string;
    imagens: string[]; // URLs ou base64 das imagens
    diasFeira?: string[]; // Apenas para feiras
  }