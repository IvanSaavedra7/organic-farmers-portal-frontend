import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatabaseService } from '../database.service';
import { IPontoDistribuicao, IProdutor } from '../models/produtor.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

    filterForm: FormGroup;
    items: (IProdutor | IPontoDistribuicao)[] = [];
    produtosList: string[] = [];
    tiposProdutos: string[] = ['legumes', 'hortaliças', 'frutas', 'grãos', 'laticínios', 'animal'];
    regioes: string[] = ['sul', 'leste', 'norte', 'oeste', 'centro'];
    tiposLocal: string[] = ['produtor', 'feira', 'mercado'];
  
    constructor(
      private route: ActivatedRoute,
    private fb: FormBuilder,
    private dbService: DatabaseService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
    ) {
      this.filterForm = this.fb.group({
        nome: [''],
        tipoLocal: [''],
        tipoProduto: [''],
        regiao: [''],
        cep: [''],
        produtos:[''],
      });
    }
  
    ngOnInit() {
      this.registerCustomIcons();

      this.route.queryParams.subscribe(params => {
        if (params['tipoProduto']) {
          this.filterForm.patchValue({ tipoProduto: params['tipoProduto'] });
        }
        if (params['tipoLocal']) {
          this.filterForm.patchValue({ tipoLocal: params['tipoLocal'] });
        }
        if (params['nome']) {
          this.filterForm.patchValue({ nome: params['nome'] });
        }
        this.onSubmit(); // Aplica os filtros automaticamente
      });

      this.loadItems();
      this.setupFormListeners();
      this.setUserLocation();
      
    }
  
    private registerCustomIcons() {
      this.matIconRegistry.addSvgIcon(
        'whatsapp',
        this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/whatsapp.svg')
      );
      this.matIconRegistry.addSvgIcon(
        'instagram',
        this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/instagram.svg')
      );
      console.log("chamou registerCustomIcons")      
    }

    async loadItems() {
      this.items = await this.dbService.getAllItems();
      console.log(this.items)
      this.extractUniqueProducts();
    }
  
    extractUniqueProducts() {
      const allProducts = this.items
        .filter((item): item is IProdutor => 'produtos' in item)
        .flatMap(p => p.produtos);
      this.produtosList = [...new Set(allProducts)];
    }
  
    setupFormListeners() {
      this.filterForm.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(() => this.onSubmit());
    }
  
    setUserLocation() {
      const userAddress = JSON.parse(localStorage.getItem('userAddress') || '{}');
      if (userAddress.postcode) {
        this.filterForm.patchValue({ cep: userAddress.postcode });
      }
    }
  
    async onSubmit() {
      const filters = this.filterForm.value;
      const allItems = await this.dbService.getAllItems();
  
      this.items = allItems.filter(item => {
        return this.matchesFilter(item, filters);
      });
  
      if (filters.cep) {
        this.items.sort((a, b) => this.compareDistance(a, b, filters.cep));
      }
    }
  
    matchesFilter(item: IProdutor | IPontoDistribuicao, filters: any): boolean {
      return (!filters.nome || this.fuzzyMatch(item.nome, filters.nome)) &&
             (!filters.tipoLocal || item.tipo === filters.tipoLocal) &&
             (!filters.tipoProduto || ('tiposProdutos' in item && item.tiposProdutos.includes(filters.tipoProduto))) &&
             (!filters.regiao || item.regiao === filters.regiao) &&
             this.matchesProdutos(item, filters.produtos);
    }
    
    private matchesProdutos(item: IProdutor | IPontoDistribuicao, selectedProdutos: string[]): boolean {
      if (!selectedProdutos || selectedProdutos.length === 0) {
        return true; // Se nenhum produto for selecionado, não filtra por produtos
      }
    
      if ('produtos' in item) {
        // Para produtores
        return selectedProdutos.some(produto => item.produtos.includes(produto));
      } else if ('tiposProdutos' in item) {
        // Para pontos de distribuição
        return selectedProdutos.some(produto => item.tiposProdutos.includes(produto));
      }
    
      return false;
    }
  
    fuzzyMatch(source: string, target: string): boolean {
      const sourceNormalized = source.toLowerCase().replace(/\s+/g, '');
      const targetNormalized = target.toLowerCase().replace(/\s+/g, '');
      return sourceNormalized.includes(targetNormalized);
    }
  
    compareDistance(a: IProdutor | IPontoDistribuicao, b: IProdutor | IPontoDistribuicao, targetCep: string): number {
      // Implementar lógica de comparação de distância aqui
      // Por enquanto, vamos usar uma comparação simples de CEP
      return Math.abs(parseInt(a.cep) - parseInt(targetCep)) - 
             Math.abs(parseInt(b.cep) - parseInt(targetCep));
    }
  
    isProdutor(item: IProdutor | IPontoDistribuicao): item is IProdutor {
      return 'produtos' in item;
    }
    
    isPontoDistribuicao(item: IProdutor | IPontoDistribuicao): item is IPontoDistribuicao {
      return !('produtos' in item);
    }
  
    clearFilters() {
      this.filterForm.reset();
      this.loadItems();
    }

}
