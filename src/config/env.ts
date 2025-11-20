import * as fs from 'fs';
import * as path from 'path';
import { TestData } from '../types/testDataType';

const raw = fs.readFileSync(path.resolve(__dirname, '../../data/test-data.json'), 'utf-8');
export const testData: TestData = JSON.parse(raw);

export const TEST_LANG = (process.env.TEST_LANG as 'EN' | 'AR' | 'ALL') || 'ALL';
export const BASE_URL = process.env.BASE_URL || 'https://beta-ask.u.ae/en/uask'; 
