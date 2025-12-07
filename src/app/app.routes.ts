import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { FaqComponent } from './components/faq/faq.component';
import { MainComponent } from './components/main/main.component';
import { ContactComponent } from './components/contact/contact.component';
import { authGuard } from './guards/auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { PaymentComponent } from './components/payment/payment.component';
import { LoaderComponent } from './components/loader/loader.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';


import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { PromoteUserComponent } from './components/promote-user/promote-user.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { PromoEmailComponent } from './components/promo-email/promo-email.component';
import { Routes } from '@angular/router';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component';


export const routes: Routes = [

  { path: '', component: MainComponent, title: 'Home' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'cart', component: CartComponent, title: 'Cart' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Signup' },
  { path: 'faq', component: FaqComponent, title: 'FAQ' },
  { path: 'main', component: MainComponent, title: 'Main' },
  { path: 'contact', component: ContactComponent, title: 'Contact' },
  { path: 'payment', component: PaymentComponent, title: 'Payment' },
  { path: 'loader', component: LoaderComponent, title: 'Loader' },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard], data: { roles: ['User', 'Admin'] } },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], data: { roles: ['User', 'Admin'] } },
  { path: 'change-password', component: ChangePasswordComponent},
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [authGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ManageProductsComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'add-user', component: AddUserComponent },
      { path: 'promote-user', component: PromoteUserComponent },
      { path: 'promo-email', component: PromoEmailComponent },
      { path: 'manage-orders', component: ManageOrdersComponent }
    ]
  }
];
