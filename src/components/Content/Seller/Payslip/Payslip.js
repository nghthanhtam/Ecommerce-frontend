import React, { Component, Fragment } from "react";
import APayslipModal from "./PayslipModal";
import APayslipRow from "./PayslipRow";
import { connect } from "react-redux";
import { getPayslips } from "../../../../state/actions/payslipActions";
import { showModal } from "../../../../state/actions/modalActions";
import PropTypes from "prop-types";
import Loader from "react-loader";

const mapStateToProps = (state) => ({
  payslips: state.payslip.payslips,
  isLoaded: state.payslip.isLoaded,
  totalDocuments: state.payslip.totalDocuments,
  idShop: state.auth.role.idShop,
  permissions: state.auth.permissions,
  isUpdated: state.payslip.isUpdated,
});

class Payslip extends Component {
  state = {
    sort: [{ value: 5 }, { value: 10 }, { value: 20 }],
    limit: 5,
    page: 1,
    pages: [],
    query: "",
    start: 1,
    end: 5,
    isNextBtnShow: true,
    activeEmp: true,
    deletedEmp: false,
  };

  componentDidMount(prevProps, prevState, snapshot) {
    const { limit, page, query } = this.state;
    const { idShop } = this.props;
    this.props.getPayslips({
      limit,
      page,
      query,
      idShop,
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { isLoaded, isUpdated } = this.props;
    if (isLoaded == true && this.state.pages == prevState.pages) {
      this.getPages();
    }
    // if (isUpdated !== prevProps.isUpdated && isUpdated == false) {
    //   const { createNotification } = this.props;
    //   createNotification(mySuccessNotification);
    // }
  }

  getPages = () => {
    const { limit, query } = this.state;
    const { totalDocuments } = this.props;
    if (totalDocuments == 0) return;

    let newQuery = "";
    if (query === "") newQuery = "undefined";
    else newQuery = query;

    let pages = Math.floor(totalDocuments / limit);
    let remainder = totalDocuments % limit;
    let newArray = [];
    if (remainder !== 0) pages += 1;

    for (let i = 0; i < pages; i++) {
      newArray.push({ pageNumber: i + 1 });
    }

    //Nếu totalDocuments > 6 thì pageButtons được chia ra làm 3 nút số đầu - dấu 3 chấm - nút số cuối
    if (newArray && newArray.length > 6) {
      newArray = [
        { pageNumber: 1 },
        { pageNumber: 2 },
        { pageNumber: 3 },
        { pageNumber: "..." },
        { pageNumber: newArray.length },
      ];
    }
    this.setState({ pages: newArray });
  };

  handleOnChange = (e) => {
    e.persist();
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === "query") {
        this.setState({ page: 1 }, () => {
          this.rerenderPage();
        });
      } else {
        this.rerenderPage();
      }
    });
  };

  getStartEndDocuments() {
    const { limit, page } = this.state;
    const { totalDocuments } = this.props;

    let pages = Math.floor(totalDocuments / limit),
      remainder = totalDocuments % limit;
    if (remainder !== 0) pages += 1;

    this.setState({ start: (page - 1) * limit + 1 }, () => {
      let end;
      if (Math.floor(totalDocuments / limit) + 1 == page)
        end = (page - 1) * limit + (totalDocuments % limit);
      else end = page * limit;
      this.setState({ end: end });
    });
  }

  rerenderPage = () => {
    const { limit, page, query } = this.state;
    const { idShop } = this.props;
    this.props.getPayslips({
      limit,
      page,
      query,
      idShop,
    });
    this.getPages();
    this.getStartEndDocuments();
  };

  renderPayslips = () => {
    const { start, limit, page } = this.state;
    const { payslips, isLoaded } = this.props;

    return !isLoaded ? (
      <tr>
        <td>
          <Loader></Loader>
        </td>
      </tr>
    ) : (
      payslips.map((eachPayslip, index) => (
        <APayslipRow
          history={this.props.history}
          key={eachPayslip.id}
          payslip={eachPayslip}
          index={index + start - 1}
        />
      ))
    );
  };

  handleChoosePage = (e, pageNumber) => {
    e.preventDefault();
    if (pageNumber === "...") return;
    const { totalDocuments } = this.props;
    const { limit, page } = this.state;

    let pages = Math.floor(totalDocuments / limit),
      remainder = totalDocuments % limit;
    if (remainder !== 0) pages += 1;

    if (pageNumber === -1) {
      pageNumber = page + 1;
      if (pageNumber === pages) this.setState({ isNextBtnShow: false });
    } else {
      if (pageNumber === pages) this.setState({ isNextBtnShow: false });
      else this.setState({ isNextBtnShow: true });
    }

    this.setState({ page: pageNumber }, () => {
      const { limit, page, query } = this.state;
      const { idShop } = this.props;
      this.props.getPayslips({
        limit,
        page,
        query,
        idShop,
      });
      this.getStartEndDocuments();
    });
  };

  renderSelect = () => {
    const { sort, limit } = this.state;
    return (
      <select
        onChange={this.handleOnChange}
        name="limit"
        aria-controls="example1"
        style={{ margin: "0px 5px" }}
        className="form-control input-sm"
        value={limit}
      >
        {sort.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    );
  };

  renderPageButtons = () => {
    const { pages, page, isNextBtnShow } = this.state;
    if (pages.length > 1) {
      return (
        <>
          {pages.map((eachButton) => (
            <li
              key={eachButton.pageNumber}
              className={
                page === eachButton.pageNumber
                  ? "paginae_button active"
                  : "paginate_button "
              }
            >
              <a
                className="paga-link"
                name="page"
                href="#"
                onClick={(e) => this.handleChoosePage(e, eachButton.pageNumber)}
              >
                {eachButton.pageNumber}
              </a>
            </li>
          ))}
          <li className="paginate_button">
            <a
              className={
                isNextBtnShow === true ? "paga-link" : "paga-link_hidden"
              }
              name="currentPage"
              href="#"
              onClick={(e) => this.handleChoosePage(e, -1)}
            >
              {">>"}
            </a>
          </li>
        </>
      );
    }
  };

  render() {
    const { limit, page, start, end, query } = this.state;
    const { totalDocuments, idShop, permissions } = this.props;
    return (
      <Fragment>
        <section className="content-header">
          <h1></h1>
          <ol className="breadcrumb" style={{ float: "right" }}>
            <li>
              <a href="/admin">
                <i className="fa fa-dashboard" /> Trang chủ
              </a>
            </li>
            <li>
              <a href="/admin/payslip">Mã giảm giá</a>
            </li>
          </ol>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="box">
                <div className="box-header" style={{ marginTop: "5px" }}>
                  <div style={{ paddingLeft: "5px" }} className="col-md-8">
                    <h3 className="box-title">Quản lý phiếu chi</h3>
                  </div>
                  {permissions.includes("createPayslip") && (
                    <div className="col-md-4">
                      <APayslipModal pages={{ limit, page, query, idShop }} />
                    </div>
                  )}
                </div>
                <div className="box-body">
                  <div
                    id="example1_wrapper"
                    className="dataTables_wrapper form-inline dt-bootstrap"
                  >
                    <div className="row">
                      <div>
                        <div className="col-sm-6">
                          <div
                            className="dataTables_length"
                            id="example1_length"
                          >
                            <label>
                              Hiển thị
                              {this.renderSelect()}
                              kết quả
                            </label>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div
                            id="example1_filter"
                            className="dataTables_filter"
                            style={{ float: "right" }}
                          >
                            <label>
                              Tìm kiếm:
                              <input
                                type="search"
                                name="query"
                                style={{ margin: "0px 0px 0px 5px" }}
                                className="form-control input-sm"
                                placeholder="Nhập từ khóa... "
                                aria-controls="example1"
                                onChange={this.handleOnChange}
                                value={query}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12">
                        <table
                          id="example1"
                          className="table table-bordered table-striped"
                        >
                          <thead>
                            <tr>
                              <th style={{ width: "5%" }}>Stt</th>
                              <th style={{ width: "8%" }}>Nhân viên</th>
                              <th style={{ width: "10%" }}>Loại phiếu chi</th>
                              <th style={{ width: "15%" }}>Tiêu đề</th>
                              <th style={{ width: "10%" }}>Tổng tiền </th>
                              <th style={{ width: "8%" }}>Ngày tạo </th>
                              {(permissions.includes("editPayslip") ||
                                permissions.includes("deletePayslip")) && (
                                <th style={{ width: "10%" }}>Thao tác</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>{this.renderPayslips()}</tbody>
                          <tfoot>
                            <tr>
                              <th>Stt</th>
                              <th>Nhân viên</th>
                              <th>Loại phiếu chi</th>
                              <th>Tiêu đề</th>
                              <th>Tổng tiền</th>
                              <th>Ngày tạo </th>
                              {(permissions.includes("editPayslip") ||
                                permissions.includes("deletePayslip")) && (
                                <th>Thao tác</th>
                              )}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-5">
                        <div
                          className="dataTables_info"
                          id="example1_info"
                          role="status"
                          aria-live="polite"
                        >
                          Hiển thị{" "}
                          {query == ""
                            ? start +
                              " đến " +
                              (totalDocuments < end ? totalDocuments : end) +
                              " trong "
                            : ""}{" "}
                          {totalDocuments} kết quả
                        </div>
                      </div>
                      <div className="col-sm-7">
                        <div
                          className="dataTables_paginate paging_simple_numbers"
                          id="example1_paginate"
                        >
                          <ul className="pagination" style={{ float: "right" }}>
                            {this.renderPageButtons()}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

Payslip.propTypes = {
  getPayslips: PropTypes.func.isRequired,
  payslips: PropTypes.array.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  totalDocuments: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, {
  getPayslips,
  showModal,
})(Payslip);
