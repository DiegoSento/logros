// Datos de producción
const productionData = [
    { name: 'Bender', value: 800, color: '#4F46E5' },
    { name: 'Fracttal', value: 501, color: '#059669' },
    { name: 'Asimetrix', value: 16, color: '#D97706' },
    { name: 'Reparaciones y despachos', value: 25, color: '#FF0000' }
];

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing charts...');
    
    // Inicializar gráficas
    initBarChart();
    initPieChart();
    
    // Inicializar interactividad
    initInteractivity();
    
    // Animar números
    animateNumbers();
});

// Función para inicializar gráfico de barras
function initBarChart() {
    const ctx = document.getElementById('barChart');
    if (!ctx) {
        console.error('Canvas barChart not found');
        return;
    }
    
    console.log('Initializing bar chart...');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productionData.map(item => item.name),
            datasets: [{
                label: 'Unidades Producidas',
                data: productionData.map(item => item.value),
                backgroundColor: productionData.map(item => item.color),
                borderColor: productionData.map(item => item.color),
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toLocaleString() + ' unidades';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f3f4f6'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Función para inicializar gráfico de pastel
function initPieChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) {
        console.error('Canvas pieChart not found');
        return;
    }
    
    console.log('Initializing pie chart...');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: productionData.map(item => item.name),
            datasets: [{
                data: productionData.map(item => item.value),
                backgroundColor: productionData.map(item => item.color),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed * 100) / total).toFixed(1);
                            return context.label + ': ' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1500
            },
            cutout: '60%'
        }
    });
}

// Función para inicializar interactividad
function initInteractivity() {
    // Efecto hover en tarjetas de productos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('click', function() {
            const productName = this.querySelector('h4').textContent;
            const productInfo = productionData.find(p => p.name === productName);
            if (productInfo) {
                showProductModal(productInfo);
            }
        });
    });
    
    // Efecto click en círculo Diego
    const diegoCircle = document.querySelector('.diego-circle');
    if (diegoCircle) {
        diegoCircle.addEventListener('click', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.animation = 'float 3s ease-in-out infinite';
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // Efecto scroll para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.card, .product-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Función para mostrar modal de producto
function showProductModal(product) {
    const productDetails = {
        'Bender': 'Dispositivo médico avanzado para medir hidratación en orina con tecnología de sensores de precisión.',
        'Fracttal': 'Sensor industrial robusto con protocolo Modbus para aplicaciones de monitoreo en tiempo real.',
        'Asimetrix': 'Sistema de medición de alta precisión para aplicaciones especializadas en control de calidad.'
    };
    
    const detail = productDetails[product.name] || 'Información no disponible';
    
    alert(`${product.name}\n\nUnidades producidas: ${product.value.toLocaleString()}\n\nDescripción: ${detail}`);
}

// Función para animar números
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(numberEl => {
        const finalNumber = numberEl.textContent.replace(/,/g, '').replace('%', '');
        const isPercentage = numberEl.textContent.includes('%');
        const target = parseInt(finalNumber);
        
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (isPercentage) {
                numberEl.textContent = Math.floor(current) + '%';
            } else {
                numberEl.textContent = Math.floor(current).toLocaleString();
            }
        }, 30);
    });
}

// Función para exportar datos (bonus)
function exportData() {
    const data = {
        fecha: new Date().toLocaleDateString('es-ES'),
        productos: productionData,
        total: productionData.reduce((sum, item) => sum + item.value, 0),
        analista: 'Diego'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-calidad-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Agregar función de exportación al círculo Diego (doble click)
document.addEventListener('DOMContentLoaded', function() {
    const diegoCircle = document.querySelector('.diego-circle');
    if (diegoCircle) {
        diegoCircle.addEventListener('dblclick', exportData);
    }
});

// Debug: Verificar que Chart.js está cargado
if (typeof Chart !== 'undefined') {
    console.log('Chart.js loaded successfully');
} else {
    console.error('Chart.js not loaded');
}