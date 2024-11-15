const client = require("../config");

const createSellingRequestDb = async (
  id_seller,
  id_data_format,
  name_dataset,
  expected_price,
  evolution,
  description,
  data_requirements
) => {
  const { rows: request } = await client.query(
    `
    INSERT INTO Data_selling_request (ID_seller, ID_data_format, Name_dataset, Expected_price, Evolution, Description, Data_requirements)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `,
    [id_seller, id_data_format, name_dataset, expected_price, evolution, description, data_requirements]
  );
  return request[0];
};

const createBuyingRequestDb = async (
  id_buyer,
  id_data_format,
  name_dataset,
  deposit,
  price,
  due_date,
  public_data,
  description,
  data_requirements,
) => {
  const { rows: request } = await client.query(
    `
    INSERT INTO Data_buying_request (ID_buyer, ID_data_format, Name_dataset, Deposit, Price, Due_date, Public_data, Description, Data_requirements)
    VALUES
    ($1, $2 , $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    `,
    [id_buyer, id_data_format, name_dataset, deposit, price, due_date, public_data, description, data_requirements]
  );
  return request[0];
};

const getRequestsHistoryByIdDb = async (id_user) => {
  const { rows: requests } = await client.query(
    `

        `
  );
  return requests;
};

const getAllSendingRequestsByIdDb = async (id) => {
  const { rows: requests } = await client.query(
    `
    SELECT da.Data_type, d.avatar, d.name_dataset, d.field, cen.confirm
    FROM Data_sending_request da
    JOIN Censorship_DSR cen ON da.ID_data_sending_request = cen.ID_data_sending_request
    JOIN Dataset d ON da.ID_dataset = d.ID_dataset
    GROUP BY da.ID_User,da.Data_type, d.avatar, d.name_dataset, d.field, cen.confirm
    HAVING da.ID_User = $1
    `,
    [id]
  );
  return requests;
};

const getAllBuyingRequestsByIdDb = async (id) => {
  const { rows: requests } = await client.query(
    `
    SELECT d.Description, d.Deposit, d.Price,d.Due_Date, d.data_type, cen.Confirm
    FROM Data_buying_request d
    JOIN Censorship_DBR cen ON d.ID_buying_request = cen.ID_buying_request
    WHERE d.id_user = $1
    `,
    [id]
  );
  return requests;
};

module.exports = {
  createSellingRequestDb,
  createBuyingRequestDb,
  getRequestsHistoryByIdDb,
  getAllSendingRequestsByIdDb,
  getAllBuyingRequestsByIdDb,
};
