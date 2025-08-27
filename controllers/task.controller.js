const Task = require("../models/task.model");
const pagination = require("../helpers/pagination");
const search = require("../helpers/search");
// [GET]/api/v1/tasks
module.exports.index = async (req, res) => {
  // Điều kiện tìm kiếm mặc định: chỉ lấy những task chưa bị xóa
  const find = {
    deleted: false,
  };

  // Nếu client truyền thêm query ?status=...
  // thì lọc thêm theo trạng thái (ví dụ: pending, completed)
  if (req.query.status) {
    find.status = req.query.status;
  }
  // Search
  let objectSearch = search(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }

  // Pagination (phân trang)
  // Đếm tổng số tasks thỏa điều kiện
  const countTasks = await Task.countDocuments(find);

  // Tạo object chứa thông tin phân trang:
  // - limit: số task trên 1 trang
  // - currentPage: trang hiện tại
  let objectPagination = pagination(
    {
      limit: 2, // mặc định mỗi trang có 2 task
      currentPage: 1, // mặc định đang ở trang 1
    },
    req.query, // lấy dữ liệu từ query string (ví dụ: ?page=2&limit=5)
    countTasks // tổng số task để tính toán
  );

  // SORT (sắp xếp)
  // Tạo object rỗng để lưu thông tin sắp xếp
  const sort = {};

  // Nếu client truyền sortKey (trường cần sắp xếp) và sortValue (kiểu sắp xếp: 1 hoặc -1)
  if (req.query.sortKey && req.query.sortValue) {
    // Gán cặp key:value vào object sort
    // Ví dụ: ?sortKey=createdAt&sortValue=-1  => sort = { createdAt: -1 }
    sort[req.query.sortKey] = req.query.sortValue;
  }

  // Truy vấn danh sách tasks từ MongoDB
  // - find: điều kiện lọc
  // - sort(sort): sắp xếp theo yêu cầu
  // - limit: giới hạn số lượng trả về trong 1 trang
  // - skip: bỏ qua (skip) số bản ghi để đến trang hiện tại
  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limit)
    .skip(objectPagination.skip);

  // Trả về dữ liệu dạng JSON cho client
  res.json(tasks);
};

// [GET]/api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const tasks = await Task.findOne({
      _id: id,
      deleted: false,
    });

    res.json(tasks);
  } catch (error) {
    res.json("Không tìm thấy !");
  }
};
// [PATCH]/api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Task.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công !",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái thất bại !",
    });
  }
};
// [PATCH]/api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    switch (key) {
      case "status":
        await Task.updateMany(
          {
            id: { $in: ids },
          },
          {
            status: value,
          }
        );
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công!",
        });

        break;

      default:
        res.json({
          code: 400,
          message: "Không tồn tại!",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!",
    });
  }
};
// [POST]/api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    const product = new Task(req.body);
    const data = await product.save();

    res.json({
      code: 200,
      message: "Tạo thành công!",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
// [PATCH]/api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne(
      {
        id: id,
      },
      req.body
    );
    res.json({
      code: 200,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
