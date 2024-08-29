const client = require("../config");

const getAllDatasetsDb = async ({limit, offset }) => {
    const datasets = await client.query(
        `SELECT 
        d.Avatar, d.Name_dataset, COUNT(d.ID_Dataset) as number_of_viewer,d.Voucher,d.Field
        FROM Dataset d
        JOIN User_Click u ON d.ID_Dataset = u.ID_Dataset
        GROUP BY d.ID_Dataset
        ORDER BY d.ID_Dataset  ASC
        OFFSET $1 ROWS
        FETCH NEXT $2 ROWS ONLY`,
        [limit, offset]
    );
    return { items: orders.rows};
};

const getDatasetDb = async ({ id }) => {
    const { rows: order } = await client.query(
      `SELECT products.*, order_item.quantity 
        from orders 
        join order_item
        on order_item.order_id = orders.order_id
        join products 
        on products.product_id = order_item.product_id 
        where orders.order_id = $1 AND orders.user_id = $2`,
      [id]
    );
    return order;
};

const createDatasetDb = async ({
    reliability_minimum,
    avatar,
    name_dataset,
    voucher,
    field,
  }) => {
    const { rows: datasets } = await client.query(
      `
        INSERT INTO Dataset (Reliability_minimum, Avatar, Name_dataset, Voucher, Field)
        VALUES ($1,$2,$3,$4,$5)
        returning *
        `,
      [reliability_minimum, avatar,name_dataset,voucher,field]
    );
    return datasets[0];
};
  

module.exports = {
    getAllDatasetsDb,
    //getDatasetDb,
    createDatasetDb,
};