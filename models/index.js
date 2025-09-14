// In-memory data storage (in production, this would be a database)
const data = {
  products: new Map(),
  users: new Map(),
  carts: new Map(),
  checkouts: new Map(),
  orders: new Map(),
  shipments: new Map(),
  returns: new Map(),
  supportTickets: new Map(),
  notifications: [],
  auditLogs: [],
};

// Helper functions for data operations
const generateId = (prefix) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}_${timestamp}_${random}`;
};

const validateId = (id, prefix) => {
  return id && id.startsWith(prefix);
};

// Generic CRUD operations
const createEntity = (collection, entity, idPrefix) => {
  const id = entity.id || generateId(idPrefix);
  entity.id = id;
  entity.created_at = new Date().toISOString();
  entity.updated_at = new Date().toISOString();
  data[collection].set(id, entity);
  return entity;
};

const getEntity = (collection, id) => {
  return data[collection].get(id);
};

const getAllEntities = (collection) => {
  return Array.from(data[collection].values());
};

const updateEntity = (collection, id, updates) => {
  const entity = data[collection].get(id);
  if (!entity) return null;

  const updatedEntity = { ...entity, ...updates };
  updatedEntity.updated_at = new Date().toISOString();
  data[collection].set(id, updatedEntity);
  return updatedEntity;
};

const deleteEntity = (collection, id) => {
  return data[collection].delete(id);
};

const searchEntities = (collection, filterFn) => {
  return Array.from(data[collection].values()).filter(filterFn);
};

module.exports = {
  data,
  generateId,
  validateId,
  createEntity,
  getEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
  searchEntities,
};
