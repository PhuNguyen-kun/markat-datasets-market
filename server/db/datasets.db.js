const client = require("../config");

const getAllDatasetsDb = async ({limit, offset }) => {
    const datasets = await client.query(
        `SELECT d.Avatar, d.Name_dataset,(SELECT COUNT(*) FROM User_Click uc WHERE uc.ID_Dataset = d.ID_Dataset) AS Views, d.Voucher,
        CASE
            WHEN v.Data_format = 1 THEN 'CSV'
            WHEN v.Data_format = 2 THEN 'Excel'
            -- Thêm các định dạng khác nếu cần
            ELSE 'Unknown'
        END AS Data_Format,
        (SELECT COUNT(*) FROM Version v WHERE v.ID_Dataset = d.ID_Dataset) AS Version_Count
        FROM
            Dataset d
        LEFT JOIN
            Version v ON d.ID_Dataset = v.ID_Dataset
        GROUP BY
            d.ID_Dataset, d.Avatar, d.Name_dataset, d.Voucher, v.Data_format
        ORDER BY
            d.ID_Dataset ASC
        OFFSET 0
        LIMIT 10
      `,
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