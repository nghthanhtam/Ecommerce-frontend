import React, { Component } from "react";
import { connect } from "react-redux";
import {
  deleteShop,
  updateShopStatus,
} from "../../../../state/actions/shopActions";
import { pushHistory } from "../../../../state/actions/historyActions";

const mapStateToProps = (state) => ({
  permissionAdmins: state.authAdmin.permissions,
});

class AShopRow extends Component {
  handleEdit = (id) => {
    this.props.pushHistory({
      pathname: "/admin/shop/edit",
      search: `?id=${id}`,
    });
  };

  handleApprove = (id) => {
    this.props.updateShopStatus({
      id,
      status: "accepted",
      pages: this.props.pages,
    });
  };

  handleDelete = (id) => {
    this.props.deleteShop(id);
  };

  handleEmpDetails = (idShop) => {
    this.props.pushHistory(`/admin/employee/shop/${idShop}`);
  };

  render() {
    const { shop, index } = this.props;

    return (
      <tr>
        <td>{index + 1}</td>
        <td>{shop.name}</td>
        <td>{shop.busLicenseId}</td>
        <td>{shop.city}</td>
        <td>{shop.url}</td>
        <td>{shop.phone}</td>
        <td>
          {shop.status == "pending"
            ? "Chờ duyệt"
            : shop.status == "accepted"
            ? "Đang hoạt động"
            : "Không được duyệt"}
        </td>
        <td>
          <div className="btn-group" style={{ display: "flex" }}>
            <button
              onClick={() => this.handleApprove(shop.id)}
              type="button"
              className="btn btn-primary"
            >
              Duyệt
            </button>
            <button
              onClick={() => this.handleEdit(shop.id)}
              type="button"
              className="btn btn-success"
            >
              Sửa
            </button>
            <button
              onClick={() => this.handleDelete(shop.id)}
              type="button"
              className="btn btn-danger"
            >
              Xóa
            </button>

            <button
              onClick={() => this.handleEmpDetails(shop.id)}
              type="button"
              className="btn btn-info"
            >
              Nhân viên
            </button>
          </div>
        </td>
      </tr>
    );
  }
}

export default connect(mapStateToProps, {
  deleteShop,
  pushHistory,
  updateShopStatus,
})(AShopRow);
