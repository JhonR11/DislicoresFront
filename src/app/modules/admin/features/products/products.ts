import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProduct } from '../../../../shared/models/create-products.model';
import { Product } from '../../../../shared/models/products';
import { ProductsService } from './service/products.service';
import { Subscription } from 'rxjs';
import { showDeleteModal } from '../../../../shared/components/detail-modal/delete-modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styles: ``,
})
export default class ProductComponent implements OnInit {
  products: Product[] = [];
  private subscription = new Subscription();
  categories: string[] = ['destilados', 'fermentados'];
  selectedPresentationIndex: { [productId: string]: number } = {};
  modalOpenEdit = false;
  modalView = false;
  modalOpen = false;
  selectedProduct: Product | null = null;
  editStock: number | null = null;
  formError = false;
  checkboxes = {
    default: false,
    checked: true,
  };

  form = {
    name: '',
    description: '',
    images: [] as (string | ArrayBuffer | null)[],
    category: '',
    presentations: [] as string[],
    dimensions: { height: null as number | null, width: null as number | null },
    volume: {
      large: null as number | null,
      small: null as number | null,
      single: null as number | null,
    },
    price: null as number | null,
    stock: null as number | null,
  };

  constructor(
    private cdRef: ChangeDetectorRef,

    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {
    this.getAllProducts();
    this.loadCheckboxes();
  }

  ngOnInit() {
    this.getAllProducts();
  }

  getActivePresentation(product: Product) {
    const idx = this.selectedPresentationIndex[product._id ?? ''] ?? 0;
    return product.presentations[idx];
  }

  showNextPresentation(product: Product) {
    const currentIndex = this.selectedPresentationIndex[product._id ?? ''] ?? 0;
    const nextIndex = (currentIndex + 1) % product.presentations.length;
    this.selectedPresentationIndex[product._id ?? ''] = nextIndex;
  }

  showPrevPresentation(product: Product) {
    const currentIndex = this.selectedPresentationIndex[product._id ?? ''] ?? 0;
    const prevIndex =
      (currentIndex - 1 + product.presentations.length) %
      product.presentations.length;
    this.selectedPresentationIndex[product._id ?? ''] = prevIndex;
  }

  async saveStock() {
    if (
      this.modalOpenEdit &&
      this.selectedProduct?._id &&
      this.selectedProduct.presentations.length > 0 &&
      this.selectedProduct.presentations[0]._id != null
    ) {
      const presentationId = this.selectedProduct.presentations[0]._id;
      const updateProductToSend = {
        presentationId,
        newStock: 12,
      };
      this.subscription.add(
        this.productsService
          .updateProduct(this.selectedProduct._id, updateProductToSend)
          .subscribe({
            next: (data) => {
              this.products = data;
              Swal.fire({
                icon: 'success',
                title: 'Stock actualizado',
                text: 'El stock se guardó correctamente',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.closeModalEdit();
                  this.getAllProducts();
                }
              });
            },
            error: () => {
              console.error('Error al actualizar stock');
            },
          })
      );
    }
  }

  getAllProducts(): void {
    this.subscription.add(
      this.productsService.getAllProducts().subscribe({
        next: (data) => {
          this.products = data;
          this.cdRef.detectChanges();
        },
      })
    );
  }

  saveCheckboxes(): void {
    localStorage.setItem('checkboxes', JSON.stringify(this.checkboxes));
  }

  loadCheckboxes(): void {
    const data = localStorage.getItem('checkboxes');
    if (data) {
      this.checkboxes = JSON.parse(data);
    }
  }

  openModal() {
    this.resetForm();
    this.modalOpen = true;
    this.formError = false;
  }

  closeModal() {
    this.modalOpen = false;
    this.modalOpenEdit = false;
    this.modalView = false;
    this.selectedProduct = null;
    this.editStock = null;
  }

  closeModalEdit() {
    this.modalOpenEdit = false;
    this.selectedProduct = null;
    this.editStock = null;
    this.cdRef.detectChanges();
  }

