const BaseModel = require('./BaseModel');

class DepartmentModel extends BaseModel {
    static async findAll() {
        const [rows] = await this.query(`
            SELECT 
                d.id,
                d.name,
                d.head,
                d.beds,
                d.status,
                d.color,
                d.description,
                d.image_url,
                d.tech,
                d.success_rate,
                d.procedures,
                d.publications,
                COUNT(doc.id) as doctor_count
            FROM departments d
            LEFT JOIN doctors doc ON doc.department_id = d.id
            GROUP BY d.id
            ORDER BY d.name
        `);
        return rows;
    }

    static async findByName(name, connection) {
        const [rows] = await this.query('SELECT id FROM departments WHERE name = ?', [name], connection);
        return rows[0] || null;
    }

    static async create(data, connection) {
        const { name, head, beds, status, color, description, publications, image_url } = data;
        const [result] = await this.query(
            'INSERT INTO departments (name, head, beds, status, color, description, publications, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, head, beds || 0, status || 'Active', color || 'bg-primary', description || '', JSON.stringify(publications || []), image_url || null],
            connection
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { name, head, beds, status, color, description, publications, image_url } = data;
        const [result] = await this.query(
            'UPDATE departments SET name = ?, head = ?, beds = ?, status = ?, color = ?, description = ?, publications = ?, image_url = ? WHERE id = ?',
            [name, head, beds || 0, status || 'Active', color || 'bg-primary', description || '', JSON.stringify(publications || []), image_url || null, id]
        );
        return result;
    }

    static async delete(id) {
        // First, nullify the department_id in doctors table to avoid FK constraints
        await this.query('UPDATE doctors SET department_id = NULL WHERE department_id = ?', [id]);

        const [result] = await this.query('DELETE FROM departments WHERE id = ?', [id]);
        return result;
    }
}

module.exports = DepartmentModel;
