import axios from 'axios';

const API_KEY = import.meta.env.VITE_PLANT_ID_API_KEY;
const API_URL = 'https://api.plant.id/v2/identify';

export interface PlantIdentification {
  id: number;
  name: string;
  commonNames: string[];
  confidence: number;
  description: string;
  taxonomy: {
    family: string;
    genus: string;
    species: string;
  };
  careInstructions: {
    watering: string;
    sunlight: string;
    soil: string;
  };
}

export async function identifyPlant(base64Image: string): Promise<PlantIdentification> {
  try {
    const response = await axios.post(
      API_URL,
      {
        images: [base64Image.split(',')[1]],
        plant_details: [
          'common_names',
          'taxonomy',
          'description',
          'care_instructions',
        ],
      },
      {
        headers: {
          'Api-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data.suggestions[0];
    
    // Extract the text value from complex objects
    const getTextValue = (obj: any) => {
      if (!obj) return '';
      return typeof obj === 'object' && obj.value ? obj.value : obj;
    };

    return {
      id: result.id,
      name: result.plant_name,
      commonNames: result.plant_details.common_names || [],
      confidence: result.probability,
      description: getTextValue(result.plant_details.description),
      taxonomy: {
        family: getTextValue(result.plant_details.taxonomy.family),
        genus: getTextValue(result.plant_details.taxonomy.genus),
        species: getTextValue(result.plant_details.taxonomy.species),
      },
      careInstructions: {
        watering: getTextValue(result.plant_details.care_instructions?.watering),
        sunlight: getTextValue(result.plant_details.care_instructions?.sunlight),
        soil: getTextValue(result.plant_details.care_instructions?.soil),
      },
    };
  } catch (error) {
    throw new Error('Failed to identify plant');
  }
}