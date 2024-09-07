const client = require("../config");

const createSendingRequestDb = async (
  id_user,
  data_type,
  id_dataset,
  description
) => {
  const { rows: request } = await client.query(
    `
        INSERT INTO Data_sending_request (ID_User, Data_type, ID_dataset, Description)
        VALUES ($1, $2, $3, $4)
        RETURNING ID_User, Data_type, ID_dataset, Description
        `,
    [id_user, data_type, id_dataset, description]
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
  createSendingRequestDb,
  getRequestsHistoryByIdDb,
  getAllSendingRequestsByIdDb,
  getAllBuyingRequestsByIdDb,
};
