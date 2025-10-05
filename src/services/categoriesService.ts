import type { CreationAttributes } from "sequelize";
import type Categories from "../models/categoriesModel.js";
import categoriesRepository from "../repository/categoriesRepository.js";
import { ApiResponse } from "../core/responseSchedule.js";
import category_translationsRepository from "../repository/category_translationsRepository.js";


interface CategoryOutput {
  cat_id: number;
  text: string;
}


class CategoriesService {
  async findById(id: string): Promise<ApiResponse<Categories | null>> {
    try {
      const result = await categoriesRepository.findById(id);
      if (result != null) {
        const response = new ApiResponse(200, "success", result);
        return response;
      } else {
        return new ApiResponse(500, "Error to find", null);
      }
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async getAll(codeLang?: string): Promise<ApiResponse<CategoryOutput[] | null>> {
  try {
    if (codeLang) {
      const res = await category_translationsRepository.getAllCategoryByCode(codeLang);
      if(!res){
        return new ApiResponse(500, "Error to getAll", null);
      }
      const categories = res.map((t) => ({
        cat_id: t.dataValues.category_id,
        text: t.dataValues.translation,
      }));
      return new ApiResponse<CategoryOutput[]>(200, "success", categories);
    } else {
      const result = await categoriesRepository.getAll();
      if (!result) {
        return new ApiResponse(500, "Error to getAll", null);
      }

      // Mapeamos el resultado base al mismo formato
      const categories = result.map((c: any) => ({
        cat_id: c.dataValues.cat_id,
        text: c.dataValues.text, // o el campo que uses para el texto
      }));

      return new ApiResponse<CategoryOutput[]>(200, "success", categories);
    }
  } catch (error) {
    return new ApiResponse(500, (error as Error).message, null);
  }
}


  async create(
    category: CreationAttributes<Categories>
  ): Promise<ApiResponse<Categories | null>> {
    try {
      const exist = await categoriesRepository.findByName(
        category.text.toLowerCase()
      );
      if (!exist) {
        const result = await categoriesRepository.create(category);
        if (result) {
          return new ApiResponse(201, "success", null);
        } else {
          return new ApiResponse(500, "Error to create", null);
        }
      } else {
        return new ApiResponse(409, "Category is already registered", null);
      }
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async update(
    id: string,
    data: Partial<CreationAttributes<Categories>>
  ): Promise<ApiResponse<number | null>> {
    try {
      const exist = await categoriesRepository.findById(id);
      if (!exist) {
        return new ApiResponse(404, "not found", null);
      }
      const result = await categoriesRepository.update(id, data);

      if (!result) {
        return new ApiResponse(502, "Error to update", null);
      }

      return new ApiResponse(201, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async deleteCat(id: string): Promise<ApiResponse<number | null>> {
    try {
      const exist = await categoriesRepository.findById(id);
      if (!exist) {
        return new ApiResponse(404, "not found", null);
      }
      const result = await categoriesRepository.deleteCat(id);
      if (!result) {
        return new ApiResponse(502, "Error to update", null);
      }

      return new ApiResponse(201, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new CategoriesService();
