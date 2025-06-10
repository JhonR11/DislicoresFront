import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsService } from '../products/service/products.service'; // Ajusta la ruta
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styles: ``,
})
export default class Dashboard implements OnInit, OnDestroy {
  products: any[] = [];
  categories: any[] = [];
  private subscription = new Subscription();


  stockByCategoryChart: ApexCharts | null = null;
  inventoryDistributionChart: ApexCharts | null = null;

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.subscription.add(
      this.productsService.getAllCategorys().subscribe({
        next: (data) => {
          this.categories = data;
          this.tryRenderCharts();
        },
        error: (error) => console.error('Error al cargar categorías', error),
      })
    );
  }

  loadProducts() {
    this.subscription.add(
      this.productsService.getAllProducts().subscribe({
        next: (data) => {
          this.products = data;
          this.tryRenderCharts();
        },
        error: (error) => console.error('Error al cargar productos', error),
      })
    );
  }

  getActivePresentation(product: any) {
    return product.presentations[0]; 
  }

  getTotalInventoryValue(): number {
    let total = 0;
    for (const product of this.products) {
      const activePresentation = this.getActivePresentation(product);
      total += activePresentation.price * activePresentation.stock;
    }
    return total;
  }

  private tryRenderCharts() {
    if (this.products.length && this.categories.length) {
      this.renderStockByCategoryChart();
      this.renderInventoryDistributionChart();
    }
  }

  private renderStockByCategoryChart() {
  const categoryNames = this.categories.map(c => c.name);
  const stockPerCategory = categoryNames.map(name => {
    return this.products
      .filter(p => p.category.name === name)
      .reduce((acc, p) => acc + this.getActivePresentation(p).stock, 0);
  });

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
    
    },
    series: [{
      name: 'Stock',
      data: stockPerCategory,
    }],
    xaxis: {
      categories: categoryNames,
      labels: {
        style: {
          colors: '#111827', // texto oscuro
          fontSize: '14px',
        }
      },
      axisBorder: { color: '#d1d5db' },
      axisTicks: { color: '#d1d5db' },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#111827',
          fontSize: '14px',
        }
      }
    },
    colors: ['#3b82f6'],
    title: {
      text: 'Stock por Categoría',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#111827',
      },
    },
    grid: {
      borderColor: '#e5e7eb',
    },
  };

  if (this.stockByCategoryChart) {
    this.stockByCategoryChart.updateOptions(options);
  } else {
    this.stockByCategoryChart = new ApexCharts(document.querySelector("#stockByCategoryChart"), options);
    this.stockByCategoryChart.render();
  }
}

private renderInventoryDistributionChart() {
  const categoryNames = this.categories.map(c => c.name);
  const stockPerCategory = categoryNames.map(name => {
    return this.products
      .filter(p => p.category.name === name)
      .reduce((acc, p) => acc + this.getActivePresentation(p).stock, 0);
  });

  const options = {
    chart: {
      type: 'donut',
      height: 350,
 
    },
    series: stockPerCategory,
    labels: categoryNames,
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    title: {
      text: 'Distribución del Inventario',
      style: {
        fontSize: '19px',
        fontWeight: 'bold',
        color: '#111827',
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#111827',
      }
    },
    dataLabels: {
      style: {
        colors: ['#111827']
      }
    },
  };

  if (this.inventoryDistributionChart) {
    this.inventoryDistributionChart.updateOptions(options);
  } else {
    this.inventoryDistributionChart = new ApexCharts(document.querySelector("#inventoryDistributionChart"), options);
    this.inventoryDistributionChart.render();
  }
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.stockByCategoryChart?.destroy();
    this.inventoryDistributionChart?.destroy();
  }
}
