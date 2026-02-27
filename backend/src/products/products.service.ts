import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
    findAll() {
        const dbPath = path.resolve(process.cwd(), 'data/db.json');
        if (!fs.existsSync(dbPath)) return [];
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data).products || [];
    }

    findExtraIngredients() {
        const dbPath = path.resolve(process.cwd(), 'data/db.json');
        if (!fs.existsSync(dbPath)) return [];
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data).extraIngredients || [];
    }
}
