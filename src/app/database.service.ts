import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { IPontoDistribuicao, IProdutor } from './models/produtor.model';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {

  produtores: Dexie.Table<IProdutor, number>;
  pontosDistribuicao: Dexie.Table<IPontoDistribuicao, number>;

  constructor() {
    super('OrganicosDB');
    this.version(1).stores({
      produtores: '++id, nome, tipo, regiao, cidade, estado, pontoDistribuicaoId',
      pontosDistribuicao: '++id, nome, tipo, regiao, cidade, estado'
    });
    this.produtores = this.table('produtores');
    this.pontosDistribuicao = this.table('pontosDistribuicao');
  }

  async addProdutor(produtor: IProdutor): Promise<number> {
    return await this.produtores.add(produtor);
  }

  async addPontoDistribuicao(ponto: IPontoDistribuicao): Promise<number> {
    return await this.pontosDistribuicao.add(ponto);
  }

  async getProdutores(): Promise<IProdutor[]> {
    return await this.produtores.toArray();
  }

  async getPontosDistribuicao(): Promise<IPontoDistribuicao[]> {
    return await this.pontosDistribuicao.toArray();
  }

  async getAllItems(): Promise<(IProdutor | IPontoDistribuicao)[]> {
    const produtores = await this.produtores.toArray();
    const pontosDistribuicao = await this.pontosDistribuicao.toArray();
    return [...produtores, ...pontosDistribuicao];
  }

}
