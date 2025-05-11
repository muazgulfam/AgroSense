import { config } from 'dotenv';
config();

import '@/ai/flows/diagnose-crop-disease.ts';
import '@/ai/flows/suggest-remedies.ts';