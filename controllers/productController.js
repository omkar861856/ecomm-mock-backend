const {
  createEntity,
  getEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
  searchEntities,
} = require("../models");
const { validateProduct } = require("../models/Product");

// Create a new product
const createProduct = (req, res) => {
  try {
    const validatedProduct = validateProduct(req.body);
    const product = createEntity("products", validatedProduct, "prod");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all products
const getAllProducts = (req, res) => {
  try {
    const { category, brand, search, page = 1, limit = 10 } = req.query;
    let products = getAllEntities("products");

    // Apply filters
    if (category) {
      products = products.filter((product) =>
        product.categories.some((cat) =>
          cat.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (brand) {
      products = products.filter((product) =>
        product.brand.toLowerCase().includes(brand.toLowerCase())
      );
    }

    if (search) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(products.length / limit),
        total_items: products.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get product by ID
const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = getEntity("products", id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Update product
const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const validatedProduct = validateProduct(req.body);

    const updatedProduct = updateEntity("products", id, validatedProduct);

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete product
const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteEntity("products", id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// Get product variants
const getProductVariants = (req, res) => {
  try {
    const { id } = req.params;
    const product = getEntity("products", id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product.variants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product variants",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductVariants,
};
