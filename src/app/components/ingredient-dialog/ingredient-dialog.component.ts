import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IIngredients } from '../../models/ingredients.model';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredient-dialog',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './ingredient-dialog.component.html',
  styleUrls: ['./ingredient-dialog.component.css']
})
export class IngredientDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IIngredients[]) {}
}
