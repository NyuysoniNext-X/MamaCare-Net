// server/utils/file-storage.js - File Storage Utilities

const fs = require('fs').promises;
const path = require('path');

class FileStorage {
    constructor(dataDir = path.join(__dirname, '../data')) {
        this.dataDir = dataDir;
        this.ensureDataDirectory();
    }

    // Ensure data directory exists
    async ensureDataDirectory() {
        try {
            await fs.access(this.dataDir);
        } catch (error) {
            await fs.mkdir(this.dataDir, { recursive: true });
        }
    }

    // Read data from file
    async read(fileName) {
        try {
            const filePath = path.join(this.dataDir, fileName);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist, return empty array
                return [];
            }
            throw error;
        }
    }

    // Write data to file
    async write(fileName, data) {
        try {
            const filePath = path.join(this.dataDir, fileName);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error writing file:', error);
            return false;
        }
    }

    // Append data to file
    async append(fileName, newData) {
        const existingData = await this.read(fileName);
        existingData.push(newData);
        return this.write(fileName, existingData);
    }

    // Update specific record
    async update(fileName, id, updatedData, idField = 'id') {
        const data = await this.read(fileName);
        const index = data.findIndex(item => item[idField] === id);

        if (index === -1) return false;

        data[index] = { ...data[index], ...updatedData };
        return this.write(fileName, data);
    }

    // Delete record
    async delete(fileName, id, idField = 'id') {
        const data = await this.read(fileName);
        const filtered = data.filter(item => item[idField] !== id);

        if (filtered.length === data.length) return false;

        return this.write(fileName, filtered);
    }

    // Find records by query
    async find(fileName, query = {}) {
        const data = await this.read(fileName);

        return data.filter(item => {
            for (const [key, value] of Object.entries(query)) {
                if (item[key] !== value) return false;
            }
            return true;
        });
    }

    // Get single record
    async findOne(fileName, query = {}) {
        const results = await this.find(fileName, query);
        return results[0] || null;
    }

    // Get user-specific records
    async getUserRecords(fileName, userId) {
        return this.find(fileName, { userId });
    }

    // Get records by date range
    async getRecordsByDateRange(fileName, startDate, endDate, dateField = 'date') {
        const data = await this.read(fileName);

        return data.filter(item => {
            const itemDate = new Date(item[dateField]);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
    }

    // Get statistics
    async getStats(fileName) {
        const data = await this.read(fileName);
        return {
            total: data.length,
            byDate: data.reduce((acc, item) => {
                const date = item.date || item.createdAt?.split('T')[0];
                if (date) {
                    acc[date] = (acc[date] || 0) + 1;
                }
                return acc;
            }, {})
        };
    }
}

module.exports = new FileStorage();