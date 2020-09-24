////ADMIN PAGE
import React, { Component, Fragment } from "react";
import Header from "./components/Content/Admin/Header";
import Footer from "./components/Content/Admin/Footer";
import Menu from "./components/Content/Admin/Menu";
import Category from "./components/Content/Admin/Category/Category";
import Product from "./components/Content/Admin/Product/Product";
import CategoryEdit from "./components/Content/Admin/Category/CategoryEdit";
import Member from "./components/Content/Admin/Member/Member";
import MemberEdit from "./components/Content/Admin/Member/MemberEdit";
import PaySlip from "./components/Content/Admin/PaySlip/PaySlip";
import PaySlipEdit from "./components/Content/Admin/PaySlip/PaySlipEdit";
import Invoice from "./components/Content/Admin/OrderAndInvoices/Invoice";
import StorageReport from "./components/Content/Admin/Report/StorageReport";
import SaleReport from "./components/Content/Admin/Report/SaleReport";
import DailyCheck from "./components/Content/Admin/Report/DailyCheck";
import InvoiceEdit from "./components/Content/Admin/OrderAndInvoices/InvoiceEdit";
import OrderScreen from "./components/Content/Admin/OrderAndInvoices/OrderScreen";
import Supplier from "./components/Content/Admin/Supplier/Supplier";
import SupplierEdit from "./components/Content/Admin/Supplier/SupplierEdit";
import ErrorPage from "./components/Content/Admin/ErrorPage/ErrorPage";
import Login from "./components/Content/Admin/Auth/Login";
import Home from "./components/Content/Admin/Home/Home";

import { loadUser } from "./actions/authActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Loader from "react-loader";
import { Route, Switch, Redirect } from "react-router-dom";
import Role from "./components/Content/Admin/Role/Role";
import RoleEdit from "./components/Content/Admin/Role/RoleEdit";
import Material from "./components/Content/Admin/Material/Material";
import MaterialEdit from "./components/Content/Admin/Material/MaterialEdit";
import User from "./components/Content/Admin/User/User";
import UserEdit from "./components/Content/Admin/User/UserEdit";
import { PrivateRoute } from "./components/Content/Admin/PrivateRoute";
import NoPermissionPage from "./components/Content/Admin/ErrorPage/NoPermissionPage";
import HomePage from "./components/Content/ShopNow/HomePage";

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  history: state.history,
  isLoaded: state.auth.isLoaded,
  user: state.auth.user,
  token: state.auth.token,
});
const roles = {
  category: "categoryManagement",
  role: "roleManagement",
  member: "memberManagement",
  product: "productManagement",
  user: "userManagement",
  invoice: "invoiceManagement",
  supplier: "supplierManagement",
  payslip: "payslipManagement",
  material: "materialManagement",
  materialReceiptNote: "materialReceiptNoteManagement",
};
class CoffeShop extends Component {
  state = {
    firstPathname: "/",
  };
  componentDidMount() {
    this.setState({
      firstPathname: this.props.history.history.location.pathname,
    });
    this.props.loadUser();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { token, isAuthenticated } = this.props;
    return (
      <Fragment>
        {!this.props.isLoaded ? (
          <Loader></Loader>
        ) : (
          <Switch>
            <Route exact path="/shopnow">
              <HomePage />
            </Route>
            <Route
              exact
              path="/"
              render={() => {
                return !isAuthenticated ? (
                  <Redirect to="/login" />
                ) : (
                  <Redirect to="/home" />
                );
              }}
            />

            <Route
              exact
              path="/login"
              render={() => {
                return !isAuthenticated ? <Login /> : <Redirect to="/home" />;
              }}
            />
            {isAuthenticated && (
              <Fragment>
                <Header />
                <Menu />

                <div className="content-wrapper">
                  <Switch>
                    <Route exact path="/home">
                      <Home />
                    </Route>
                    <Route path="/404">
                      <ErrorPage />
                    </Route>
                    <Route path="/403">
                      <NoPermissionPage />
                    </Route>
                    <PrivateRoute
                      exact
                      path="/category"
                      component={Category}
                      role={roles.category}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/add-product"
                      component={Product}
                      role={roles.product}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/role"
                      component={Role}
                      role={roles.role}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/supplier"
                      component={Supplier}
                      role={roles.supplier}
                      token={token}
                    ></PrivateRoute>

                    <PrivateRoute
                      exact
                      path="/member"
                      component={Member}
                      role={roles.member}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/role/edit/:id"
                      component={RoleEdit}
                      role={roles.role}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/category/edit/:id"
                      component={CategoryEdit}
                      role={roles.category}
                      token={token}
                    ></PrivateRoute>
                    <Route exact path="/material" component={Material}></Route>
                    <Route
                      exact
                      path="/material/edit/:id"
                      component={MaterialEdit}
                    />
                    <Route exact path="/user" component={User}></Route>
                    <Route exact path="/user/edit/:id" component={UserEdit} />

                    <PrivateRoute
                      exact
                      path="/supplier/edit/:id"
                      component={SupplierEdit}
                      role={roles.supplier}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/member/edit/:id"
                      component={MemberEdit}
                      role={roles.member}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/payslip"
                      component={PaySlip}
                      role={roles.payslip}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/payslip/edit/:id"
                      component={PaySlipEdit}
                      role={roles.payslip}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/invoice"
                      component={Invoice}
                      role={roles.invoice}
                      token={token}
                    ></PrivateRoute>
                    <PrivateRoute
                      exact
                      path="/invoice/edit/:id"
                      component={InvoiceEdit}
                      role={roles.invoice}
                      token={token}
                    ></PrivateRoute>

                    <Route
                      exact
                      path="/dailycheck"
                      component={DailyCheck}
                    ></Route>
                    <Route
                      exact
                      path="/storageReport"
                      component={StorageReport}
                    ></Route>
                    <Route
                      exact
                      path="/orderScreen"
                      component={OrderScreen}
                    ></Route>
                    <Route path="*" render={() => <Redirect to="/404" />} />

                    <Route
                      exact
                      path="/saleReport"
                      component={SaleReport}
                    ></Route>
                  </Switch>
                </div>
                <Footer />
              </Fragment>
            )}

            <Route path="*" render={() => <Redirect to="/login" />} />
          </Switch>
        )}
      </Fragment>
    );
  }
}

Category.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool,
  user: PropTypes.object,
};

export default connect(mapStateToProps, { loadUser })(CoffeShop);
