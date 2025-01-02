import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { IPontoDistribuicao, IProdutor } from './models/produtor.model';
import { imagensBase64 } from './image-data';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor(private dbService: DatabaseService) {}

  async initializeMockData() {
    const produtoresCount = await this.dbService.produtores.count();
    const pontosDistribuicaoCount = await this.dbService.pontosDistribuicao.count();

    if (produtoresCount === 0 && pontosDistribuicaoCount === 0) {
      await this.createMockPontosDistribuicao();
      await this.createMockProdutores();
    }
  }

  private async createMockPontosDistribuicao() {
    const pontosDistribuicao: IPontoDistribuicao[] = [
      {
        nome: "Feira Agroecológica do Parque Taquaral",
        tipo: "feira",
        descricaoFuncionamento: "TODOS OS DOMINGOS DAS 7H ÀS 14H",
        contatos: {
          whatsapp: "https://wa.me/5519933333333",
          email: "feira.taquaral@email.com",
          instagram: "https://www.instagram.com/feiraagroparquetaquaral"
        },
        tiposProdutos: ["frutas", "legumes", "hortaliças", "produtos processados"],
        regiao: "norte",
        cidade: "Campinas",
        estado: "SP",
        rua: "Av. Heitor Penteado, s/n",
        bairro: "Parque Taquaral",
        cep: "13087-000",
        descricaoHistoria: "Feira que reúne produtores agroecológicos da região metropolitana de Campinas.",
        imagens: [imagensBase64.imagem1],
        latitude: -22.8718,
        longitude: -47.0585
      },
      {
        nome: "Mercado Municipal de Campinas",
        tipo: "mercado",
        descricaoFuncionamento: "SEGUNDA A SÁBADO DAS 6H ÀS 18H",
        contatos: {
          whatsapp: "https://wa.me/5519922222222",
          email: "mercado.campinas@email.com",
          instagram: "https://www.instagram.com/mercadomunicipalcampinas"
        },
        tiposProdutos: ["frutas", "legumes", "hortaliças", "laticínios", "carnes", "cereais"],
        regiao: "centro",
        cidade: "Campinas",
        estado: "SP",
        rua: "R. Benjamim Constant, 1.890",
        bairro: "Centro",
        cep: "13010-140",
        descricaoHistoria: "Mercado tradicional com seção dedicada a produtos orgânicos e agroecológicos.",
        imagens: [imagensBase64.imagem2],
        latitude: -22.9032,
        longitude: -47.0573
      },
      {
        nome: "CSA Comunidade que Sustenta a Agricultura - Campinas",
        tipo: "mercado",
        descricaoFuncionamento: "ENTREGAS SEMANAIS AOS SÁBADOS",
        contatos: {
          whatsapp: "https://wa.me/5519966666666",
          email: "csa.campinas@email.com",
          instagram: "https://www.instagram.com/csacampinas"
        },
        tiposProdutos: ["frutas", "legumes", "hortaliças"],
        regiao: "leste",
        cidade: "Campinas",
        estado: "SP",
        rua: "R. Erasmo Braga, 289",
        bairro: "Jardim Chapadão",
        cep: "13070-147",
        descricaoHistoria: "Grupo de consumo responsável que apoia diretamente os produtores locais.",
        imagens: [imagensBase64.imagem3],
        latitude: -22.8934,
        longitude: -47.0626
      }
    ];

    for (const ponto of pontosDistribuicao) {
      await this.dbService.addPontoDistribuicao(ponto);
    }
  }

  private async createMockProdutores() {
    const produtores: IProdutor[] = [
      {
        nome: "Horta Comunitária Vida Verde",
        tipo: "produtor",
        descricaoFuncionamento: "ABERTO PARA VISITAS DE TERÇA A DOMINGO DAS 9H ÀS 17H",
        contatos: {
          whatsapp: "https://wa.me/5519955555555",
          email: "horta.vidaverde@email.com",
          instagram: "https://www.instagram.com/hortavidaverde"
        },
        tiposProdutos: ["hortaliças", "ervas"],
        regiao: "oeste",
        cidade: "Campinas",
        estado: "SP",
        rua: "R. Moscou, 100",
        bairro: "Jardim Nova Europa",
        cep: "13040-205",
        descricaoHistoria: "Projeto comunitário que produz alimentos orgânicos e promove educação ambiental.",
        produtos: ["alface", "rúcula", "coentro", "salsa", "cebolinha"],
        imagens: [imagensBase64.imagem4],
        latitude: -22.9314,
        longitude: -47.0878
      },
      {
        nome: "Granja Feliz",
        tipo: "produtor",
        descricaoFuncionamento: "VENDAS DIRETAS DE SEGUNDA A SÁBADO DAS 7H ÀS 18H",
        contatos: {
          whatsapp: "https://wa.me/5519944444444",
          email: "granja.feliz@email.com",
          instagram: "https://www.instagram.com/granjafeliz"
        },
        tiposProdutos: ["ovos", "aves"],
        regiao: "norte",
        cidade: "Campinas",
        estado: "SP",
        rua: "Estrada Municipal CAM 127, s/n",
        bairro: "Jardim Monte Belo",
        cep: "13082-755",
        descricaoHistoria: "Granja familiar especializada em ovos orgânicos e aves criadas soltas.",
        produtos: ["ovos orgânicos", "frango caipira", "ovos de codorna"],
        imagens: [imagensBase64.imagem5],
        latitude: -22.8464,
        longitude: -47.0353
      },
      {
        nome: "Sítio Fruta Pura",
        tipo: "produtor",
        descricaoFuncionamento: "ATENDIMENTO COM AGENDAMENTO PRÉVIO",
        contatos: {
          whatsapp: "https://wa.me/5519977777777",
          email: "sitio.frutapura@email.com",
          instagram: "https://www.instagram.com/sitiofrutapura"
        },
        tiposProdutos: ["frutas"],
        regiao: "sul",
        cidade: "Campinas",
        estado: "SP",
        rua: "Estrada do Capricórnio, 1010",
        bairro: "Joaquim Egídio",
        cep: "13108-090",
        descricaoHistoria: "Sítio especializado em frutas orgânicas, com foco em variedades nativas.",
        produtos: ["banana", "goiaba", "jabuticaba", "pitanga", "acerola"],
        imagens: [imagensBase64.imagem6],
        latitude: -22.9213,
        longitude: -46.9356
      },
      {
        nome: "Laticínios da Serra",
        tipo: "produtor",
        descricaoFuncionamento: "LOJA ABERTA DE TERÇA A DOMINGO DAS 8H ÀS 18H",
        contatos: {
          whatsapp: "https://wa.me/5519988888888",
          email: "laticinios.serra@email.com",
          instagram: "https://www.instagram.com/laticiniosdoserra"
        },
        tiposProdutos: ["laticínios"],
        regiao: "leste",
        cidade: "Campinas",
        estado: "SP",
        rua: "Estrada Municipal CAM 367, km 3",
        bairro: "Gargantilha",
        cep: "13098-392",
        descricaoHistoria: "Produção artesanal de queijos e iogurtes com leite de vacas criadas em pasto orgânico.",
        produtos: ["queijo minas", "queijo coalho", "iogurte natural", "manteiga"],
        imagens: [imagensBase64.imagem7],
        latitude: -22.8685,
        longitude: -46.9735
      },
      {
        nome: "Mel do Jatobá",
        tipo: "produtor",
        descricaoFuncionamento: "VENDAS ONLINE E ENTREGA A COMBINAR",
        contatos: {
          whatsapp: "https://wa.me/5519999999999",
          email: "mel.jatoba@email.com",
          instagram: "https://www.instagram.com/meldojatoba"
        },
        tiposProdutos: ["mel"],
        regiao: "oeste",
        cidade: "Campinas",
        estado: "SP",
        rua: "R. Serra Dourada, 500",
        bairro: "Jardim São Fernando",
        cep: "13100-320",
        descricaoHistoria: "Apiário urbano que produz mel orgânico e promove a conservação das abelhas nativas.",
        produtos: ["mel de flores silvestres", "própolis", "pólen"],
        imagens: [imagensBase64.imagem8],
        latitude: -22.9505,
        longitude: -47.1097
      }
    ];

    for (const produtor of produtores) {
      await this.dbService.addProdutor(produtor);
    }
  }
}