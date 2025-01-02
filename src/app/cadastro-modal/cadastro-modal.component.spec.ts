import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroModalComponent } from './cadastro-modal.component';

describe('CadastroModalComponent', () => {
  let component: CadastroModalComponent;
  let fixture: ComponentFixture<CadastroModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroModalComponent]
    });
    fixture = TestBed.createComponent(CadastroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
