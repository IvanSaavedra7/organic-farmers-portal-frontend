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
        nome: "Feira Agroecológica do Parque",
        tipo: "feira",
        descricaoFuncionamento: "TODOS OS DOMINGOS DAS 7H ÀS 14H",
        contatos: {
          whatsapp: "https://wa.me/5511933333333",
          email: "feira.parque@email.com",
          instagram: "https://www.instagram.com/feiraagroparque"
        },
        tiposProdutos: ["frutas", "legumes", "hortaliças", "produtos processados"],
        regiao: "sul",
        cidade: "Campinas",
        estado: "SP",
        rua: "Avenida do Parque, 1000",
        bairro: "Parque da Cidade",
        cep: "04567-890",
        descricaoHistoria: "Feira que reúne produtores agroecológicos da região metropolitana de Campinas.",
        imagens: [imagensBase64.imagem1]
      },
      {
        nome: "Mercado Municipal Orgânico",
        tipo: "mercado",
        descricaoFuncionamento: "SEGUNDA A SÁBADO DAS 6H ÀS 18H",
        contatos: {
          whatsapp: "https://wa.me/5511922222222",
          email: "mercado.organico@email.com",
          instagram: "https://www.instagram.com/mercadomunicipalorganico"
        },
        tiposProdutos: ["frutas", "legumes", "hortaliças", "laticínios", "carnes", "cereais"],
        regiao: "centro",
        cidade: "Campinas",
        estado: "SP",
        rua: "Rua da Cantareira, 306",
        bairro: "Centro",
        cep: "01024-900",
        descricaoHistoria: "Mercado tradicional com seção dedicada a produtos orgânicos e agroecológicos.",
        imagens: [imagensBase64.imagem2]
      },
      {
        nome: "CSA Comunidade que Sustenta a Agricultura",
        tipo: "mercado",
        descricaoFuncionamento: "ENTREGAS SEMANAIS AOS SÁBADOS",
        contatos: {
          whatsapp: "https://wa.me/5511966666666",
          email: "csa.sp@email.com",
          instagram: "https://www.instagram.com/csasaopaulo"
        },
        tiposProdutos: ["frutas", "legumes", "hortaliças"],
        regiao: "leste",
        cidade: "Campinas",
        estado: "SP",
        rua: "Rua das Hortênsias, 123",
        bairro: "Jardim Anália Franco",
        cep: "03334-050",
        descricaoHistoria: "Grupo de consumo responsável que apoia diretamente os produtores locais.",
        imagens: [imagensBase64.imagem3]
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
          whatsapp: "https://wa.me/5511955555555",
          email: "horta.vidaverde@email.com",
          instagram: "https://www.instagram.com/hortavidaverde"
        },
        tiposProdutos: ["hortaliças", "ervas"],
        regiao: "oeste",
        cidade: "Campinas",
        estado: "SP",
        rua: "Rua das Hortênsias, 456",
        bairro: "Jardim das Flores",
        cep: "05678-901",
        descricaoHistoria: "Projeto comunitário que produz alimentos orgânicos e promove educação ambiental.",
        produtos: ["alface", "rúcula", "coentro", "salsa", "cebolinha"],
        imagens: [imagensBase64.imagem4]
      },
      {
        nome: "Granja Feliz",
        tipo: "produtor",
        descricaoFuncionamento: "VENDAS DIRETAS DE SEGUNDA A SÁBADO DAS 7H ÀS 18H",
        contatos: {
          whatsapp: "https://wa.me/5511944444444",
          email: "granja.feliz@email.com",
          instagram: "https://www.instagram.com/granjafeliz"
        },
        tiposProdutos: ["ovos", "aves"],
        regiao: "norte",
        cidade: "Campinas",
        estado: "SP",
        rua: "Estrada da Granja, 789",
        bairro: "Cantareira",
        cep: "02345-678",
        descricaoHistoria: "Granja familiar especializada em ovos orgânicos e aves criadas soltas.",
        produtos: ["ovos orgânicos", "frango caipira", "ovos de codorna"],
        imagens: [imagensBase64.imagem5]
      },
      {
        nome: "Sítio Fruta Pura",
        tipo: "produtor",
        descricaoFuncionamento: "ATENDIMENTO COM AGENDAMENTO PRÉVIO",
        contatos: {
          whatsapp: "https://wa.me/5511977777777",
          email: "sitio.frutapura@email.com",
          instagram: "https://www.instagram.com/sitiofrutapura"
        },
        tiposProdutos: ["frutas"],
        regiao: "sul",
        cidade: "Campinas",
        estado: "SP",
        rua: "Estrada do Sítio, 1010",
        bairro: "Parelheiros",
        cep: "04896-000",
        descricaoHistoria: "Sítio especializado em frutas orgânicas, com foco em variedades nativas.",
        produtos: ["banana", "goiaba", "jabuticaba", "pitanga", "acerola"],
        imagens: [imagensBase64.imagem6]
      },
      {
        nome: "Laticínios da Serra",
        tipo: "produtor",
        descricaoFuncionamento: "LOJA ABERTA DE TERÇA A DOMINGO DAS 8H ÀS 18H",
        contatos: {
          whatsapp: "https://wa.me/5511988888888",
          email: "laticinios.serra@email.com",
          instagram: "https://www.instagram.com/laticiniosdoserra"
        },
        tiposProdutos: ["laticínios"],
        regiao: "leste",
        cidade: "Campinas",
        estado: "SP",
        rua: "Estrada da Serra, 2020",
        bairro: "São Mateus",
        cep: "03950-000",
        descricaoHistoria: "Produção artesanal de queijos e iogurtes com leite de vacas criadas em pasto orgânico.",
        produtos: ["queijo minas", "queijo coalho", "iogurte natural", "manteiga"],
        imagens: [imagensBase64.imagem7]
      },
      {
        nome: "Mel do Jatobá",
        tipo: "produtor",
        descricaoFuncionamento: "VENDAS ONLINE E ENTREGA A COMBINAR",
        contatos: {
          whatsapp: "https://wa.me/5511999999999",
          email: "mel.jatoba@email.com",
          instagram: "https://www.instagram.com/meldojatoba"
        },
        tiposProdutos: ["mel"],
        regiao: "oeste",
        cidade: "Campinas",
        estado: "SP",
        rua: "Rua das Abelhas, 500",
        bairro: "Jaguaré",
        cep: "05347-000",
        descricaoHistoria: "Apiário urbano que produz mel orgânico e promove a conservação das abelhas nativas.",
        produtos: ["mel de flores silvestres", "própolis", "pólen"],
        imagens: [imagensBase64.imagem8]
      }
    ];

    for (const produtor of produtores) {
      await this.dbService.addProdutor(produtor);
    }
  }
}