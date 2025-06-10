import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category, Product } from '../../../../shared/models/products';
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
  categories: Category[] = [];
  products: Product[] = [];
  private subscription = new Subscription();
  selectedFile: File | null = null;
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

  // Paginación
  currentPage = 1;
  itemsPerPage = 5;

  // Valor total inventario
  totalInventoryValue = 0;

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
    this.getAllCategorys();
    this.getAllProducts();
  }

  // Paginación
  get pagedProducts() {
    if (!this.products) return [];
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil((this.products?.length || 0) / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
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
      this.selectedProduct.presentations[0]._id != null &&
      this.editStock != null
    ) {
      const presentationId = this.selectedProduct.presentations[0]._id;
      const updateProductToSend = {
        presentationId,
        newStock: this.editStock,
      };
      this.subscription.add(
        this.productsService
          .updateProduct(this.selectedProduct._id, updateProductToSend)
          .subscribe({
            next: (data) => {
              this.products = data;
              this.updateTotalInventoryValue();
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
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el stock. Inténtalo de nuevo.',
              });
            },
          })
      );
    }
  }

  // Actualiza productos y valor total
  async getAllProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this.productsService.getAllProducts().subscribe({
          next: (data) => {
            this.products = data;
            this.updateTotalInventoryValue();
            this.cdRef.detectChanges();
            resolve();
          },
          error: (err) => reject(err)
        })
      );
    });
  }

  getAllCategorys(): void {
    this.subscription.add(
      this.productsService.getAllCategorys().subscribe({
        next: (data) => {
          this.categories = data;
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
    this.cdRef.detectChanges();
  }

  closeModal() {
    this.modalOpen = false;
    this.modalOpenEdit = false;
    this.modalView = false;
    this.selectedProduct = null;
    this.editStock = null;
    this.cdRef.detectChanges();
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
    if (files.length + this.form.images.length > 1) {
      alert('Solo puedes añadir hasta 1 imágenes.');
      return;
    }
    if (files.length > 0) {
      this.selectedFile = files[0];
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.form.images = [reader.result];
    };
    if (this.selectedFile) reader.readAsDataURL(this.selectedFile);
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

    const formData = new FormData();

    formData.append('name', this.form.name.trim());
    formData.append('description', this.form.description.trim());
    formData.append('categoryId', this.form.category);

    formData.append('presentations', JSON.stringify(this.form.presentations.map((presentation: any) => ({
      _id: presentation._id ?? undefined,
      dimension: {
        widthInCm: this.form.dimensions.width ?? 0,
        heightInCm: this.form.dimensions.height ?? 0,
      },
      volumeMl: this.form.volume.single ?? 0,
      price: this.form.price ?? 0,
      stock: this.form.stock ?? 0,
    }))));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    Swal.fire({
      title: 'Creando producto...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await this.createProduct(formData);
      await this.getAllProducts();  // Espera a que termine la recarga
      Swal.fire({
        icon: 'success',
        title: '¡Producto creado!',
        text: 'El producto se creó correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });
      this.closeModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear el producto',
        text: 'Ocurrió un problema. Inténtalo nuevamente.',
      });
    }
  }

  async createProduct(formData: FormData): Promise<any> {
    return await this.productsService.createProduct(formData);
  }

  // Cálculo y actualización del valor total del inventario
  updateTotalInventoryValue() {
    this.totalInventoryValue = this.calculateTotalInventoryValue();
    this.cdRef.detectChanges();
  }

  calculateTotalInventoryValue(): number {
    if (!this.products || this.products.length === 0) return 0;
    return this.products.reduce((total, product) => {
      const presentation = this.getActivePresentation(product);
      if (!presentation) return total;
      return total + (presentation.price * presentation.stock);
    }, 0);
  }

  viewProduct(product: Product) {
    this.modalView = true;
    if (!product._id) {
      console.error('El producto no tiene un _id definido.');
      return;
    }
    this.selectedProduct = product;
    if (!(product._id in this.selectedPresentationIndex)) {
      this.selectedPresentationIndex[product._id] = 0;
    }
  }

  editProduct(product: Product) {
    this.selectedProduct = product;
    this.editStock = product.presentations[0]?.stock ?? 0;
    this.modalOpenEdit = true;
    this.cdRef.detectChanges();
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
            let resultado = data.statusCode;
            if (resultado == 200) {
              this.getAllProducts().then(() => this.updateTotalInventoryValue());
              Swal.fire('Se elimino', 'El producto.', 'success');
            } else {
              Swal.fire(
                'No se elimino',
                'Ocurrio un error inesperado',
                'error'
              );
            }
          },
        })
      );
    });
  }
}
