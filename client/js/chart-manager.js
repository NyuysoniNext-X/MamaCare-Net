// client/js/chart-manager.js - Universal Chart Manager
// This prevents ALL chart duplication across your entire app

window.ChartManager = {
    charts: {},  // Store all chart instances
    initialized: false,

    // Initialize the manager
    init: function() {
        if (this.initialized) {
            console.log('ChartManager already initialized');
            return;
        }

        console.log('🎯 ChartManager initializing...');
        this.initialized = true;

        // Kill all existing charts on page load
        this.destroyAllCharts();

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            this.destroyAllCharts();
        });

        // Also clean up when page is hidden (navigation)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.destroyAllCharts();
            }
        });
    },

    // Create or update a chart
    createChart: function(id, type, data, options = {}) {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded!');
            return null;
        }

        // Destroy existing chart if it exists
        this.destroyChart(id);

        // Get canvas element
        const canvas = document.getElementById(id);
        if (!canvas) {
            console.error(`Canvas with id "${id}" not found`);
            return null;
        }

        // Clear the canvas completely
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create new chart
        try {
            const newChart = new Chart(ctx, {
                type: type,
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false, // CRITICAL: Disable animations
                    ...options
                }
            });

            // Store chart instance
            this.charts[id] = newChart;
            console.log(`✅ Chart "${id}" created`);
            return newChart;
        } catch (error) {
            console.error(`Error creating chart "${id}":`, error);
            return null;
        }
    },

    // Destroy a specific chart
    destroyChart: function(id) {
        if (this.charts[id]) {
            try {
                this.charts[id].destroy();
                console.log(`🗑️ Chart "${id}" destroyed`);
            } catch (e) {
                console.warn(`Error destroying chart "${id}":`, e);
            }
            delete this.charts[id];
        }
    },

    // Destroy ALL charts
    destroyAllCharts: function() {
        console.log('🗑️ Destroying ALL charts...');
        Object.keys(this.charts).forEach(id => {
            try {
                this.charts[id].destroy();
            } catch (e) {
                // Ignore errors
            }
        });
        this.charts = {};
    },

    // Update chart data without recreating
    updateChartData: function(id, newData) {
        if (this.charts[id]) {
            this.charts[id].data = newData;
            this.charts[id].update();
            return true;
        }
        return false;
    },

    // Refresh canvas (use before creating new chart)
    refreshCanvas: function(id) {
        const canvas = document.getElementById(id);
        if (canvas) {
            const parent = canvas.parentNode;
            const newCanvas = document.createElement('canvas');
            newCanvas.id = id;
            newCanvas.style.width = '100%';
            newCanvas.style.height = '300px';
            parent.replaceChild(newCanvas, canvas);
            return newCanvas;
        }
        return null;
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ChartManager.init());
} else {
    ChartManager.init();
}