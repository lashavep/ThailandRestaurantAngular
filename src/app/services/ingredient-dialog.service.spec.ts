import { TestBed } from '@angular/core/testing';

import { IngredientDialogService } from './ingredient-dialog.service';

describe('IngredientDialogService', () => {
  let service: IngredientDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