  resetForm() {
    this.form = {
      name: '',
      description: '',
      images: [],
      category: '',
      presentations: [],
      dimensions: { height: null, width: null },
      volume: { large: null, small: null, single: null },
      price: null,
      stock: null,
    };
  }

  onImageChange(event: any) {
    const files = event.target.files;
    if (files.length + this.form.images.length > 3) {
      alert('Solo puedes añadir hasta 3 imágenes.');
      return;
    }

    for (let i = 0; i < files.length && this.form.images.length < 3; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.images.push(reader.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  validateForm(): boolean {
    const {
      name,
      description,
      category,
      presentations,
      dimensions,
      price,
      stock,
      images,
    } = this.form;

    if (
      !name.trim() ||
      !description.trim() ||
      !category ||
      presentations.length === 0 ||
      dimensions.height == null ||
      dimensions.height <= 0 ||
      dimensions.width == null ||
      dimensions.width <= 0 ||
      price == null ||
      price <= 0 ||
      stock == null ||
      stock <= 0 ||
      images.length === 0
    ) {
      return false;
    }

    if (presentations.length === 2) {
      return (
        this.form.volume.large != null &&
        this.form.volume.large > 0 &&
        this.form.volume.small != null &&
        this.form.volume.small > 0
      );
    } else if (presentations.length === 1) {
      return this.form.volume.single != null && this.form.volume.single > 0;
    }

    return false;
  }

  togglePresentation(p: string) {
    const index = this.form.presentations.indexOf(p);
    if (index === -1) {
      this.form.presentations.push(p);
    } else {
      this.form.presentations.splice(index, 1);
    }
  }

  async onSubmit() {
  if (!this.validateForm()) {
    this.formError = true;
    return;
  }
  this.formError = false;

  const newProduct: CreateProduct = {
    name: this.form.name.trim(),
    description: this.form.description.trim(),
    imageUrl: 'this.form.images.toString()', // sin comillas
    categoryId: '6842cc9937a6a83ce4f87f36',
    presentations: this.form.presentations.map((presentation: any) => ({
      _id: presentation._id ?? undefined,
      dimension: {
        widthInCm: this.form.dimensions.width ?? 0,
        heightInCm: this.form.dimensions.height ?? 0,
      },
      volumeMl: this.form.volume.single ?? 0,
      price: this.form.price ?? 0,
      stock: this.form.stock ?? 0,
    })),
  };

  // Mostrar alerta de carga
  Swal.fire({
    title: 'Creando producto...',
    text: 'Por favor espera',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    await this.createProduct(newProduct);

    // Éxito
    Swal.fire({
      icon: 'success',
      title: '¡Producto creado!',
      text: 'El producto se creó correctamente.',
      timer: 2000,
      showConfirmButton: false,
      
    });
    this.closeModal();
    this.getAllProducts();

  } catch (error) {
    // Error
    Swal.fire({
      icon: 'error',
      title: 'Error al crear el producto',
      text: 'Ocurrió un problema. Inténtalo nuevamente.',
    });
  }
}


  async createProduct(newProduct: CreateProduct): Promise<void> {
    await this.productsService.createProduct(newProduct);
    await this.getAllProducts();
  }

  viewProduct(product: Product) {
    this.modalView = true;
    this.selectedProduct = this.products[0];
  }

  editProduct(product: Product) {
    this.selectedProduct = product;
    this.editStock = product.presentations[0]?.stock ?? 0;
    this.modalOpenEdit = true;
  }

  deleteProduct(product: Product) {
    if (!product._id) {
      console.error('El producto no tiene un _id definido.');
      return;
    }
    showDeleteModal(product.name, () => {
      this.subscription.add(
      this.productsService.deleteProduct(product._id!).subscribe({
        next: (data) => {
          let resultado = data.statusCode
          this.cdRef.detectChanges();
          if(resultado==200){
            this.getAllProducts();
            Swal.fire(
            'Se elimino',
            'El producto.',
            'success'

          );
          }else{
            Swal.fire(
              'No se elimino',
              'Ocurrio un errro inesperado',
              'error'
            )
          }
        
        },
      })
    );
  });
}
}
